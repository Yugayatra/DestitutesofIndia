# Destitutes of India - Website

A comprehensive platform for documenting and supporting destitutes across India, developed by YugaYatra Retail (Opc) Pvt Ltd.

## 🌟 Features

### Core Functionality
- **Photo Documentation**: Take and upload photos of destitutes with geolocation
- **Location Tracking**: GPS coordinates and address mapping for each post
- **Real-time Gallery**: View all documented cases on the homepage
- **Google Maps Integration**: Click photos to open exact locations in Google Maps
- **Mobile Responsive**: Optimized for smartphone usage

### User Experience
- **Camera Integration**: Direct camera access for photo capture
- **Location Permissions**: Automatic location detection and permission handling
- **Geotagging**: Automatic timestamp, date, and location details
- **Social Media Integration**: Links to all major social platforms
- **Donation System**: QR code scanner and multiple payment options

### Technical Features
- **Node.js Backend**: Express server with RESTful APIs
- **MongoDB Database**: Scalable NoSQL database for data storage
- **File Upload**: Secure image upload with validation
- **Geolocation API**: Google Maps and Geocoding integration
- **Mobile-First Design**: Responsive CSS with modern animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Modern web browser with camera access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd destitutes-of-india
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `destitutes_of_india`

4. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Access the website**
   - Open your browser and go to `http://localhost:3000`
   - Allow camera and location permissions when prompted

## 📁 Project Structure

```
destitutes-of-india/
├── public/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   ├── app.js            # Main JavaScript functionality
│   │   └── donate.js         # Donation page functionality
│   ├── images/               # Logo and static images
│   ├── uploads/              # User uploaded photos
│   ├── index.html            # Homepage
│   ├── about.html            # About Us page
│   ├── contact.html          # Contact page
│   ├── mission.html          # Mission & Vision page
│   ├── donate.html           # Donation page
│   ├── disclaimer.html       # Legal disclaimer
│   ├── privacy.html          # Privacy policy
│   └── terms.html            # Terms of use
├── server.js                 # Express server
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Vanilla JS with modern features
- **Font Awesome**: Icons and UI elements
- **Google Fonts**: Poppins typography

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

### APIs & Services
- **Google Maps API**: Location services
- **Geolocation API**: Browser location detection
- **Camera API**: Photo capture functionality

## 📱 Mobile Features

- **Touch-friendly UI**: Optimized for mobile interaction
- **Camera Access**: Direct camera integration
- **GPS Location**: Automatic location detection
- **Responsive Design**: Adapts to all screen sizes
- **Progressive Web App**: Can be installed on mobile devices

## 🎨 Design Features

### Color Scheme
- **Primary**: Orange (#ff7f50) - Warm and compassionate
- **Secondary**: Blue (#4ecdc4) - Trust and stability
- **Accent**: White and gray tones for readability

### Typography
- **Font**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Scales appropriately on all devices

### Animations
- **Smooth transitions**: CSS transitions and transforms
- **Loading states**: Spinners and progress indicators
- **Hover effects**: Interactive feedback
- **Fade animations**: Smooth page transitions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/destitutes_of_india
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Database Schema

#### Posts Collection
```javascript
{
  _id: ObjectId,
  imageUrl: String,           // Path to uploaded image
  timestamp: Date,            // When photo was taken
  gpsCoordinates: {
    latitude: Number,
    longitude: Number
  },
  locationDetails: {
    address: String,
    city: String,
    state: String,
    country: String
  },
  address: String             // Human-readable address
}
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
```bash
npm start
```

### Environment Setup
1. Set up MongoDB database
2. Configure Google Maps API key
3. Set up file upload directory
4. Configure CORS settings

## 📊 API Endpoints

### GET `/api/posts`
- Returns all posts sorted by timestamp
- Response: Array of post objects

### POST `/api/posts`
- Upload new post with image and location data
- Requires: image file, latitude, longitude, address
- Response: Created post object

### Static Pages
- `GET /` - Homepage
- `GET /about` - About Us
- `GET /contact` - Contact page
- `GET /mission` - Mission & Vision
- `GET /donate` - Donation page
- `GET /disclaimer` - Legal disclaimer
- `GET /privacy` - Privacy policy
- `GET /terms` - Terms of use

## 🔒 Security Features

- **File Validation**: Only image files accepted
- **File Size Limits**: 10MB maximum upload size
- **CORS Protection**: Configured for security
- **Input Validation**: Server-side validation
- **Error Handling**: Comprehensive error management

## 📈 Performance

- **Optimized Images**: Automatic compression
- **CDN Ready**: Static assets optimized
- **Caching**: Browser caching enabled
- **Minification**: CSS and JS minification ready
- **Lazy Loading**: Images load on demand

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is developed by YugaYatra Retail (Opc) Pvt Ltd.

## 📞 Support

For technical support or questions:
- **Email**: support@destitutesofindia.com
- **Phone**: +91 98765 43210
- **Website**: www.destitutesofindia.com

## 🔄 Updates

- **Version**: 1.0.0
- **Last Updated**: December 7, 2024
- **Status**: Production Ready

---

**Developed with ❤️ by YugaYatra Retail (Opc) Pvt Ltd** 