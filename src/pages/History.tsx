import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const History: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        History
      </Typography>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <SettingsIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            History Module
          </Typography>
          <Typography color="textSecondary" paragraph>
            Coming soon - History functionality.
          </Typography>
          <Button variant="contained" startIcon={<SettingsIcon />}>
            Access History
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default History;
