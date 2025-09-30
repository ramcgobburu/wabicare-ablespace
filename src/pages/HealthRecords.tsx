import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Add as AddIcon, Assessment as AssessmentIcon } from '@mui/icons-material';

const HealthRecords: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Health Records
      </Typography>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <AssessmentIcon sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Digital Health Records
          </Typography>
          <Typography color="textSecondary" paragraph sx={{ mb: 4 }}>
            Comprehensive health record management with secure data collection and patient monitoring.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} size="large">
            Create Health Record
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HealthRecords;