const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Authentication routes
app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Mock authentication - in production, verify against database
  res.json({
    success: true,
    user: {
      id: '1',
      email: email,
      name: 'Demo User',
      role: 'teacher'
    },
    token: 'mock-jwt-token'
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  // Basic validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Mock registration - in production, save to database
  res.json({
    success: true,
    user: {
      id: '2',
      email: email,
      name: `${firstName} ${lastName}`,
      role: 'teacher'
    },
    token: 'mock-jwt-token'
  });
});

// Students API
app.get('/api/students', (req, res) => {
  const mockStudents = [
    {
      id: '1',
      name: 'John Smith',
      grade: '3rd Grade',
      age: 8,
      iepDueDate: '2024-03-15',
      evaluationDueDate: '2024-02-20',
      goals: 3,
      serviceHours: 45,
      avatar: 'JS',
      status: 'active',
      accommodations: ['Extended Time', 'Preferential Seating']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      grade: '5th Grade',
      age: 10,
      iepDueDate: '2024-04-10',
      evaluationDueDate: '2024-03-25',
      goals: 2,
      serviceHours: 38,
      avatar: 'SJ',
      status: 'active',
      accommodations: ['Read Aloud', 'Breaks']
    }
  ];
  
  res.json(mockStudents);
});

// Goals API
app.get('/api/goals', (req, res) => {
  const mockGoals = [
    {
      id: '1',
      title: 'Reading Comprehension',
      studentName: 'John Smith',
      studentAvatar: 'JS',
      category: 'Academic',
      status: 'active',
      progress: 75,
      targetDate: '2024-06-15',
      dataPoints: 24,
      lastUpdated: '2024-01-15',
      description: 'Student will demonstrate reading comprehension skills by answering questions about grade-level texts with 80% accuracy.',
      objectives: [
        'Identify main idea and supporting details',
        'Make inferences from text',
        'Answer comprehension questions accurately'
      ]
    }
  ];
  
  res.json(mockGoals);
});

// Dashboard stats API
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalStudents: 24,
    activeGoals: 89,
    dataPoints: 1247,
    serviceHours: 156
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
