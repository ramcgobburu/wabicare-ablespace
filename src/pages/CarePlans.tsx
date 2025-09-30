import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Flag as FlagIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  LocalHospital as HospitalIcon,
  DataUsage as DataIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Timer as TimerIcon,
  CheckCircle as CheckIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface CarePlan {
  id: string;
  title: string;
  patientName: string;
  patientAvatar: string;
  category: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
  targetDate: string;
  sessions: number;
  lastUpdated: string;
  description: string;
  objectives: string[];
  dataPoints: number;
  serviceTime: number;
  dataType: 'frequency' | 'duration' | 'accuracy' | 'latency' | 'rate' | 'percentage' | 'trial' | 'interval' | 'momentary';
  currentSession?: {
    isActive: boolean;
    startTime: string;
    duration: number;
  };
}

const CarePlans: React.FC = () => {
  console.log('CarePlans component loaded');
  
  const [carePlans] = useState<CarePlan[]>([
    {
      id: '1',
      title: 'Blood Sugar Management',
      patientName: 'John Smith',
      patientAvatar: 'JS',
      category: 'Diabetes Care',
      status: 'active',
      progress: 75,
      targetDate: '2024-06-15',
      sessions: 24,
      lastUpdated: '2024-01-15',
      description: 'Patient will maintain blood sugar levels within target range through proper insulin management and diet.',
      objectives: [
        'Monitor blood glucose 4x daily',
        'Maintain HbA1c below 7%',
        'Follow prescribed insulin regimen'
      ],
      dataPoints: 156,
      serviceTime: 720,
      dataType: 'percentage',
    },
    {
      id: '2',
      title: 'Blood Pressure Control',
      patientName: 'Sarah Johnson',
      patientAvatar: 'SJ',
      category: 'Cardiovascular',
      status: 'active',
      progress: 60,
      targetDate: '2024-05-20',
      sessions: 18,
      lastUpdated: '2024-01-14',
      description: 'Patient will achieve and maintain blood pressure within normal range through medication and lifestyle changes.',
      objectives: [
        'Take prescribed medications daily',
        'Monitor blood pressure weekly',
        'Engage in regular exercise'
      ],
      dataPoints: 89,
      serviceTime: 540,
      dataType: 'frequency',
    },
    {
      id: '3',
      title: 'Respiratory Function',
      patientName: 'Mike Davis',
      patientAvatar: 'MD',
      category: 'Respiratory',
      status: 'active',
      progress: 90,
      targetDate: '2024-04-30',
      sessions: 32,
      lastUpdated: '2024-01-16',
      description: 'Patient will improve lung function and reduce asthma symptoms through proper inhaler use and breathing techniques.',
      objectives: [
        'Use rescue inhaler as needed',
        'Practice breathing exercises daily',
        'Avoid known triggers'
      ],
      dataPoints: 203,
      serviceTime: 960,
      dataType: 'duration',
    },
    {
      id: '4',
      title: 'Joint Mobility',
      patientName: 'Emily Wilson',
      patientAvatar: 'EW',
      category: 'Physical Therapy',
      status: 'active',
      progress: 45,
      targetDate: '2024-07-10',
      sessions: 15,
      lastUpdated: '2024-01-12',
      description: 'Patient will improve joint mobility and reduce pain through physical therapy and pain management.',
      objectives: [
        'Complete daily exercises',
        'Manage pain levels effectively',
        'Maintain joint flexibility'
      ],
      dataPoints: 67,
      serviceTime: 450,
      dataType: 'accuracy',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarePlan, setSelectedCarePlan] = useState<CarePlan | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'view'>('add');
  const [tabValue, setTabValue] = useState(0);
  const [activeSessions, setActiveSessions] = useState<Set<string>>(new Set());
  const [dataCollectionOpen, setDataCollectionOpen] = useState(false);
  const [currentDataValue, setCurrentDataValue] = useState<number>(0);

  const filteredCarePlans = carePlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, plan: CarePlan) => {
    setAnchorEl(event.currentTarget);
    setSelectedCarePlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCarePlan(null);
  };

  const handleAction = (action: string) => {
    setDialogType(action as 'add' | 'edit' | 'view');
    setOpenDialog(true);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'paused': return 'warning';
      default: return 'default';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'warning';
    return 'error';
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const startSession = (planId: string) => {
    setActiveSessions(prev => new Set(prev).add(planId));
  };

  const stopSession = (planId: string) => {
    setActiveSessions(prev => {
      const newSet = new Set(prev);
      newSet.delete(planId);
      return newSet;
    });
  };

  const collectData = (planId: string, value: number) => {
    // In a real app, this would save to a database
    console.log(`Collected data for plan ${planId}: ${value}`);
    setCurrentDataValue(value);
  };

  const formatServiceTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDataTypeLabel = (type: string) => {
    const labels = {
      frequency: 'Frequency',
      duration: 'Duration',
      accuracy: 'Accuracy',
      latency: 'Latency',
      rate: 'Rate',
      percentage: 'Percentage',
      trial: 'Trial',
      interval: 'Interval',
      momentary: 'Momentary'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Care Plans
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleAction('add')}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Add Care Plan
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="All Plans" />
          <Tab label="Diabetes Care" />
          <Tab label="Cardiovascular" />
          <Tab label="Respiratory" />
          <Tab label="Physical Therapy" />
          <Tab label="Completed" />
        </Tabs>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search care plans by title, patient, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500, borderRadius: 2 }}
        />
      </Box>

      {/* Care Plans Grid */}
      <Grid container spacing={3}>
        {filteredCarePlans.map((plan) => {
          const daysLeft = getDaysUntilTarget(plan.targetDate);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Card sx={{ 
                height: '100%', 
                position: 'relative',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, mr: 2 }}>
                        {plan.patientAvatar}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {plan.patientName}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Chip
                        label={plan.status}
                        color={getStatusColor(plan.status)}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, plan)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {plan.title}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label={plan.category}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </Box>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    {plan.description}
                  </Typography>

                  {/* Progress */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {plan.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={plan.progress}
                      color={getProgressColor(plan.progress)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  {/* Stats */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {plan.dataPoints}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Data Points
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatServiceTime(plan.serviceTime)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Service Time
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {getDataTypeLabel(plan.dataType)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Data Type
                      </Typography>
                    </Box>
                  </Box>

                  {/* Data Collection & Session Controls */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    mb: 3,
                    flexWrap: 'wrap'
                  }}>
                    {activeSessions.has(plan.id) ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<StopIcon />}
                        onClick={() => stopSession(plan.id)}
                        sx={{ flex: 1 }}
                      >
                        Stop Session
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<PlayIcon />}
                        onClick={() => startSession(plan.id)}
                        sx={{ flex: 1 }}
                      >
                        Start Session
                      </Button>
                    )}
                    
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<DataIcon />}
                      onClick={() => {
                        setSelectedCarePlan(plan);
                        setDataCollectionOpen(true);
                      }}
                      sx={{ flex: 1 }}
                    >
                      Collect Data
                    </Button>
                  </Box>

                  {/* Target Date Warning */}
                  {daysLeft <= 30 && (
                    <Box sx={{ p: 1.5, bgcolor: 'warning.light', borderRadius: 2 }}>
                      <Typography variant="caption" color="warning.dark">
                        Target date approaching: {new Date(plan.targetDate).toLocaleDateString()}
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
          <ListItemText>Edit Care Plan</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AssessmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Session</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Care Plan</ListItemText>
        </MenuItem>
      </Menu>

      {/* Care Plan Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogType === 'add' && 'Add New Care Plan'}
          {dialogType === 'edit' && 'Edit Care Plan'}
          {dialogType === 'view' && 'Care Plan Details'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'view' && selectedCarePlan && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mr: 3 }}>
                  {selectedCarePlan.patientAvatar}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {selectedCarePlan.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    Patient: {selectedCarePlan.patientName}
                  </Typography>
                  <Chip
                    label={selectedCarePlan.category}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </Box>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <HospitalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Care Plan Information
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedCarePlan.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 600 }}>
                    Objectives
                  </Typography>
                  <List dense>
                    {selectedCarePlan.objectives.map((objective, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AssessmentIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={objective} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Progress & Timeline
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {selectedCarePlan.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={selectedCarePlan.progress}
                      color={getProgressColor(selectedCarePlan.progress)}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>

                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CalendarIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Target Date" 
                        secondary={new Date(selectedCarePlan.targetDate).toLocaleDateString()} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AssessmentIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Sessions" 
                        secondary={selectedCarePlan.sessions} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ScheduleIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Last Updated" 
                        secondary={new Date(selectedCarePlan.lastUpdated).toLocaleDateString()} 
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

      {/* Data Collection Dialog */}
      <Dialog open={dataCollectionOpen} onClose={() => setDataCollectionOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DataIcon color="primary" />
            Collect Data - {selectedCarePlan?.title}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedCarePlan && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Patient: {selectedCarePlan.patientName}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Data Type: {getDataTypeLabel(selectedCarePlan.dataType)}
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Enter Data Value
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  label={`${getDataTypeLabel(selectedCarePlan.dataType)} Value`}
                  value={currentDataValue}
                  onChange={(e) => setCurrentDataValue(Number(e.target.value))}
                  sx={{ mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {[10, 25, 50, 75, 90, 100].map((value) => (
                    <Button
                      key={value}
                      variant="outlined"
                      size="small"
                      onClick={() => setCurrentDataValue(value)}
                      sx={{ minWidth: 60 }}
                    >
                      {value}%
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Quick Data Collection Tips:</strong>
                </Typography>
                <Typography variant="caption" display="block">
                  • Single click to record data points
                </Typography>
                <Typography variant="caption" display="block">
                  • Use percentage values for accuracy-based goals
                </Typography>
                <Typography variant="caption" display="block">
                  • Track frequency by counting occurrences
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDataCollectionOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              if (selectedCarePlan) {
                collectData(selectedCarePlan.id, currentDataValue);
                setDataCollectionOpen(false);
                setCurrentDataValue(0);
              }
            }}
            disabled={currentDataValue === 0}
          >
            Record Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarePlans;