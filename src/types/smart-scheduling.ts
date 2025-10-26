// Smart Scheduling Types for AI-Powered Appointment Suggestions

export interface SessionOutcome {
  sessionId: string
  studentId: string
  therapistId: string
  accuracy: number // 0-100
  engagement: number // 0-100
  duration: number // minutes
  goalsCompleted: number
  totalGoals: number
  notes: string
  timestamp: Date
}

export interface PatientProgress {
  studentId: string
  studentName: string
  recentAccuracy: number // average of last 3 sessions
  trend: 'improving' | 'stable' | 'declining'
  consecutiveHighSessions: number // sessions with 90%+ accuracy
  overallProgress: 'excellent' | 'good' | 'struggling'
  lastSessionDate: Date
}

export interface AuthorizationStatus {
  studentId: string
  totalHours: number
  usedHours: number
  remainingHours: number
  expirationDate: Date
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
}

export interface TherapistAvailability {
  therapistId: string
  therapistName: string
  availableSlots: TimeSlot[]
  preferredTimes: string[] // ['morning', 'afternoon', 'evening']
  maxSessionsPerDay: number
  workingDays: string[] // ['monday', 'tuesday', etc.]
}

export interface TimeSlot {
  start: Date
  end: Date
  isAvailable: boolean
  conflictReason?: string
}

export interface TherapistPatientSuccessRate {
  therapistId: string
  studentId: string
  successRate: number // 0-100
  totalSessions: number
  averageAccuracy: number
  lastSessionDate: Date
}

export interface SmartSchedulingSuggestion {
  id: string
  studentId: string
  studentName: string
  therapistId: string
  therapistName: string
  suggestedTime: Date
  suggestedEndTime: Date
  confidence: number // 0-100
  rationale: string
  priority: 'high' | 'medium' | 'low'
  factors: {
    patientProgress: PatientProgress
    authorizationStatus: AuthorizationStatus
    therapistAvailability: TherapistAvailability
    successRate: TherapistPatientSuccessRate
    optimalSpacing: number // days between sessions
  }
  alternatives: TimeSlot[] // backup options
}

export interface SchedulingContext {
  currentDate: Date
  lookAheadDays: number
  workingHours: {
    start: string // "09:00"
    end: string // "17:00"
  }
  sessionDuration: number // minutes
  optimalSpacing: {
    min: number // minimum days between sessions
    max: number // maximum days between sessions
    preferred: number // preferred days between sessions
  }
}

export interface OutlookAppointment {
  subject: string
  start: Date
  end: Date
  attendees: string[]
  location?: string
  body?: string
  reminderMinutes: number
}

export interface SchedulingAction {
  type: 'schedule' | 'reschedule' | 'cancel'
  suggestionId: string
  appointmentId?: string
  newTime?: Date
  reason?: string
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  parentEmail?: string
  parentPhone?: string
  therapistEmail: string
}
