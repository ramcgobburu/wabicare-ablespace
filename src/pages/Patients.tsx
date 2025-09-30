import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LocalHospital as HospitalIcon,
  Flag as FlagIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  MedicalServices as MedicalIcon,
} from '@mui/icons-material';

interface Patient {
  id: string;
  name: string;
  condition: string;
  age: number;
  treatmentDueDate: string;
  reviewDueDate: string;
  carePlans: number;
  sessions: number;
  avatar: string;
  status: 'active' | 'inactive';
  treatments: string[];
}

const Patients: React.FC = () => {
  const [patients] = useState<Patient[]>([
    {
      id: '1',
      name: 'John Smith',
      condition: 'Diabetes Type 1',
      age: 45,
      treatmentDueDate: '2024-03-15',
      reviewDueDate: '2024-02-20',
      carePlans: 3,
      sessions: 12,
      avatar: 'JS',
      status: 'active',
      treatments: ['Insulin Therapy', 'Diet Management'],
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      condition: 'Hypertension',
      age: 52,
      treatmentDueDate: '2024-04-10',
      reviewDueDate: '2024-03-25',
      carePlans: 2,
      sessions: 8,
      avatar: 'SJ',
      status: 'active',
      treatments: ['Medication', 'Exercise Program'],
    },
    {
      id: '3',
      name: 'Mike Davis',
      condition: 'Asthma',
      age: 38,
      treatmentDueDate: '2024-05-05',
      reviewDueDate: '2024-04-15',
      carePlans: 4,
      sessions: 15,
      avatar: 'MD',
      status: 'active',
      treatments: ['Inhaler', 'Breathing Exercises'],
    },
    {
      id: '4',
      name: 'Emily Wilson',
      condition: 'Arthritis',
      age: 67,
      treatmentDueDate: '2024-02-28',
      reviewDueDate: '2024-02-10',
      carePlans: 2,
      sessions: 10,
      avatar: 'EW',
      status: 'active',
      treatments: ['Physical Therapy', 'Pain Management'],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('add');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, patient: Patient) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  const handleAction = (action: string) => {
    setDialogType(action as 'add' | 'edit' | 'view');
    setOpenDialog(true);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
            Patient Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Manage your patients and their healthcare journey
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
          Add New Patient
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ 
        mb: 4,
        p: 3,
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <TextField
          fullWidth
          placeholder="Search patients by name or condition..."
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

      {/* Patients Grid */}
      <Grid container spacing={3}>
        {filteredPatients.map((patient) => {
          const treatmentDaysLeft = getDaysUntilDue(patient.treatmentDueDate);
          const reviewDaysLeft = getDaysUntilDue(patient.reviewDueDate);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={patient.id}>
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
                      <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
                        {patient.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {patient.condition}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Chip
                        label={patient.status}
                        color={getStatusColor(patient.status)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, patient)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {patient.name}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      <PersonIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      Age {patient.age} • {patient.condition}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        <FlagIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        Care Plans
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {patient.carePlans}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        <ScheduleIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        Sessions
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {patient.sessions}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Treatment Due: {new Date(patient.treatmentDueDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Review Due: {new Date(patient.reviewDueDate).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {patient.treatments.slice(0, 2).map((treatment, index) => (
                      <Chip
                        key={index}
                        label={treatment}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                    {patient.treatments.length > 2 && (
                      <Chip
                        label={`+${patient.treatments.length - 2}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {/* Due Date Warnings */}
                  {(treatmentDaysLeft <= 30 || reviewDaysLeft <= 30) && (
                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="caption" color="warning.dark">
                        {treatmentDaysLeft <= 30 && `Treatment due in ${treatmentDaysLeft} days`}
                        {treatmentDaysLeft <= 30 && reviewDaysLeft <= 30 && ' • '}
                        {reviewDaysLeft <= 30 && `Review due in ${reviewDaysLeft} days`}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
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
          <ListItemText>Edit Patient</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Patient</ListItemText>
        </MenuItem>
      </Menu>

      {/* Patient Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'add' && 'Add New Patient'}
          {dialogType === 'edit' && 'Edit Patient'}
          {dialogType === 'view' && 'Patient Details'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'view' && selectedPatient && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, mr: 3 }}>
                  {selectedPatient.avatar}
                </Avatar>
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {selectedPatient.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    {selectedPatient.condition} • Age {selectedPatient.age}
                  </Typography>
                  <Chip
                    label={selectedPatient.status}
                    color={getStatusColor(selectedPatient.status)}
                    size="small"
                  />
                </Box>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Contact Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText primary="Email" secondary="patient@example.com" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText primary="Phone" secondary="(555) 123-4567" />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <MedicalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Medical Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Treatment Due Date" 
                        secondary={new Date(selectedPatient.treatmentDueDate).toLocaleDateString()} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Review Due Date" 
                        secondary={new Date(selectedPatient.reviewDueDate).toLocaleDateString()} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Active Care Plans" 
                        secondary={selectedPatient.carePlans} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Total Sessions" 
                        secondary={selectedPatient.sessions} 
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <FlagIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Current Treatments
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedPatient.treatments.map((treatment, index) => (
                      <Chip key={index} label={treatment} color="primary" />
                    ))}
                  </Box>
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

export default Patients;