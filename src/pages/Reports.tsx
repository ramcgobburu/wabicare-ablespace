import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Description as DescriptionIcon } from '@mui/icons-material';

const Reports: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Reports
      </Typography>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <DescriptionIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Beautiful Reports and Graphs
          </Typography>
          <Typography color="textSecondary" paragraph>
            Automatically generated reports for your next IEP meeting.
          </Typography>
          <Button variant="contained" startIcon={<DescriptionIcon />}>
            Generate Report
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;

