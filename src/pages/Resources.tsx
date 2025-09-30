import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Add as AddIcon, Inventory as InventoryIcon } from '@mui/icons-material';

const Resources: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Resources
      </Typography>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <InventoryIcon sx={{ fontSize: 64, color: 'primary.main', mb: 3 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Healthcare Resources
          </Typography>
          <Typography color="textSecondary" paragraph sx={{ mb: 4 }}>
            Manage medical supplies, equipment, and educational resources for patient care.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} size="large">
            Add Resource
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Resources;