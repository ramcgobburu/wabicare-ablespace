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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Microsoft as MicrosoftIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SignUpProps {
  onSignUp: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeToTerms' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    // Simulate registration
    try {
      // For demo purposes, accept any registration
      onSignUp();
      navigate('/app');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  const handleSocialSignUp = (provider: string) => {
    // Simulate social sign-up
    onSignUp();
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
              Create your free account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
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

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  name="agreeToTerms"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link href="#" color="primary">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" color="primary">
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mb: 2 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Create Account
            </Button>

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
                onClick={() => handleSocialSignUp('google')}
                sx={{ py: 1.5 }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<MicrosoftIcon />}
                onClick={() => handleSocialSignUp('microsoft')}
                sx={{ py: 1.5 }}
              >
                Microsoft
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/signin')}
                  sx={{ textDecoration: 'none' }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;

