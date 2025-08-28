# EventSphere Management Frontend

A modern, responsive React-based frontend for the EventSphere Management system, providing an intuitive interface for managing expos, trade shows, and events.

## 🚀 Features

### User Interface
- **Modern Design**: Clean, professional UI built with Tailwind CSS and shadcn/ui
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark/Light Mode**: Theme switching capability
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### Core Components
- **Dashboard**: Comprehensive overview with statistics and quick actions
- **Expo Management**: Create, edit, and manage expos with detailed forms
- **Booth Management**: Visual booth allocation and booking system
- **Session Management**: Schedule and manage event sessions
- **User Management**: Role-based user administration
- **Messaging System**: Real-time communication interface
- **Notification Center**: In-app notification management
- **Analytics Dashboard**: Data visualization and reporting

### User Roles & Permissions
- **Admin**: Full system access and user management
- **Organizer**: Expo creation and management
- **Exhibitor**: Booth booking and session registration
- **Attendee**: Event registration and content access

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context + React Query
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

## 📁 Project Structure

```
event-management/
├── public/                 # Static assets
├── src/
│   ├── admin/             # Admin-specific components
│   ├── assets/            # Images and static files
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Dashboard.tsx # Main dashboard
│   │   ├── ExpoManagement.tsx # Expo management
│   │   └── ...           # Other components
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx # Authentication context
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and API
│   ├── pages/             # Page components
│   └── main.tsx          # Application entry point
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=EventSphere Management
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI Components

### shadcn/ui Components
The project uses shadcn/ui, a collection of reusable components built on top of Radix UI primitives:

- **Layout**: Card, Container, Grid, Stack
- **Forms**: Input, Button, Select, Textarea, Checkbox
- **Navigation**: Tabs, Breadcrumb, Pagination
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Data Display**: Table, Badge, Avatar, Tooltip
- **Overlays**: Dialog, Modal, Popover, Drawer

### Custom Components
- **Dashboard**: Main dashboard with statistics and charts
- **ExpoManagement**: Comprehensive expo creation and management
- **BoothManagement**: Visual booth layout and booking
- **SessionManagement**: Session scheduling and registration
- **UserManagement**: User administration and role management

## 🔐 Authentication

### AuthContext
The application uses React Context for authentication state management:

```typescript
const { user, login, logout, isAuthenticated } = useAuth();
```

### Protected Routes
Routes are protected based on user authentication and role:

```typescript
<ProtectedRoute roles={['admin', 'organizer']}>
  <AdminDashboard />
</ProtectedRoute>
```

## 📊 State Management

### React Query
Used for server state management and caching:

```typescript
const { data: expos, isLoading, error } = useQuery({
  queryKey: ['expos'],
  queryFn: fetchExpos
});
```

### Local State
Component-level state managed with React hooks:

```typescript
const [expos, setExpos] = useState<Expo[]>([]);
const [loading, setLoading] = useState(true);
```

## 🌐 API Integration

### API Client
Centralized API client with interceptors:

```typescript
// lib/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### API Endpoints
- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Expos**: `/api/expos`, `/api/expos/:id`
- **Booths**: `/api/booths`, `/api/booths/:id`
- **Sessions**: `/api/sessions`, `/api/sessions/:id`
- **Users**: `/api/users`, `/api/users/:id`

## 🎯 Key Features Implementation

### Dashboard
- Real-time statistics and metrics
- Quick action buttons
- Recent activity feed
- Performance analytics

### Expo Management
- Multi-step creation wizard
- Rich text editing
- Image upload support
- Status management
- Search and filtering

### Booth Management
- Visual floor plan
- Drag-and-drop booth allocation
- Pricing and category management
- Availability tracking

### Session Management
- Calendar-based scheduling
- Speaker management
- Registration tracking
- Capacity management

## 🔧 Configuration

### Tailwind CSS
Custom Tailwind configuration with design system:

```typescript
// tailwind.config.ts
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... more shades
        }
      }
    }
  }
}
```

### TypeScript
Strict TypeScript configuration for type safety:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- Touch-friendly interfaces
- Optimized navigation for small screens
- Responsive data tables
- Adaptive layouts

## ♿ Accessibility

### WCAG Compliance
- Proper heading hierarchy
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Keyboard Navigation
- Tab order management
- Focus indicators
- Keyboard shortcuts
- Skip links

## 🧪 Testing

### Testing Strategy
- Unit tests for components
- Integration tests for user flows
- E2E tests for critical paths
- Accessibility testing

### Testing Tools
- Jest for unit testing
- React Testing Library
- Cypress for E2E testing
- axe-core for accessibility testing

## 🚀 Performance

### Optimization Techniques
- Code splitting with React.lazy
- Image optimization
- Bundle analysis
- Lazy loading
- Memoization

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size monitoring
- Performance budgets
- Lighthouse CI

## 🔒 Security

### Security Measures
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure authentication
- HTTPS enforcement

### Data Protection
- GDPR compliance
- Data encryption
- Privacy controls
- Audit logging

## 📦 Deployment

### Build Process
```bash
npm run build
```

### Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3**: Cloud hosting
- **Docker**: Containerized deployment

### Environment Variables
```env
VITE_API_URL=https://api.eventsphere.com
VITE_APP_NAME=EventSphere Management
VITE_ANALYTICS_ID=GA_TRACKING_ID
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Component documentation

## 📚 Documentation

### Component Documentation
- Storybook integration
- Component examples
- API documentation
- Usage guidelines

### User Guides
- Getting started guide
- Feature documentation
- Troubleshooting
- FAQ

## 🆘 Support

### Getting Help
- Create an issue in the repository
- Check the documentation
- Contact the development team
- Join the community forum

### Common Issues
- Installation problems
- Build errors
- Runtime issues
- Performance problems

## 📄 License

This project is licensed under the MIT License.

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- **v1.1.0** - Added dashboard and analytics
- **v1.2.0** - Enhanced UI components and accessibility
- **v1.3.0** - Performance optimizations and mobile improvements

---

**EventSphere Management Frontend** - Modern, accessible, and performant event management interface.
