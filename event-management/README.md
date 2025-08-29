# 🎯 EventSphere Management System

**A comprehensive, real-time event management platform with advanced analytics and interactive dashboards**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/eventsphere/eventsphere)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com/eventsphere/eventsphere)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/eventsphere/eventsphere)

## ✨ Features

### 🚀 **Core Functionality**
- **Multi-Role Authentication**: Admin, Organizer, Exhibitor, Attendee
- **Real-Time Updates**: WebSocket-powered live data synchronization
- **Interactive Dashboards**: Role-based dynamic content rendering
- **Advanced Analytics**: Professional charts with export capabilities
- **Mobile-First Design**: Responsive PWA with offline support

### 📊 **Analytics & Insights**
- **Attendance Tracking**: Real-time participant monitoring
- **Revenue Analytics**: Financial performance and profitability
- **Interactive Charts**: Line, Area, Bar, and Composed visualizations
- **Export Functionality**: CSV export for external analysis
- **Performance Monitoring**: Real-time app performance metrics

### 🔐 **Security & Performance**
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permission management
- **Performance Optimization**: Code splitting and lazy loading
- **Service Worker**: Offline functionality and caching
- **PWA Support**: Mobile app-like experience

## 🏗️ Architecture

```
EventSphere/
├── Frontend (React + TypeScript)
│   ├── Real-time WebSocket integration
│   ├── Advanced analytics with Recharts
│   ├── PWA with service worker
│   └── Performance monitoring
├── Backend (Node.js + Express)
│   ├── RESTful API endpoints
│   ├── WebSocket server
│   ├── JWT authentication
│   └── MongoDB integration
└── Infrastructure
    ├── Docker containerization
    ├── Nginx reverse proxy
    ├── Monitoring (Prometheus + Grafana)
    └── Production deployment scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- MongoDB 6.0+
- Modern web browser

### 1. Clone Repository
```bash
git clone https://github.com/eventsphere/eventsphere.git
cd eventsphere/event-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Backend Server
```bash
cd ../event-management-backend
npm install
npm run dev
```

### 4. Start Frontend Development Server
```bash
cd ../event-management
npm run dev
```

### 5. Access Application
- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:5000
- **Default Admin**: Create account with role "admin"

## 🎨 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode

# Linting & Formatting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier

# Production
npm run deploy       # Deploy to production
npm run docker:build # Build Docker image
npm run docker:up    # Start with Docker Compose
```

## 🏗️ Project Structure

```
src/
├── admin/           # Admin dashboard components
├── components/      # Reusable UI components
│   ├── analytics/  # Chart and analytics components
│   └── ui/         # Shadcn/ui components
├── contexts/        # React contexts (Auth, Real-time)
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries and API services
├── pages/          # Page components
└── main.tsx        # Application entry point
```

## 🔧 Configuration

### Environment Variables
Create `.env.local` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
VITE_APP_NAME=EventSphere
```

### Backend Configuration
Update `../event-management-backend/config/env.example`:
```env
MONGO_URI=mongodb://localhost:27017/expo_db
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

## 🚀 Production Deployment

### Option 1: Docker Compose (Recommended)
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Manual Deployment
```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

### Option 3: Cloud Deployment
- **Vercel**: Frontend deployment
- **Railway**: Backend deployment
- **MongoDB Atlas**: Database hosting
- **Redis Cloud**: Caching service

## 📊 Monitoring & Analytics

### Built-in Performance Monitor
- **Load Time**: Application initialization metrics
- **Render Time**: Component rendering performance
- **Memory Usage**: JavaScript heap monitoring
- **Network Latency**: API response times
- **Cache Hit Rate**: Service worker efficiency

### External Monitoring
- **Prometheus**: Metrics collection (port 9090)
- **Grafana**: Visualization dashboard (port 3001)
- **Nginx**: Access and error logs
- **MongoDB**: Database performance metrics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Granular permission system
- **CORS Protection**: Cross-origin request security
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Zod schema validation
- **HTTPS Ready**: SSL/TLS configuration included

## 📱 Progressive Web App

### PWA Features
- **Offline Support**: Service worker caching
- **App Installation**: Add to home screen
- **Push Notifications**: Real-time alerts
- **Background Sync**: Data synchronization
- **Responsive Design**: Mobile-first approach

### Mobile Optimization
- **Touch Gestures**: Swipe and tap interactions
- **Responsive Layout**: Adaptive to screen sizes
- **Performance**: Optimized for mobile devices
- **Accessibility**: Screen reader support

## 🧪 Testing

### Test Coverage
```bash
# Unit Tests
npm run test

# Integration Tests
npm run test:integration

# E2E Tests
npm run test:e2e

# Coverage Report
npm run test:coverage
```

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: End-to-end testing
- **MSW**: API mocking

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for routes
- **Lazy Loading**: Component-level lazy loading
- **Tree Shaking**: Unused code elimination
- **Bundle Analysis**: Webpack bundle analyzer
- **Image Optimization**: WebP format support

### Backend Optimizations
- **Database Indexing**: MongoDB query optimization
- **Caching**: Redis-based caching layer
- **Compression**: Gzip compression
- **Connection Pooling**: Database connection management
- **Load Balancing**: Horizontal scaling support

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui**: Beautiful UI components
- **Recharts**: Professional charting library
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Server state management
- **WebSocket**: Real-time communication

## 📞 Support

### Documentation
- [API Reference](./docs/api.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)

### Community
- **Issues**: [GitHub Issues](https://github.com/eventsphere/eventsphere/issues)
- **Discussions**: [GitHub Discussions](https://github.com/eventsphere/eventsphere/discussions)
- **Wiki**: [Project Wiki](https://github.com/eventsphere/eventsphere/wiki)

### Contact
- **Email**: support@eventsphere.com
- **Discord**: [EventSphere Community](https://discord.gg/eventsphere)
- **Twitter**: [@EventSphere](https://twitter.com/eventsphere)

---

**Built with ❤️ by the EventSphere Team**

*Transform your events with intelligent management and real-time insights*
