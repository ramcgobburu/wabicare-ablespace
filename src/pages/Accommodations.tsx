import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Accessibility as AccessibilityIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface Accommodation {
  id: string;
  title: string;
  description: string;
  patientName: string;
  patientAvatar: string;
  category: 'environmental' | 'instructional' | 'assessment' | 'behavioral' | 'medical';
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'paused' | 'completed';
  implementationDate: string;
  reviewDate: string;
  notes: string;
  isActive: boolean;
}

const Accommodations: React.FC = () => {
  const [accommodations] = useState<Accommodation[]>([
    {
      id: '1',
      title: 'Extended Time for Assessments',
      description: 'Patient receives 1.5x time for all written assessments and exams',
      patientName: 'John Smith',
      patientAvatar: 'JS',
      category: 'assessment',
      priority: 'high',
      status: 'active',
      implementationDate: '2024-01-15',
      reviewDate: '2024-04-15',
      notes: 'Helps reduce anxiety during testing situations',
      isActive: true,
    },
    {
      id: '2',
      title: 'Preferential Seating',
      description: 'Patient seated near front of room, away from distractions',
      patientName: 'Sarah Johnson',
      patientAvatar: 'SJ',
      category: 'environmental',
      priority: 'medium',
      status: 'active',
      implementationDate: '2024-01-10',
      reviewDate: '2024-03-10',
      notes: 'Improves focus and reduces visual distractions',
      isActive: true,
    },
    {
      id: '3',
      title: 'Breaks During Sessions',
      description: '5-minute breaks every 20 minutes during therapy sessions',
      patientName: 'Mike Davis',
      patientAvatar: 'MD',
      category: 'behavioral',
      priority: 'high',
      status: 'active',
      implementationDate: '2024-01-12',
      reviewDate: '2024-04-12',
      notes: 'Essential for maintaining attention and reducing fatigue',
      isActive: true,
    },
    {
      id: '4',
      title: 'Modified Instructions',
      description: 'Provide step-by-step written instructions for complex tasks',
      patientName: 'Emily Wilson',
      patientAvatar: 'EW',
      category: 'instructional',
      priority: 'medium',
      status: 'active',
      implementationDate: '2024-01-08',
      reviewDate: '2024-03-08',
      notes: 'Helps with executive function and task completion',
      isActive: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('add');

  const filteredAccommodations = accommodations.filter(accommodation =>
    accommodation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accommodation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accommodation.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, accommodation: Accommodation) => {
    setAnchorEl(event.currentTarget);
    setSelectedAccommodation(accommodation);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAccommodation(null);
  };

  const handleAction = (action: string) => {
    setDialogType(action as 'add' | 'edit' | 'view');
    setOpenDialog(true);
    handleMenuClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      environmental: 'Environmental',
      instructional: 'Instructional',
      assessment: 'Assessment',
      behavioral: 'Behavioral',
      medical: 'Medical'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckIcon color="success" />;
      case 'paused': return <WarningIcon color="warning" />;
      case 'completed': return <CheckIcon color="primary" />;
      default: return <CancelIcon color="error" />;
    }
  };

  return (
    <Box sx={{ 
      p: 3,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 'bold', 
            color: 'text.primary',
            background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Patient Accommodations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Track and manage patient accommodations and support needs
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleAction('add')}
          sx={{ 
            borderRadius: 3, 
            px: 4,
            py: 1.5,
            background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
            boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Add Accommodation
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ 
        mb: 4,
        p: 3,
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <TextField
          fullWidth
          placeholder="Search accommodations by title, patient, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'primary.main' }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            maxWidth: 600,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
              '&.Mui-focused': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                boxShadow: '0 0 0 2px rgba(46, 125, 50, 0.2)'
              }
            }
          }}
        />
      </Box>

      {/* Accommodations Grid */}
      <Grid container spacing={3}>
        {filteredAccommodations.map((accommodation) => (
          <Grid item xs={12} sm={6} md={4} key={accommodation.id}>
            <Card sx={{ 
              height: '100%', 
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: '0 20px 40px rgba(46, 125, 50, 0.15)',
                borderColor: 'rgba(46, 125, 50, 0.3)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, mr: 2 }}>
                      {accommodation.patientAvatar}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {accommodation.patientName}
                      </Typography>
                      <Chip
                        label={getCategoryLabel(accommodation.category)}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, accommodation)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {accommodation.title}
                </Typography>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3, minHeight: 60 }}>
                  {accommodation.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={accommodation.priority}
                    color={getPriorityColor(accommodation.priority)}
                    size="small"
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(accommodation.status)}
                    <Typography variant="caption" color="textSecondary">
                      {accommodation.status}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary">
                    Implemented: {new Date(accommodation.implementationDate).toLocaleDateString()}
                  </Typography>
                  <br />
                  <Typography variant="caption" color="textSecondary">
                    Review: {new Date(accommodation.reviewDate).toLocaleDateString()}
                  </Typography>
                </Box>

                {accommodation.notes && (
                  <Box sx={{ 
                    p: 1.5, 
                    bgcolor: 'grey.50', 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}>
                    <Typography variant="caption" color="textSecondary">
                      <strong>Notes:</strong> {accommodation.notes}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleAction('view')}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleAction('edit')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Accommodation</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Accommodation</ListItemText>
        </MenuItem>
      </Menu>

      {/* Accommodation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'add' && 'Add New Accommodation'}
          {dialogType === 'edit' && 'Edit Accommodation'}
          {dialogType === 'view' && 'Accommodation Details'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'view' && selectedAccommodation && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mr: 3 }}>
                  {selectedAccommodation.patientAvatar}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {selectedAccommodation.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    Patient: {selectedAccommodation.patientName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={getCategoryLabel(selectedAccommodation.category)}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                    <Chip
                      label={selectedAccommodation.priority}
                      color={getPriorityColor(selectedAccommodation.priority)}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <AccessibilityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Accommodation Details
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedAccommodation.description}
                  </Typography>
                  
                  {selectedAccommodation.notes && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Notes
                      </Typography>
                      <Typography variant="body1">
                        {selectedAccommodation.notes}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Timeline & Status
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Implementation Date" 
                        secondary={new Date(selectedAccommodation.implementationDate).toLocaleDateString()} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ScheduleIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Review Date" 
                        secondary={new Date(selectedAccommodation.reviewDate).toLocaleDateString()} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {getStatusIcon(selectedAccommodation.status)}
                      </ListItemIcon>
                      <ListItemText 
                        primary="Status" 
                        secondary={selectedAccommodation.status} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessibilityIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Category" 
                        secondary={getCategoryLabel(selectedAccommodation.category)} 
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {dialogType !== 'view' && (
            <Button variant="contained">Save</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Accommodations;
