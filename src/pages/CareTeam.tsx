import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Group as GroupIcon } from '@mui/icons-material';

const CareTeam: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Collaborators
      </Typography>
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <GroupIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Care Team Management
          </Typography>
          <Typography color="textSecondary" paragraph>
            Manage your healthcare team, collaborate with specialists, and coordinate patient care.
          </Typography>
          <Button variant="contained" startIcon={<GroupIcon />}>
            Manage Care Team
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CareTeam;
