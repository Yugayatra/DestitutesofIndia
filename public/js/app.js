// Global variables
let stream = null;
let capturedImage = null;
let currentLocation = null;

// DOM elements
const actionCard = document.getElementById('actionCard');
const cameraInterface = document.getElementById('cameraInterface');
const previewInterface = document.getElementById('previewInterface');
const takePictureBtn = document.getElementById('takePictureBtn');
const captureBtn = document.getElementById('captureBtn');
const cancelBtn = document.getElementById('cancelBtn');
const postBtn = document.getElementById('postBtn');
const retakeBtn = document.getElementById('retakeBtn');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const previewImage = document.getElementById('previewImage');
const locationText = document.getElementById('locationText');
const galleryGrid = document.getElementById('galleryGrid');
const loadingSpinner = document.getElementById('loadingSpinner');
const locationModal = document.getElementById('locationModal');
const successModal = document.getElementById('successModal');
const enableLocationBtn = document.getElementById('enableLocationBtn');
const cancelLocationBtn = document.getElementById('cancelLocationBtn');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    setupEventListeners();
    setupMobileMenu();
});

function setupEventListeners() {
    takePictureBtn.addEventListener('click', startCamera);
    captureBtn.addEventListener('click', capturePhoto);
    cancelBtn.addEventListener('click', stopCamera);
    postBtn.addEventListener('click', postImage);
    retakeBtn.addEventListener('click', retakePhoto);
    enableLocationBtn.addEventListener('click', enableLocation);
    cancelLocationBtn.addEventListener('click', closeLocationModal);
    closeSuccessBtn.addEventListener('click', closeSuccessModal);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === locationModal) {
            closeLocationModal();
        }
        if (event.target === successModal) {
            closeSuccessModal();
        }
    });
}

function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// Camera functionality
async function startCamera() {
    try {
        // Check if location is enabled
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }

        // Request location permission first
        const locationPermission = await checkLocationPermission();
        if (!locationPermission) {
            showLocationModal();
            return;
        }

        // Get fresh current location (don't use cached location)
        await getCurrentLocation();

        // Start camera
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        video.srcObject = stream;
        actionCard.style.display = 'none';
        cameraInterface.style.display = 'block';
        cameraInterface.classList.add('fade-in');
        
    } catch (error) {
        console.error('Error starting camera:', error);
        alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
}

function capturePhoto() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    capturedImage = canvas.toDataURL('image/jpeg', 0.8);
    previewImage.src = capturedImage;
    
    cameraInterface.style.display = 'none';
    previewInterface.style.display = 'block';
    previewInterface.classList.add('fade-in');
    
    stopCamera();
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
}

function retakePhoto() {
    previewInterface.style.display = 'none';
    actionCard.style.display = 'block';
    capturedImage = null;
    currentLocation = null;
}

// Location functionality
function checkLocationPermission() {
    return new Promise((resolve) => {
        if (!navigator.permissions) {
            resolve(true); // Assume permission granted if permissions API not available
            return;
        }
        
        navigator.permissions.query({ name: 'geolocation' })
            .then(result => {
                resolve(result.state === 'granted');
            })
            .catch(() => {
                resolve(true); // Assume permission granted on error
            });
    });
}

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                
                console.log('Location captured:', currentLocation); // Debug log
                
                // Get address from coordinates
                getAddressFromCoordinates(currentLocation.latitude, currentLocation.longitude)
                    .then(address => {
                        currentLocation.address = address;
                        locationText.textContent = address;
                        console.log('Address resolved:', address); // Debug log
                        resolve();
                    })
                    .catch((error) => {
                        console.error('Address lookup failed:', error);
                        currentLocation.address = `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`;
                        locationText.textContent = currentLocation.address;
                        resolve();
                    });
            },
            (error) => {
                console.error('Error getting location:', error);
                let errorMessage = 'Unable to get location. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please enable location permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                    default:
                        errorMessage += 'Unknown error occurred.';
                }
                alert(errorMessage);
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0 // Don't use cached location, always get fresh data
            }
        );
    });
}

// Function to refresh location data
async function refreshLocation() {
    if (currentLocation) {
        console.log('Refreshing location data...');
        await getCurrentLocation();
    }
}

async function getAddressFromCoordinates(lat, lng) {
    try {
        // First try with Google Geocoding API
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBWk1Vc65ce2-gomR_OfqTD7D1unkQ6Ak`);
        const data = await response.json();
        
        if (data.results && data.results[0]) {
            return data.results[0].formatted_address;
        }
        
        // Fallback to reverse geocoding with OpenStreetMap
        const osmResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const osmData = await osmResponse.json();
        
        if (osmData.display_name) {
            return osmData.display_name;
        }
        
        // Final fallback
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
        console.error('Error getting address:', error);
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
}

function showLocationModal() {
    locationModal.style.display = 'block';
    locationModal.classList.add('fade-in');
}

function closeLocationModal() {
    locationModal.style.display = 'none';
}

function enableLocation() {
    closeLocationModal();
    getCurrentLocation()
        .then(() => {
            startCamera();
        })
        .catch((error) => {
            console.error('Error enabling location:', error);
            alert('Unable to get location. Please enable location services and try again.');
        });
}

// Post functionality
async function postImage() {
    if (!capturedImage || !currentLocation) {
        alert('Please capture an image and ensure location is available.');
        return;
    }

    try {
        postBtn.disabled = true;
        postBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';

        // Convert base64 to blob
        const response = await fetch(capturedImage);
        const blob = await response.blob();

        // Create form data
        const formData = new FormData();
        formData.append('image', blob, 'destitute-photo.jpg');
        formData.append('latitude', currentLocation.latitude);
        formData.append('longitude', currentLocation.longitude);
        formData.append('address', currentLocation.address);
        formData.append('locationDetails', JSON.stringify({
            address: currentLocation.address,
            timestamp: new Date().toISOString()
        }));

        // Send to PHP backend
        const result = await fetch('upload.php', {
            method: 'POST',
            body: formData
        });

        if (!result.ok) {
            throw new Error('Failed to post image');
        }

        const post = await result.json();
        if (post.status !== 'success') {
            throw new Error(post.message || 'Failed to post image');
        }
        
        // Show success modal
        showSuccessModal();
        
        // Reset interface
        previewInterface.style.display = 'none';
        actionCard.style.display = 'block';
        capturedImage = null;
        currentLocation = null;
        
        // Reload posts to show the new post
        await loadPosts();
        
    } catch (error) {
        console.error('Error posting image:', error);
        alert('Failed to post image. Please try again.');
    } finally {
        postBtn.disabled = false;
        postBtn.innerHTML = '<i class="fas fa-upload"></i> Post it';
    }
}

function showSuccessModal() {
    successModal.style.display = 'block';
    successModal.classList.add('fade-in');
}

function closeSuccessModal() {
    successModal.style.display = 'none';
}

// Gallery functionality
async function loadPosts() {
    try {
        loadingSpinner.style.display = 'block';
        galleryGrid.innerHTML = '';

        const response = await fetch('api_posts.php');
        if (!response.ok) throw new Error('Network response was not ok');
        const posts = await response.json();

        console.log('Loaded posts:', posts); // Debug log

        if (!posts || posts.length === 0) {
            galleryGrid.innerHTML = '<div class="no-posts">No posts yet. Be the first to share!</div>';
            return;
        }

        posts.reverse().forEach(post => {
            console.log('Creating post card for:', post); // Debug log
            const postCard = createPostCard(post);
            galleryGrid.appendChild(postCard);
        });

    } catch (error) {
        console.error('Error loading posts:', error);
        galleryGrid.innerHTML = '<div class="error-message">Failed to load posts. Please try again later.</div>';
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card beautiful-frame fade-in';
    const timestamp = new Date(post.timestamp).toLocaleString();
    
    // Improved image path handling
    let imgSrc = post.imageUrl || post.imageurl || '';
    
    // Ensure the path starts with a forward slash for absolute paths
    if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) {
        imgSrc = '/' + imgSrc;
    }
    
    // If no image URL, use a placeholder
    if (!imgSrc) {
        imgSrc = '/images/logo.png';
    }
    
    // Format location display
    const latitude = parseFloat(post.latitude);
    const longitude = parseFloat(post.longitude);
    const locationDisplay = post.address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    
    card.innerHTML = `
        <div class="post-image-frame">
            <img src="${imgSrc}" alt="Destitute photo" class="post-image" 
                 onerror="this.onerror=null; this.src='/images/logo.png'; console.log('Image failed to load:', '${imgSrc}');">
        </div>
        <div class="post-info">
            <div class="post-location clickable-location" data-lat="${latitude}" data-lng="${longitude}">
                <i class="fas fa-map-marker-alt"></i>
                <span>${locationDisplay}</span>
                <i class="fas fa-external-link-alt location-link-icon"></i>
            </div>
            <div class="post-timestamp">
                <i class="fas fa-clock"></i>
                <span>${timestamp}</span>
            </div>
        </div>
    `;
    
    // Add click handler to open image in new tab for debugging
    const img = card.querySelector('.post-image');
    img.addEventListener('click', () => {
        console.log('Image clicked:', imgSrc);
        window.open(imgSrc, '_blank');
    });
    
    // Add click handler for location to open Google Maps
    const locationElement = card.querySelector('.clickable-location');
    locationElement.addEventListener('click', () => {
        const lat = locationElement.getAttribute('data-lat');
        const lng = locationElement.getAttribute('data-lng');
        console.log('Opening Google Maps for:', lat, lng);
        openInMaps(lat, lng);
    });
    
    return card;
}

function openInMaps(latitude, longitude) {
    try {
        // Validate coordinates
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        
        if (isNaN(lat) || isNaN(lng)) {
            console.error('Invalid coordinates:', latitude, longitude);
            alert('Invalid location coordinates');
            return;
        }
        
        // Try multiple map providers
        const mapUrls = [
            `https://www.google.com/maps?q=${lat},${lng}`,
            `https://maps.google.com/maps?q=${lat},${lng}`,
            `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`,
            `https://www.bing.com/maps?cp=${lat}~${lng}&lvl=15`
        ];
        
        // Try to open Google Maps first
        const googleMapsUrl = mapUrls[0];
        const mapWindow = window.open(googleMapsUrl, '_blank');
        
        if (!mapWindow) {
            // If popup blocked, try to redirect
            alert('Popup blocked. Please allow popups for this site to open maps.');
            window.location.href = googleMapsUrl;
        }
        
        console.log('Opening maps for coordinates:', lat, lng);
        
    } catch (error) {
        console.error('Error opening maps:', error);
        alert('Unable to open maps. Please try again.');
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: #fff;
        font-weight: 500;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification.info {
        background: #3498db;
    }
    
    .notification.success {
        background: #27ae60;
    }
    
    .notification.error {
        background: #e74c3c;
    }
    
    .notification.fade-out {
        animation: slideOut 0.3s ease-in;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .no-posts {
        text-align: center;
        padding: 40px;
        color: #7f8c8d;
        font-size: 1.1rem;
    }
    
    .error-message {
        text-align: center;
        padding: 40px;
        color: #e74c3c;
        font-size: 1.1rem;
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet); 