import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';

const Appointments: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Calendar
      </Typography>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <CalendarIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Appointment Scheduling & Management
          </Typography>
          <Typography color="textSecondary" paragraph>
            Schedule appointments, manage patient visits, and track time.
          </Typography>
          <Button variant="contained" startIcon={<CalendarIcon />}>
            View Appointments
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Appointments;
