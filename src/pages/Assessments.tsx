import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Add as AddIcon, Assessment as AssessmentIcon } from '@mui/icons-material';

const Assessments: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Assessments
      </Typography>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <AssessmentIcon sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Patient Assessments
          </Typography>
          <Typography color="textSecondary" paragraph sx={{ mb: 4 }}>
            Comprehensive patient assessment tools and evaluation management.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} size="large">
            Create Assessment
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Assessments;