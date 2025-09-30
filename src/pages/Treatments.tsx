import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Add as AddIcon, MedicalServices as MedicalIcon } from '@mui/icons-material';

const Treatments: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Treatments
      </Typography>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <MedicalIcon sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Treatment Management
          </Typography>
          <Typography color="textSecondary" paragraph sx={{ mb: 4 }}>
            Comprehensive treatment planning and management for patient care.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} size="large">
            Add Treatment Plan
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Treatments;