import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Accessibility as AccessibilityIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Psychology as PsychologyIcon,
  MedicalServices as MedicalIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Patient Health Records',
      description: 'Comprehensive digital health records with secure data collection and management.',
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Appointment Management',
      description: 'Automated appointment scheduling, session tracking, and patient attendance monitoring',
    },
    {
      icon: <AccessibilityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Treatment Plans',
      description: 'Create and manage comprehensive treatment plans for each patient',
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Billing & Insurance',
      description: 'Streamlined billing, insurance processing, and payment management.',
    },
    {
      icon: <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Medical Reports',
      description: 'Comprehensive medical reports and analytics for better patient care decisions.',
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Care Team Collaboration',
      description: 'Collaborate with specialists, nurses, and healthcare professionals in a secure environment.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'HIPAA Compliant',
      description: 'Best in class security to keep client data safe & completely secure online.',
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Wabi Care AI',
      description: 'AI-powered tools to generate treatment plans, clinical notes, and care recommendations.',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Kelly Knox',
      role: 'Family Physician',
      text: '15 years and 6 EHR systems later, finally I have found the perfect solution for patient management. It is so intuitive yet so comprehensive. And love the analytics dashboard.',
    },
    {
      name: 'Dr. Ashley Lowe',
      role: 'Internal Medicine Specialist',
      text: 'Loved the clean interface and the ease of patient monitoring. The team has put real effort into building this platform, and I see myself using it for years to come.',
    },
    {
      name: 'Dr. Kathleen Reed',
      role: 'Pediatrician',
      text: 'Thank you for being so responsive to my support requests. This will be my most used platform for the entire year. I was also impressed that it has built-in assessment tools too.',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
            Wabi Care
          </Typography>
          <Button color="inherit" sx={{ mr: 1 }} onClick={() => navigate('/signin')}>
            Log In
          </Button>
          <Button variant="contained" onClick={() => navigate('/signup')}>
            Start for FREE!
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ 
        pt: 8, 
        pb: 8, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ pr: { md: 4 } }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ 
                  fontWeight: 'bold', 
                  color: 'text.primary',
                  lineHeight: 1.2,
                  mb: 3
                }}>
                  Healthcare Management
                  <br />
                  <Box component="span" sx={{ 
                    background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Platform for Patient Care
                  </Box>
                </Typography>
                
                <Typography variant="h6" color="text.secondary" paragraph sx={{ 
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: '1.1rem'
                }}>
                  Streamline your healthcare practice with comprehensive patient management, 
                  care planning, health records, and billing solutions.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => navigate('/signup')}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                      boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Watch Demo
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/signup')}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      borderColor: '#2E7D32',
                      color: '#2E7D32',
                      '&:hover': {
                        borderColor: '#1B5E20',
                        backgroundColor: 'rgba(46, 125, 50, 0.04)'
                      }
                    }}
                  >
                    Start for FREE!
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<SecurityIcon />} 
                    label="HIPAA Compliant" 
                    size="small" 
                    sx={{ 
                      backgroundColor: 'rgba(46, 125, 50, 0.1)',
                      color: '#2E7D32',
                      border: '1px solid rgba(46, 125, 50, 0.2)'
                    }} 
                  />
                  <Chip 
                    icon={<SecurityIcon />} 
                    label="ISO27001 Certified" 
                    size="small" 
                    sx={{ 
                      backgroundColor: 'rgba(46, 125, 50, 0.1)',
                      color: '#2E7D32',
                      border: '1px solid rgba(46, 125, 50, 0.2)'
                    }} 
                  />
                  <Chip 
                    icon={<SecurityIcon />} 
                    label="SOC2 Compliant" 
                    size="small" 
                    sx={{ 
                      backgroundColor: 'rgba(46, 125, 50, 0.1)',
                      color: '#2E7D32',
                      border: '1px solid rgba(46, 125, 50, 0.2)'
                    }} 
                  />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                position: 'relative',
                textAlign: 'center',
                p: 4
              }}>
                {/* Hero Image Placeholder - You can replace this with an actual image */}
                <Box sx={{
                  width: '100%',
                  height: 400,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative elements */}
                  <Box sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 100,
                    height: 100,
                    background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                    borderRadius: '50%',
                    opacity: 0.1
                  }} />
                  <Box sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 80,
                    height: 80,
                    background: 'linear-gradient(45deg, #FF6B35, #FF8A65)',
                    borderRadius: '50%',
                    opacity: 0.1
                  }} />
                  
                  {/* Main content */}
                  <Box sx={{ zIndex: 2, position: 'relative' }}>
                    <Box sx={{
                      width: 120,
                      height: 120,
                      background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 8px 25px rgba(46, 125, 50, 0.3)'
                    }}>
                      <MedicalIcon sx={{ fontSize: 60, color: 'white' }} />
                    </Box>
                    
                    <Typography variant="h5" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2
                    }}>
                      Trusted by 10,000+
                      <br />
                      Healthcare Professionals
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      Join leading medical practices using Wabi Care
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
                      {['Mayo Clinic', 'Johns Hopkins', 'Cleveland Clinic', 'UCLA Health', 'Mount Sinai', 'Stanford Health'].map((hospital) => (
                        <Chip
                          key={hospital}
                          label={hospital}
                          variant="outlined"
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            borderColor: 'rgba(46, 125, 50, 0.3)',
                            color: '#2E7D32',
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: 8, 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Comprehensive Healthcare Features
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ 
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}>
              Wabi Care provides every feature needed for modern healthcare providers and medical practices
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(46, 125, 50, 0.15)',
                    borderColor: 'rgba(46, 125, 50, 0.3)'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ 
                      mb: 3,
                      p: 2,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.1), rgba(76, 175, 80, 0.1))',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ 
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 2
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ 
                      lineHeight: 1.6,
                      fontSize: '0.95rem'
                    }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ 
        py: 8, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Trusted by Healthcare Professionals
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ 
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}>
              Healthcare teams trust us for patient care management.
              <br />
              Here's what they have to say
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  height: '100%', 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(46, 125, 50, 0.15)'
                  }
                }}>
                  <CardContent>
                    <Typography paragraph sx={{ 
                      fontStyle: 'italic', 
                      mb: 3,
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      color: 'text.primary'
                    }}>
                      "{testimonial.text}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main',
                        width: 48,
                        height: 48,
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                      }}>
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 'bold',
                          color: 'text.primary'
                        }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: 8, 
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          opacity: 0.3
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          opacity: 0.5
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              fontSize: '2.2rem',
              lineHeight: 1.2
            }}>
              Transform your healthcare practice with a comprehensive 
              <Box component="span" sx={{ 
                background: 'linear-gradient(45deg, #FFE082, #FFF59D)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold'
              }}>
                30-day free trial
              </Box>
            </Typography>
            
            <Typography variant="h6" paragraph sx={{ 
              mb: 5,
              fontSize: '1.2rem',
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto'
            }}>
              No commitments required. Get started with Wabi Care for FREE!
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 3, 
              flexWrap: 'wrap',
              mt: 4
            }}>
              <Button
                variant="contained"
                size="large"
                sx={{ 
                  backgroundColor: 'white', 
                  color: 'primary.main',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/signup')}
              >
                Healthcare Providers - Sign Up Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': { 
                    borderColor: 'white', 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Medical Practices - Learn More
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, backgroundColor: 'grey.900', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Wabi Care
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Features | Tutorials | Blog | HIPAA | FERPA | Reviews | FAQ | Schools/Districts | Enterprises | Privacy Policy | Terms of Service
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" textAlign="right">
                © 2025 Wabi Care. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
