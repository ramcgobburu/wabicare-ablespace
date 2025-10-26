// AI-Powered Smart Scheduling Engine
import type { 
  SmartSchedulingSuggestion, 
  PatientProgress, 
  AuthorizationStatus, 
  TherapistAvailability,
  TherapistPatientSuccessRate,
  SchedulingContext 
} from '@/types/smart-scheduling'
import { SessionAnalyzer } from './session-analyzer'
import { TherapistAvailabilityChecker } from './therapist-availability'
import { getAppointmentsForProvider } from '@/lib/appointmentStorage'

export class AIScheduler {
  private static defaultContext: SchedulingContext = {
    currentDate: new Date(),
    lookAheadDays: 14,
    workingHours: {
      start: '08:00',
      end: '20:00'
    },
    sessionDuration: 60,
    optimalSpacing: {
      min: 1,
      max: 5,
      preferred: 3
    }
  }

  /**
   * Generates smart scheduling suggestions for a student
   */
  static async generateSchedulingSuggestions(
    studentId: string,
    context: Partial<SchedulingContext> = {}
  ): Promise<SmartSchedulingSuggestion[]> {
    try {
      const mergedContext = { ...this.defaultContext, ...context }
      
      // Analyze patient progress
      const patientProgress = await SessionAnalyzer.analyzePatientProgress(studentId)
      
      // Get authorization status (mock for now)
      const authorizationStatus = await this.getAuthorizationStatus(studentId)
      
      // Get available therapists
      const availableTherapists = await this.getAvailableTherapists()
      
      const suggestions: SmartSchedulingSuggestion[] = []
      
      // Generate suggestions for each available therapist
      for (const therapist of availableTherapists) {
        const therapistAvailability = await TherapistAvailabilityChecker.getTherapistAvailability(
          therapist.id,
          mergedContext.currentDate,
          new Date(mergedContext.currentDate.getTime() + mergedContext.lookAheadDays * 24 * 60 * 60 * 1000)
        )
        
        const successRate = await TherapistAvailabilityChecker.getTherapistPatientSuccessRate(
          therapist.id,
          studentId
        )
        
        // Generate time suggestions based on analysis
        const timeSuggestions = await this.generateTimeSuggestions(
          patientProgress,
          authorizationStatus,
          therapistAvailability,
          successRate,
          mergedContext
        )
        
        for (const timeSuggestion of timeSuggestions) {
          const suggestion = await this.createSchedulingSuggestion(
            studentId,
            patientProgress,
            authorizationStatus,
            therapistAvailability,
            successRate,
            timeSuggestion,
            mergedContext
          )
          
          suggestions.push(suggestion)
        }
      }
      
      // Sort by confidence and priority
      return suggestions.sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1
        if (b.priority === 'high' && a.priority !== 'high') return 1
        return b.confidence - a.confidence
      })
      
    } catch (error) {
      console.error('Error generating scheduling suggestions:', error)
      throw error
    }
  }

  /**
   * Generates time suggestions based on analysis
   */
  private static async generateTimeSuggestions(
    patientProgress: PatientProgress,
    authorizationStatus: AuthorizationStatus,
    therapistAvailability: TherapistAvailability,
    successRate: number,
    context: SchedulingContext
  ): Promise<Array<{ time: Date; confidence: number; rationale: string }>> {
    const suggestions: Array<{ time: Date; confidence: number; rationale: string }> = []
    
    // Determine optimal spacing based on patient progress
    let optimalSpacing = context.optimalSpacing.preferred
    if (patientProgress.overallProgress === 'struggling') {
      optimalSpacing = context.optimalSpacing.min // More frequent sessions
    } else if (patientProgress.overallProgress === 'excellent') {
      optimalSpacing = context.optimalSpacing.max // Less frequent sessions
    }
    
    // Calculate urgency factor
    const urgencyFactor = this.calculateUrgencyFactor(patientProgress, authorizationStatus)
    
    // Get existing appointments to avoid conflicts
    const existingAppointments = getAppointmentsForProvider("bcpa-001")
    
    // Find available time slots that don't conflict with existing appointments
    const availableSlots = therapistAvailability.availableSlots.filter(slot => {
      if (!slot.isAvailable) return false
      
      // Check business hours (8 AM to 8 PM)
      const hour = slot.start.getHours()
      if (hour < 8 || hour >= 20) return false
      
      // Check for conflicts with existing appointments
      const slotStart = slot.start
      const slotEnd = new Date(slotStart.getTime() + context.sessionDuration * 60000)
      
      return !existingAppointments.some(existing => {
        const existingStart = new Date(existing.startTime)
        const existingEnd = new Date(existing.endTime)
        return (slotStart < existingEnd && slotEnd > existingStart)
      })
    })
    
    for (const slot of availableSlots) {
      const confidence = this.calculateTimeSlotConfidence(
        slot,
        patientProgress,
        authorizationStatus,
        therapistAvailability,
        successRate,
        optimalSpacing,
        urgencyFactor
      )
      
      if (confidence > 50) { // Only suggest slots with >50% confidence
        const rationale = this.generateRationale(
          patientProgress,
          authorizationStatus,
          therapistAvailability,
          successRate,
          optimalSpacing,
          urgencyFactor
        )
        
        suggestions.push({
          time: slot.start,
          confidence,
          rationale
        })
      }
    }
    
    return suggestions
  }

  /**
   * Creates a complete scheduling suggestion
   */
  private static async createSchedulingSuggestion(
    studentId: string,
    patientProgress: PatientProgress,
    authorizationStatus: AuthorizationStatus,
    therapistAvailability: TherapistAvailability,
    successRate: number,
    timeSuggestion: { time: Date; confidence: number; rationale: string },
    context: SchedulingContext
  ): Promise<SmartSchedulingSuggestion> {
    const endTime = new Date(timeSuggestion.time.getTime() + context.sessionDuration * 60000)
    
    // Determine priority
    let priority: 'high' | 'medium' | 'low' = 'medium'
    if (authorizationStatus.urgencyLevel === 'critical' || patientProgress.overallProgress === 'struggling') {
      priority = 'high'
    } else if (authorizationStatus.urgencyLevel === 'low' && patientProgress.overallProgress === 'excellent') {
      priority = 'low'
    }
    
    // Get alternative time slots
    const alternatives = await this.getAlternativeTimeSlots(
      therapistAvailability,
      timeSuggestion.time,
      context
    )
    
    return {
      id: `suggestion-${studentId}-${therapistAvailability.therapistId}-${Date.now()}`,
      studentId,
      studentName: patientProgress.studentName,
      therapistId: therapistAvailability.therapistId,
      therapistName: therapistAvailability.therapistName,
      suggestedTime: timeSuggestion.time,
      suggestedEndTime: endTime,
      confidence: timeSuggestion.confidence,
      rationale: timeSuggestion.rationale,
      priority,
      factors: {
        patientProgress,
        authorizationStatus,
        therapistAvailability,
        successRate: {
          therapistId: therapistAvailability.therapistId,
          studentId,
          successRate,
          totalSessions: 10, // Mock data
          averageAccuracy: patientProgress.recentAccuracy,
          lastSessionDate: patientProgress.lastSessionDate
        },
        optimalSpacing: this.calculateOptimalSpacing(patientProgress, authorizationStatus)
      },
      alternatives
    }
  }

  /**
   * Calculates urgency factor based on patient progress and authorization
   */
  private static calculateUrgencyFactor(
    patientProgress: PatientProgress,
    authorizationStatus: AuthorizationStatus
  ): number {
    let urgency = 0.5 // Base urgency
    
    // Patient progress factors
    if (patientProgress.overallProgress === 'struggling') urgency += 0.3
    if (patientProgress.trend === 'declining') urgency += 0.2
    if (patientProgress.consecutiveHighSessions >= 3) urgency -= 0.1
    
    // Authorization factors
    const hoursUsedPercentage = authorizationStatus.usedHours / authorizationStatus.totalHours
    if (hoursUsedPercentage > 0.8) urgency += 0.2
    if (authorizationStatus.urgencyLevel === 'critical') urgency += 0.3
    
    return Math.min(1, Math.max(0, urgency))
  }

  /**
   * Calculates confidence score for a time slot
   */
  private static calculateTimeSlotConfidence(
    slot: any,
    patientProgress: PatientProgress,
    authorizationStatus: AuthorizationStatus,
    therapistAvailability: TherapistAvailability,
    successRate: number,
    optimalSpacing: number,
    urgencyFactor: number
  ): number {
    let confidence = 50 // Base confidence
    
    // Time preference factors
    const hour = slot.start.getHours()
    if (therapistAvailability.preferredTimes.includes('morning') && hour >= 9 && hour <= 11) {
      confidence += 15
    }
    if (therapistAvailability.preferredTimes.includes('afternoon') && hour >= 13 && hour <= 15) {
      confidence += 15
    }
    
    // Success rate factor
    confidence += (successRate - 80) * 0.2 // Scale success rate impact
    
    // Urgency factor
    confidence += urgencyFactor * 20
    
    // Patient progress factor
    if (patientProgress.overallProgress === 'excellent') confidence += 10
    if (patientProgress.overallProgress === 'struggling') confidence += 5 // Higher priority for struggling patients
    
    return Math.min(100, Math.max(0, confidence))
  }

  /**
   * Generates rationale for scheduling suggestion
   */
  private static generateRationale(
    patientProgress: PatientProgress,
    authorizationStatus: AuthorizationStatus,
    therapistAvailability: TherapistAvailability,
    successRate: number,
    optimalSpacing: number,
    urgencyFactor: number
  ): string {
    const rationales: string[] = []
    
    // Patient progress rationale
    if (patientProgress.overallProgress === 'excellent') {
      rationales.push(`Patient performing excellently (${patientProgress.recentAccuracy}% accuracy)`)
    } else if (patientProgress.overallProgress === 'struggling') {
      rationales.push(`Patient needs increased support (${patientProgress.recentAccuracy}% accuracy)`)
    } else {
      rationales.push(`Patient showing good progress (${patientProgress.recentAccuracy}% accuracy)`)
    }
    
    // Authorization rationale
    const hoursRemaining = authorizationStatus.remainingHours
    if (hoursRemaining < 5) {
      rationales.push(`Only ${hoursRemaining} authorization hours remaining`)
    } else if (hoursRemaining > 20) {
      rationales.push(`${hoursRemaining} authorization hours available`)
    }
    
    // Therapist success rate rationale
    if (successRate >= 90) {
      rationales.push(`High success rate with ${therapistAvailability.therapistName} (${successRate}%)`)
    } else if (successRate >= 80) {
      rationales.push(`Good success rate with ${therapistAvailability.therapistName} (${successRate}%)`)
    }
    
    // Optimal spacing rationale
    rationales.push(`Optimal ${optimalSpacing}-day spacing between sessions`)
    
    return rationales.join(' • ')
  }

  /**
   * Gets alternative time slots
   */
  private static async getAlternativeTimeSlots(
    therapistAvailability: TherapistAvailability,
    preferredTime: Date,
    context: SchedulingContext
  ): Promise<any[]> {
    const alternatives = therapistAvailability.availableSlots
      .filter(slot => 
        slot.isAvailable && 
        Math.abs(slot.start.getTime() - preferredTime.getTime()) > 60 * 60 * 1000 // At least 1 hour difference
      )
      .slice(0, 3) // Limit to 3 alternatives
    
    return alternatives
  }

  /**
   * Calculates optimal spacing between sessions
   */
  private static calculateOptimalSpacing(
    patientProgress: PatientProgress,
    authorizationStatus: AuthorizationStatus
  ): number {
    if (patientProgress.overallProgress === 'struggling') return 1
    if (patientProgress.overallProgress === 'excellent') return 4
    if (authorizationStatus.urgencyLevel === 'high') return 2
    return 3
  }

  /**
   * Gets available therapists (mock implementation)
   */
  private static async getAvailableTherapists(): Promise<Array<{ id: string; name: string }>> {
    return [
      { id: 'therapist-1', name: 'Rachel Smith' },
      { id: 'therapist-2', name: 'Dr. Michael Johnson' }
    ]
  }

  /**
   * Gets authorization status (mock implementation)
   */
  private static async getAuthorizationStatus(studentId: string): Promise<AuthorizationStatus> {
    // Mock authorization data
    const mockData = {
      'student-1': {
        totalHours: 40,
        usedHours: 32,
        remainingHours: 8,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        urgencyLevel: 'medium' as const
      },
      'student-2': {
        totalHours: 30,
        usedHours: 28,
        remainingHours: 2,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        urgencyLevel: 'high' as const
      }
    }
    
    const data = mockData[studentId as keyof typeof mockData] || {
      totalHours: 40,
      usedHours: 20,
      remainingHours: 20,
      expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      urgencyLevel: 'low' as const
    }
    
    return {
      studentId,
      ...data
    }
  }
}
