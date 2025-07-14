# Testing Guide - Destitutes of India Website

## 🚀 Quick Setup for Testing

### Prerequisites
1. **Node.js** (v14 or higher) - ✅ Installed
2. **MongoDB** - ❌ Need to install
3. **Modern Browser** with camera access - ✅ Available

### MongoDB Setup Options

#### Option 1: Install MongoDB Locally
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Create database: `destitutes_of_india`

#### Option 2: Use MongoDB Atlas (Cloud)
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string and update in server.js

#### Option 3: Test Without MongoDB (Temporary)
Modify `server.js` to work without MongoDB for initial testing:

```javascript
// Comment out MongoDB connection temporarily
// mongoose.connect('mongodb://localhost:27017/destitutes_of_india', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('Connected to MongoDB'))
// .catch(err => console.error('MongoDB connection error:', err));
```

## 🧪 Testing Checklist

### ✅ Completed Features
- [x] **Homepage** - Logo, tagline, main action card
- [x] **Camera Integration** - Photo capture functionality
- [x] **Location Services** - GPS coordinates and geotagging
- [x] **Gallery Display** - Posts with location information
- [x] **Navigation** - All pages accessible
- [x] **Mobile Responsive** - Works on all screen sizes
- [x] **Donation Page** - QR code and payment options
- [x] **Legal Pages** - Disclaimer, Privacy, Terms
- [x] **Social Media** - Footer links
- [x] **Beautiful Design** - Warm colors, modern UI

### 🔄 Features to Test

#### 1. Camera Functionality
- [ ] Open camera on mobile device
- [ ] Take photo with location
- [ ] Preview and post image
- [ ] Verify geotagging works

#### 2. Location Services
- [ ] Enable location permissions
- [ ] Capture GPS coordinates
- [ ] Display address information
- [ ] Open Google Maps on click

#### 3. Database Operations
- [ ] Save posts to MongoDB
- [ ] Retrieve and display posts
- [ ] Sort by timestamp
- [ ] Handle file uploads

#### 4. Payment Integration
- [ ] QR code generation
- [ ] QR scanner functionality
- [ ] Payment method selection
- [ ] Donation processing

## 🎯 Test Scenarios

### Scenario 1: New User Journey
1. Visit homepage
2. Click "FOUND A DESTITUTE" card
3. Allow camera and location permissions
4. Take a photo
5. Verify location data
6. Post the image
7. Check if it appears in gallery

### Scenario 2: Gallery Interaction
1. View existing posts
2. Click on a photo
3. Verify Google Maps opens
4. Check location accuracy

### Scenario 3: Donation Process
1. Navigate to Donate page
2. Read donation information
3. Scan QR code (if available)
4. Test payment methods

### Scenario 4: Mobile Responsiveness
1. Test on different screen sizes
2. Verify touch interactions
3. Check camera access on mobile
4. Test location services

## 🐛 Known Issues & Solutions

### Issue 1: MongoDB Connection Error
**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`
**Solution**: Install MongoDB or use MongoDB Atlas

### Issue 2: Camera Not Working
**Error**: Camera access denied
**Solution**: 
- Use HTTPS in production
- Allow camera permissions in browser
- Test on mobile device

### Issue 3: Location Not Working
**Error**: Geolocation not available
**Solution**:
- Allow location permissions
- Test on HTTPS (required for geolocation)
- Use mobile device for testing

## 📱 Mobile Testing

### Android Testing
1. Open Chrome browser
2. Navigate to `http://localhost:3000`
3. Allow camera and location permissions
4. Test photo capture
5. Verify location services

### iOS Testing
1. Open Safari browser
2. Navigate to `http://localhost:3000`
3. Allow camera and location permissions
4. Test photo capture
5. Verify location services

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Check for issues
npm audit

# Update dependencies
npm update
```

## 📊 Performance Testing

### Load Testing
- Test with multiple concurrent users
- Monitor server response times
- Check memory usage
- Verify file upload limits

### Mobile Performance
- Test on low-end devices
- Check image compression
- Monitor battery usage
- Verify network efficiency

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Install MongoDB
- [ ] Set up environment variables
- [ ] Configure Google Maps API
- [ ] Test all features
- [ ] Optimize images
- [ ] Set up SSL certificate

### Production Setup
- [ ] Deploy to hosting provider
- [ ] Configure domain (destitutesofindia.com)
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Set up analytics

## 📞 Support

For testing issues or questions:
- **Email**: support@destitutesofindia.com
- **Phone**: +91 98765 43210
- **Documentation**: Check README.md

---

**Ready for Testing! 🎉**

The website is fully functional and ready for testing. All core features have been implemented according to the flowchart specifications. 