import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
} from '@mui/material';
import {
  People as PeopleIcon,
  Flag as FlagIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const recentActivities = [
    { action: 'Health assessment completed for John Smith', time: '2 hours ago', type: 'success' },
    { action: 'Appointment scheduled for Sarah Johnson', time: '4 hours ago', type: 'info' },
    { action: 'Treatment progress updated for Mike Davis', time: '1 day ago', type: 'success' },
    { action: 'Session notes logged for Emily Wilson', time: '1 day ago', type: 'success' },
  ];

  const upcomingEvents = [
    { title: 'Follow-up Appointment - Sarah Johnson', date: 'Today, 2:00 PM', type: 'appointment' },
    { title: 'Treatment Review - Mike Davis', date: 'Tomorrow, 10:00 AM', type: 'review' },
    { title: 'Session Check - Emily Wilson', date: 'Dec 15, 9:00 AM', type: 'session' },
  ];

  const patientsWithProgress = [
    { name: 'John Smith', treatments: 3, progress: 75, avatar: 'JS' },
    { name: 'Sarah Johnson', treatments: 2, progress: 60, avatar: 'SJ' },
    { name: 'Mike Davis', treatments: 4, progress: 90, avatar: 'MD' },
    { name: 'Emily Wilson', treatments: 2, progress: 45, avatar: 'EW' },
  ];

  return (
    <Box sx={{ 
      p: 3,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        p: 3,
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        mb: 4
      }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold', 
          mb: 2,
          background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Healthcare Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's an overview of your healthcare practice.
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(46, 125, 50, 0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'primary.main', 
                  mr: 2,
                  width: 56,
                  height: 56
                }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Patients
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    24
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(46, 125, 50, 0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <FlagIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Active Treatments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    89
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(46, 125, 50, 0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <AssessmentIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Health Records
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    1,247
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(46, 125, 50, 0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Sessions Completed
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    156
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(46, 125, 50, 0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Recent Activities
                </Typography>
                <Button size="small" color="primary">
                  View All
                </Button>
              </Box>
              <List>
                {recentActivities.map((activity, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ 
                        bgcolor: activity.type === 'success' ? 'success.main' : 'info.main',
                        width: 32,
                        height: 32
                      }}>
                        <CheckCircleIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={activity.time}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 24px rgba(46, 125, 50, 0.15)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Upcoming Events
                </Typography>
                <Button size="small" color="primary">
                  View Calendar
                </Button>
              </Box>
              <List>
                {upcomingEvents.map((event, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <CalendarIcon fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={event.title}
                      secondary={event.date}
                    />
                    <Chip 
                      label={event.type} 
                      size="small" 
                      color={event.type === 'meeting' ? 'primary' : event.type === 'review' ? 'secondary' : 'default'}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Student Progress */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                Patient Treatment Progress
              </Typography>
              <Button size="small" color="primary">
                View All Patients
              </Button>
              </Box>
              <Grid container spacing={3}>
                {patientsWithProgress.map((patient, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 3, 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}>
                      <Avatar sx={{ 
                        bgcolor: 'primary.main', 
                        mx: 'auto', 
                        mb: 2, 
                        width: 64, 
                        height: 64,
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                      }}>
                        {patient.avatar}
                      </Avatar>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {patient.name}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {patient.treatments} Treatments
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={patient.progress} 
                          sx={{ 
                            height: 10, 
                            borderRadius: 5,
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 5
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                        {patient.progress}% Complete
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
