import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';

const Settings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Settings
      </Typography>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <SettingsIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Settings Module
          </Typography>
          <Typography color="textSecondary" paragraph>
            Coming soon - Settings functionality.
          </Typography>
          <Button variant="contained" startIcon={<SettingsIcon />}>
            Access Settings
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
