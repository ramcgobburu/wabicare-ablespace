import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';

const Billing: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Billing
      </Typography>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <PaymentIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Service Time Tracking & Billing
          </Typography>
          <Typography color="textSecondary" paragraph>
            Track service time, generate billing reports, and manage invoicing.
          </Typography>
          <Button variant="contained" startIcon={<PaymentIcon />}>
            View Billing
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Billing;

