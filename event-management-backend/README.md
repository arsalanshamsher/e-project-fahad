# EventSphere Management Backend

A robust, scalable backend system for managing expos, trade shows, and events with comprehensive user management, real-time communication, and analytics.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Role-based access control (Admin, Organizer, Exhibitor, Attendee)
- **Expo Management** - Create, manage, and publish expos with detailed information
- **Booth Management** - Booth allocation, booking, and management system
- **Session Management** - Schedule and manage event sessions with registration
- **Messaging System** - Real-time communication between users
- **Notification System** - In-app and email notifications
- **Feedback System** - Comprehensive feedback collection and management
- **Analytics & Reporting** - Detailed insights and statistics

### Technical Features
- **RESTful API** - Well-structured endpoints with proper HTTP methods
- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Protection against abuse
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Proper error responses and logging
- **Database Indexing** - Optimized queries for performance
- **Scalable Architecture** - Ready for horizontal scaling

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Validation**: express-validator
- **Security**: CORS, rate limiting, input sanitization

## 📁 Project Structure

```
event-management-backend/
├── config/                 # Configuration files
│   ├── db.js              # Database configuration
│   └── jwt.js             # JWT configuration
├── controllers/            # Business logic controllers
│   ├── authController.js   # Authentication operations
│   ├── expoController.js   # Expo management
│   ├── boothController.js  # Booth operations
│   ├── sessionController.js # Session management
│   ├── messageController.js # Messaging system
│   ├── notificationController.js # Notifications
│   └── feedbackController.js # Feedback system
├── middleware/             # Custom middleware
│   └── auth.js            # Authentication & authorization
├── models/                 # Database models
│   ├── User.js            # User model
│   ├── Role.js            # Role model
│   ├── Expo.js            # Expo model
│   ├── Booth.js           # Booth model
│   ├── Session.js         # Session model
│   ├── Message.js         # Message model
│   ├── Notification.js    # Notification model
│   └── Feedback.js        # Feedback model
├── routes/                 # API routes
│   ├── authRoutes.js      # Authentication routes
│   ├── expoRoutes.js      # Expo routes
│   ├── boothRoutes.js     # Booth routes
│   ├── sessionRoutes.js   # Session routes
│   ├── messageRoutes.js   # Message routes
│   ├── notificationRoutes.js # Notification routes
│   └── feedbackRoutes.js  # Feedback routes
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-management-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/eventsphere
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRY=7d
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "+1234567890",
  "role": "attendee"
}
```

#### POST `/api/auth/login`
User login
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Expo Management

#### GET `/api/expos`
Get all published expos with pagination
```
Query params: page, limit, status, category
```

#### POST `/api/expos`
Create new expo (Organizer/Admin only)
```json
{
  "title": "Tech Expo 2024",
  "description": "Annual technology exhibition",
  "theme": "Innovation & Technology",
  "startDate": "2024-06-15T09:00:00Z",
  "endDate": "2024-06-17T18:00:00Z",
  "location": {
    "venue": "Convention Center",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA"
  }
}
```

#### GET `/api/expos/:id`
Get expo details by ID

#### PUT `/api/expos/:id`
Update expo (Organizer/Admin only)

#### DELETE `/api/expos/:id`
Delete expo (Organizer/Admin only)

### Booth Management

#### GET `/api/booths/expo/:expoId`
Get all booths for an expo

#### POST `/api/booths`
Create new booth (Organizer/Admin only)
```json
{
  "expo": "expoId",
  "boothNumber": "A1",
  "size": {
    "width": 3,
    "length": 3,
    "area": 9
  },
  "category": "Premium",
  "price": 1500
}
```

#### POST `/api/booths/:id/book`
Book a booth (Exhibitor only)

### Session Management

#### GET `/api/sessions/expo/:expoId`
Get all sessions for an expo

#### POST `/api/sessions`
Create new session (Organizer/Admin only)
```json
{
  "expo": "expoId",
  "title": "AI in Business",
  "description": "Exploring AI applications",
  "type": "keynote",
  "startTime": "2024-06-15T10:00:00Z",
  "endTime": "2024-06-15T11:00:00Z",
  "category": "Technology"
}
```

#### POST `/api/sessions/:id/register`
Register for a session (Attendee/Exhibitor only)

### Messaging System

#### GET `/api/messages/inbox`
Get user's inbox messages

#### POST `/api/messages`
Send a message
```json
{
  "recipient": "userId",
  "subject": "Hello",
  "content": "How are you?",
  "type": "direct"
}
```

#### GET `/api/messages/conversation/:userId`
Get conversation with a specific user

### Notifications

#### GET `/api/notifications`
Get user's notifications

#### PUT `/api/notifications/:id/read`
Mark notification as read

#### PUT `/api/notifications/mark-all-read`
Mark all notifications as read

### Feedback System

#### POST `/api/feedback`
Submit feedback
```json
{
  "expo": "expoId",
  "type": "expo",
  "category": "experience",
  "rating": 5,
  "title": "Great Experience",
  "content": "The expo was well organized"
}
```

#### GET `/api/feedback/user`
Get user's feedback submissions

## 🔐 Authentication & Authorization

### JWT Token
Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Role-Based Access Control
- **Admin**: Full access to all features
- **Organizer**: Can manage expos, booths, sessions, and send announcements
- **Exhibitor**: Can book booths, register for sessions, and communicate
- **Attendee**: Can register for expos/sessions, view content, and provide feedback

## 📊 Database Models

### User Model
- Basic info (name, email, password)
- Role reference
- Company and position details
- Social media links
- Preferences and settings

### Expo Model
- Event details and location
- Capacity and pricing
- Schedule and sessions
- Statistics and analytics
- Settings and configuration

### Booth Model
- Size and location details
- Category and pricing
- Booking information
- Features and amenities
- Analytics data

### Session Model
- Session details and timing
- Speaker information
- Registration and capacity
- Materials and requirements
- Feedback and ratings

## 🚀 Performance & Scalability

### Database Optimization
- Strategic indexing on frequently queried fields
- Efficient aggregation pipelines for analytics
- Proper data relationships and references

### API Optimization
- Pagination for large datasets
- Query parameter filtering
- Rate limiting to prevent abuse
- Efficient error handling

### Scalability Features
- Stateless API design
- Horizontal scaling ready
- Database connection pooling
- Caching-friendly architecture

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Secure token generation and validation
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Controlled cross-origin access
- **Role-Based Access**: Granular permission control

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
- Unit tests for controllers
- Integration tests for routes
- Database operation tests
- Authentication tests

## 📈 Monitoring & Logging

### Health Check
```
GET /api/health
```

### Error Logging
- Comprehensive error logging
- Stack trace preservation
- User-friendly error messages

### Performance Monitoring
- Response time tracking
- Database query monitoring
- Memory usage tracking

## 🚀 Deployment

### Production Considerations
- Environment variables for configuration
- Process management (PM2)
- Database connection optimization
- SSL/TLS configuration
- Load balancing setup

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added messaging and notification systems
- **v1.2.0** - Enhanced analytics and reporting
- **v1.3.0** - Improved security and performance

---

**EventSphere Management** - Revolutionizing event management through technology.
