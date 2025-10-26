// BCBA Appointment Workflow Types

export interface BCBAAppointment {
  id: string
  patientId: string
  patientName: string
  parentContact: {
    email: string
    phone: string
    name: string
  }
  appointmentType: 'initial-assessment-reauthorization' | 'behavior-identification-supportive-assessment' | 'direct-services' | 'supervision' | 'care-giver-training' | 'adaptive-behavior-treatment' | 'indirect-supervision' | 'technician-session'
  code: '97151' | '97152' | '97153' | '97155' | '97156' | '97158' | 'H0032' | 'technician'
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  scheduledBy: 'bcba' | 'parent' | 'system'
  startTime: Date
  endTime: Date
  duration: number // minutes
  provider: {
    id: string
    name: string
    type: 'bcba' | 'technician'
  }
  location: 'office' | 'virtual' | 'home'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface PatientRecord {
  id: string
  patientName: string
  dateOfBirth: Date
  parentContact: {
    name: string
    email: string
    phone: string
  }
  doctorReferral: {
    doctorName: string
    practice: string
    referralDate: Date
    referralReason: string
  }
  documents: DocumentUpload[]
  appointments: BCBAAppointment[]
  status: 'new' | 'assessment-scheduled' | 'assessment-completed' | 'technician-sessions' | 'follow-up-scheduled' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export interface DocumentUpload {
  id: string
  patientId: string
  fileName: string
  fileType: string
  fileSize: number
  uploadDate: Date
  uploadedBy: 'parent' | 'bcba'
  category: 'medical-records' | 'assessment-reports' | 'insurance-documents' | 'other'
  status: 'pending' | 'reviewed' | 'approved'
  notes?: string
}

export interface TechnicianSessionPlan {
  id: string
  patientId: string
  totalHours: number
  startDate: Date
  endDate: Date
  sessionsPerWeek: number
  sessionDuration: number // minutes
  scheduledSessions: BCBAAppointment[]
  status: 'planned' | 'in-progress' | 'completed'
  createdAt: Date
}

export interface BCBACalendar {
  id: string
  bcbaId: string
  workingHours: {
    monday: { start: string; end: string; available: boolean }
    tuesday: { start: string; end: string; available: boolean }
    wednesday: { start: string; end: string; available: boolean }
    thursday: { start: string; end: string; available: boolean }
    friday: { start: string; end: string; available: boolean }
    saturday: { start: string; end: string; available: boolean }
    sunday: { start: string; end: string; available: boolean }
  }
  blockedTimes: {
    start: Date
    end: Date
    reason: string
  }[]
  maxAppointmentsPerDay: number
  preferredTimeSlots: string[]
}

export interface TechnicianCalendar {
  id: string
  technicianId: string
  workingHours: {
    monday: { start: string; end: string; available: boolean }
    tuesday: { start: string; end: string; available: boolean }
    wednesday: { start: string; end: string; available: boolean }
    thursday: { start: string; end: string; available: boolean }
    friday: { start: string; end: string; available: boolean }
    saturday: { start: string; end: string; available: boolean }
    sunday: { start: string; end: string; available: boolean }
  }
  blockedTimes: {
    start: Date
    end: Date
    reason: string
  }[]
  maxSessionsPerDay: number
  specialties: string[]
}

export interface AppointmentSuggestion {
  id: string
  patientId: string
  appointmentType: 'initial-assessment-reauthorization' | 'behavior-identification-supportive-assessment' | 'direct-services' | 'supervision' | 'care-giver-training' | 'adaptive-behavior-treatment' | 'indirect-supervision' | 'technician-session'
  suggestedTimes: {
    start: Date
    end: Date
    provider: {
      id: string
      name: string
      type: 'bcba' | 'technician'
    }
    confidence: number
    rationale: string
  }[]
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
}

export interface ParentPortalAccess {
  id: string
  patientId: string
  accessToken: string
  expiresAt: Date
  permissions: ('upload-documents' | 'view-appointments' | 'schedule-appointments')[]
  createdAt: Date
}

export interface AssessmentReport {
  id: string
  patientId: string
  appointmentId: string
  bcbaId: string
  reportDate: Date
  findings: string
  recommendations: string
  nextSteps: string
  parentSignature?: {
    signedAt: Date
    signatureData: string
  }
  insuranceSubmission?: {
    submittedAt: Date
    claimId: string
    status: 'pending' | 'approved' | 'denied'
  }
  status: 'draft' | 'ready-for-review' | 'parent-signed' | 'submitted-to-insurance'
  createdAt: Date
  updatedAt: Date
}

