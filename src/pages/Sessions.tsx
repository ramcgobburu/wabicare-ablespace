import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Add as AddIcon, Schedule as ScheduleIcon } from '@mui/icons-material';

const Sessions: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Sessions
      </Typography>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <ScheduleIcon sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Session Management
          </Typography>
          <Typography color="textSecondary" paragraph sx={{ mb: 4 }}>
            Track and manage patient sessions with comprehensive scheduling and documentation.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} size="large">
            Schedule Session
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Sessions;