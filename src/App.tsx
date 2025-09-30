import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout/Layout';
import LandingPage from './pages/LandingPage';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import CarePlans from './pages/CarePlans';
import HealthRecords from './pages/HealthRecords';
import Reports from './pages/Reports';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import CareTeam from './pages/CareTeam';
import Treatments from './pages/Treatments';
import Sessions from './pages/Sessions';
import Assessments from './pages/Assessments';
import Accommodations from './pages/Accommodations';
import Resources from './pages/Resources';
import History from './pages/History';
import Settings from './pages/Settings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Deep green for healthcare/care
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#FF6B35', // Warm orange for compassion
      light: '#FF8A65',
      dark: '#E64A19',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#263238',
      secondary: '#546E7A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 500,
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Authentication status:', isAuthenticated);
  }, [isAuthenticated]);

  // Register service worker for PWA functionality (only in production)
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    } else if (process.env.NODE_ENV === 'development') {
      // Unregister service worker in development to prevent caching issues
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn onSignIn={() => setIsAuthenticated(true)} />} />
              <Route path="/signup" element={<SignUp onSignUp={() => setIsAuthenticated(true)} />} />
              <Route path="/app/*" element={
                isAuthenticated ? (
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/patients" element={<Patients />} />
                      <Route path="/care-plans" element={<CarePlans />} />
                      <Route path="/health-records" element={<HealthRecords />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/appointments" element={<Appointments />} />
                      <Route path="/billing" element={<Billing />} />
                      <Route path="/care-team" element={<CareTeam />} />
                      <Route path="/treatments" element={<Treatments />} />
                      <Route path="/sessions" element={<Sessions />} />
                      <Route path="/assessments" element={<Assessments />} />
                      <Route path="/accommodations" element={<Accommodations />} />
                      <Route path="/resources" element={<Resources />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </Layout>
                ) : (
                  <SignIn onSignIn={() => setIsAuthenticated(true)} />
                )
              } />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;