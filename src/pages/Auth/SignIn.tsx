import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Microsoft as MicrosoftIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SignInProps {
  onSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Simulate authentication
    try {
      // For demo purposes, accept any email/password
      onSignIn();
      navigate('/app');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleSocialSignIn = (provider: string) => {
    // Simulate social sign-in
    onSignIn();
    navigate('/app');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'background.default',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
              AbleSpace
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Sign In
            </Button>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Link href="#" variant="body2">
                Forgot your password?
              </Link>
            </Box>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={() => handleSocialSignIn('google')}
                sx={{ py: 1.5 }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<MicrosoftIcon />}
                onClick={() => handleSocialSignIn('microsoft')}
                sx={{ py: 1.5 }}
              >
                Microsoft
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/signup')}
                  sx={{ textDecoration: 'none' }}
                >
                  Sign up for free
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignIn;
