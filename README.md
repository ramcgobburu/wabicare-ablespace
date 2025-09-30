# AbleSpace - IEP Goal Tracking PWA

A modern Progressive Web Application (PWA) built with React, TypeScript, and Node.js that replicates the functionality of AbleSpace for IEP goal tracking and special education management.

## Features

### Core Features
- **IEP Goal Tracking**: Create, manage, and track Individualized Education Program goals
- **Student Management**: Comprehensive student caseload management
- **Data Collection**: Single-click data collection with 10+ data types
- **Service Time Tracking**: Automated service minutes and attendance tracking
- **Accommodations Management**: Track and manage student accommodations
- **Reporting**: Beautiful reports and graphs for IEP meetings
- **Calendar Integration**: Event scheduling and calendar views
- **Collaboration**: Team member management and data sharing
- **Billing**: Service time tracking and billing reports

### Technical Features
- **PWA Support**: Installable app with offline capabilities
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Material-UI components with OneNote-style navigation
- **TypeScript**: Full type safety throughout the application
- **Authentication**: Sign-in, sign-up, and social authentication
- **Real-time Updates**: Live data synchronization
- **Security**: HIPAA compliant with secure data handling

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Material-UI (MUI)** for components and theming
- **React Router** for navigation
- **TanStack Query** for data fetching and caching
- **Framer Motion** for animations
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **CORS** for cross-origin requests
- **Helmet** for security headers
- **Rate Limiting** for API protection
- **Morgan** for request logging

### PWA Features
- **Service Worker** for offline functionality
- **Web App Manifest** for installability
- **Caching Strategies** for performance
- **Push Notifications** (ready for implementation)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wabicare-ablespaceui
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp backend/env.example backend/.env
   
   # Edit the .env file with your configuration
   ```

4. **Start the development servers**
   ```bash
   # Run both frontend and backend concurrently
   npm run dev
   
   # Or run them separately:
   # Frontend only: npm start
   # Backend only: npm run backend:dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Available Scripts

- `npm start` - Start the React development server
- `npm run dev` - Start both frontend and backend concurrently
- `npm run build` - Build the app for production
- `npm run backend` - Start the backend server
- `npm run backend:dev` - Start the backend with nodemon
- `npm test` - Run the test suite

## Project Structure

```
wabicare-ablespaceui/
├── public/                 # Static assets and PWA files
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service worker
│   └── index.html        # Main HTML template
├── src/                   # React application source
│   ├── components/        # Reusable React components
│   │   └── Layout/       # Layout components
│   ├── pages/            # Page components
│   │   ├── Auth/         # Authentication pages
│   │   ├── Dashboard.tsx # Main dashboard
│   │   ├── Students.tsx  # Student management
│   │   ├── Goals.tsx     # Goal tracking
│   │   └── ...           # Other feature pages
│   └── App.tsx           # Main App component
├── backend/              # Node.js backend
│   ├── server.js         # Express server
│   ├── package.json      # Backend dependencies
│   └── env.example       # Environment variables example
├── package.json          # Frontend dependencies and scripts
├── vercel.json           # Vercel deployment configuration
└── README.md             # This file
```

## Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - The `vercel.json` configuration will automatically deploy both frontend and backend

2. **Environment Variables**
   - Add environment variables in the Vercel dashboard
   - Set `NODE_ENV=production`
   - Configure any required API keys

3. **Deploy**
   - Vercel will automatically deploy on every push to main
   - Preview deployments are created for pull requests

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the backend**
   - Deploy the `backend/` folder to your Node.js hosting service
   - Set up environment variables

3. **Deploy the frontend**
   - Deploy the `build/` folder to your static hosting service
   - Configure redirects for client-side routing

## PWA Features

### Installation
- Users can install the app on their devices
- Works offline with cached resources
- Appears in the app launcher like a native app

### Offline Support
- Service worker caches essential resources
- App works without internet connection
- Data syncs when connection is restored

### Performance
- Fast loading with optimized bundles
- Lazy loading of components
- Efficient caching strategies

## Authentication

The app includes a complete authentication system:
- Email/password sign-in and sign-up
- Social authentication (Google, Microsoft)
- JWT token-based sessions
- Protected routes and API endpoints

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Goals
- `GET /api/goals` - Get all goals
- `GET /api/goals/:id` - Get goal details
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Contact the development team

## Roadmap

- [ ] Complete all feature modules
- [ ] Add real-time collaboration
- [ ] Implement push notifications
- [ ] Add mobile app versions
- [ ] Integrate with school management systems
- [ ] Add advanced reporting features
- [ ] Implement AI-powered insights

---

Built with ❤️ for special education professionals