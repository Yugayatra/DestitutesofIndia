// Donate page functionality
document.addEventListener('DOMContentLoaded', function() {
    const scanQRBtn = document.getElementById('scanQRBtn');
    const qrScannerModal = document.getElementById('qrScannerModal');
    const startScannerBtn = document.getElementById('startScannerBtn');
    const closeScannerBtn = document.getElementById('closeScannerBtn');
    const scannerVideo = document.getElementById('scannerVideo');
    const scannerCanvas = document.getElementById('scannerCanvas');

    let scannerStream = null;

    // QR Scanner functionality
    scanQRBtn.addEventListener('click', function() {
        qrScannerModal.style.display = 'block';
        qrScannerModal.classList.add('fade-in');
    });

    closeScannerBtn.addEventListener('click', function() {
        closeScanner();
    });

    startScannerBtn.addEventListener('click', function() {
        startQRScanner();
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === qrScannerModal) {
            closeScanner();
        }
    });

    function startQRScanner() {
        navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 640 },
                height: { ideal: 480 }
            } 
        })
        .then(function(stream) {
            scannerStream = stream;
            scannerVideo.srcObject = stream;
            startScannerBtn.style.display = 'none';
            
            // Start QR code detection
            detectQRCode();
        })
        .catch(function(error) {
            console.error('Error accessing camera for QR scanner:', error);
            alert('Unable to access camera for QR scanning. Please ensure camera permissions are granted.');
        });
    }

    function detectQRCode() {
        const context = scannerCanvas.getContext('2d');
        
        function scan() {
            if (scannerVideo.readyState === scannerVideo.HAVE_ENOUGH_DATA) {
                scannerCanvas.height = scannerVideo.videoHeight;
                scannerCanvas.width = scannerVideo.videoWidth;
                context.drawImage(scannerVideo, 0, 0, scannerCanvas.width, scannerCanvas.height);
                
                const imageData = context.getImageData(0, 0, scannerCanvas.width, scannerCanvas.height);
                
                // Simple QR code detection (in a real implementation, you'd use a QR library)
                // For now, we'll simulate QR detection
                setTimeout(() => {
                    // Simulate QR code detection
                    const detectedQR = simulateQRDetection();
                    if (detectedQR) {
                        handleQRCodeDetected(detectedQR);
                        return;
                    }
                    
                    // Continue scanning
                    requestAnimationFrame(scan);
                }, 100);
            } else {
                requestAnimationFrame(scan);
            }
        }
        
        scan();
    }

    function simulateQRDetection() {
        // Simulate QR code detection with a random chance
        if (Math.random() < 0.01) { // 1% chance per frame
            return {
                data: 'upi://pay?pa=yugayatra@upi&pn=YugaYatra%20Retail&am=100&cu=INR',
                format: 'QR_CODE'
            };
        }
        return null;
    }

    function handleQRCodeDetected(qrData) {
        console.log('QR Code detected:', qrData);
        
        // Stop scanner
        if (scannerStream) {
            scannerStream.getTracks().forEach(track => track.stop());
            scannerStream = null;
        }
        
        // Show success message
        showNotification('QR Code detected! Processing payment...', 'success');
        
        // Close scanner modal
        closeScanner();
        
        // Simulate payment processing
        setTimeout(() => {
            showNotification('Payment processed successfully! Thank you for your donation.', 'success');
        }, 2000);
    }

    function closeScanner() {
        if (scannerStream) {
            scannerStream.getTracks().forEach(track => track.stop());
            scannerStream = null;
        }
        qrScannerModal.style.display = 'none';
        startScannerBtn.style.display = 'inline-flex';
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            console.log('Contact form submitted:', data);
            
            // Show success message
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }

    // Payment method interactions
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            const methodType = this.querySelector('h4').textContent;
            showNotification(`Redirecting to ${methodType} payment...`, 'info');
            
            // Simulate payment redirect
            setTimeout(() => {
                showNotification('Payment gateway opened. Please complete your transaction.', 'info');
            }, 1000);
        });
    });

    // Impact stats animation
    const statItems = document.querySelectorAll('.stat-item');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statItems.forEach(item => {
        observer.observe(item);
    });

    // Generate QR code for donation
    generateDonationQR();
});

function generateDonationQR() {
    const qrCode = document.getElementById('qrCode');
    
    // Create a simple QR code representation
    // In a real implementation, you'd use a QR code library like qrcode.js
    const qrData = {
        upi: 'yugayatra@upi',
        name: 'YugaYatra Retail',
        amount: '100',
        currency: 'INR'
    };
    
    // Create QR code using canvas (simplified version)
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Draw a simple QR-like pattern
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 200, 200);
    
    ctx.fillStyle = '#000';
    // Draw QR code pattern (simplified)
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
            if (Math.random() > 0.5) {
                ctx.fillRect(i * 8, j * 8, 8, 8);
            }
        }
    }
    
    // Add corner markers
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 40, 40);
    ctx.fillRect(160, 0, 40, 40);
    ctx.fillRect(0, 160, 40, 40);
    
    // Replace the icon with the generated QR code
    qrCode.innerHTML = '';
    qrCode.appendChild(canvas);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
} 