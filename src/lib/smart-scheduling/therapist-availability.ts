// Therapist Availability Checker with Outlook Integration
import type { TherapistAvailability, TimeSlot } from '@/types/smart-scheduling'

export class TherapistAvailabilityChecker {
  /**
   * Gets therapist availability from Outlook calendar
   */
  static async getTherapistAvailability(
    therapistId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<TherapistAvailability> {
    try {
      // Mock implementation - in production, this would integrate with Microsoft Graph API
      const mockAvailability = await this.getMockAvailability(therapistId, startDate, endDate)
      return mockAvailability
    } catch (error) {
      console.error('Error getting therapist availability:', error)
      throw error
    }
  }

  /**
   * Checks if a specific time slot is available
   */
  static async isTimeSlotAvailable(
    therapistId: string, 
    startTime: Date, 
    endTime: Date
  ): Promise<{ available: boolean; conflictReason?: string }> {
    try {
      // Check for conflicts in the therapist's calendar
      const conflicts = await this.checkConflicts(therapistId, startTime, endTime)
      
      if (conflicts.length > 0) {
        return {
          available: false,
          conflictReason: conflicts[0].reason
        }
      }

      return { available: true }
    } catch (error) {
      console.error('Error checking time slot availability:', error)
      return { available: false, conflictReason: 'Error checking availability' }
    }
  }

  /**
   * Gets optimal time slots for a therapist based on their preferences
   */
  static async getOptimalTimeSlots(
    therapistId: string,
    date: Date,
    sessionDuration: number = 60
  ): Promise<TimeSlot[]> {
    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(9, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(17, 0, 0, 0)

      const timeSlots: TimeSlot[] = []
      const currentTime = new Date(startOfDay)

      while (currentTime < endOfDay) {
        const slotEnd = new Date(currentTime.getTime() + sessionDuration * 60000)
        
        if (slotEnd <= endOfDay) {
          const availability = await this.isTimeSlotAvailable(therapistId, currentTime, slotEnd)
          
          timeSlots.push({
            start: new Date(currentTime),
            end: new Date(slotEnd),
            isAvailable: availability.available,
            conflictReason: availability.conflictReason
          })
        }

        // Move to next hour
        currentTime.setHours(currentTime.getHours() + 1)
      }

      return timeSlots
    } catch (error) {
      console.error('Error getting optimal time slots:', error)
      return []
    }
  }

  /**
   * Mock implementation for development/testing
   */
  private static async getMockAvailability(
    therapistId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<TherapistAvailability> {
    // Mock therapist data
    const therapistData = {
      'therapist-1': {
        name: 'Rachel Smith',
        preferredTimes: ['morning', 'afternoon'],
        maxSessionsPerDay: 8,
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      },
      'therapist-2': {
        name: 'Dr. Michael Johnson',
        preferredTimes: ['morning'],
        maxSessionsPerDay: 6,
        workingDays: ['monday', 'wednesday', 'friday']
      }
    }

    const therapist = therapistData[therapistId as keyof typeof therapistData] || therapistData['therapist-1']
    
    // Generate mock available slots
    const availableSlots: TimeSlot[] = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'lowercase' })
      
      if (therapist.workingDays.includes(dayOfWeek)) {
        // Generate 2-3 available slots per working day
        const slotsPerDay = Math.floor(Math.random() * 2) + 2
        
        for (let i = 0; i < slotsPerDay; i++) {
          const startHour = 9 + (i * 3) // 9 AM, 12 PM, 3 PM
          const startTime = new Date(currentDate)
          startTime.setHours(startHour, 0, 0, 0)
          
          const endTime = new Date(startTime)
          endTime.setHours(startTime.getHours() + 1, 0, 0, 0)
          
          availableSlots.push({
            start: startTime,
            end: endTime,
            isAvailable: true
          })
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return {
      therapistId,
      therapistName: therapist.name,
      availableSlots,
      preferredTimes: therapist.preferredTimes,
      maxSessionsPerDay: therapist.maxSessionsPerDay,
      workingDays: therapist.workingDays
    }
  }

  /**
   * Checks for calendar conflicts
   */
  private static async checkConflicts(
    therapistId: string, 
    startTime: Date, 
    endTime: Date
  ): Promise<Array<{ reason: string; time: Date }>> {
    // Mock conflict checking - in production, this would query Outlook calendar
    const conflicts: Array<{ reason: string; time: Date }> = []
    
    // Simulate some random conflicts
    if (Math.random() < 0.1) { // 10% chance of conflict
      conflicts.push({
        reason: 'Existing appointment',
        time: startTime
      })
    }
    
    return conflicts
  }

  /**
   * Gets therapist-patient success rate
   */
  static async getTherapistPatientSuccessRate(
    therapistId: string, 
    studentId: string
  ): Promise<number> {
    try {
      // Mock implementation - in production, this would query session data
      const mockSuccessRates = {
        'therapist-1': {
          'student-1': 95,
          'student-2': 87,
          'student-3': 92
        },
        'therapist-2': {
          'student-1': 88,
          'student-2': 94,
          'student-3': 91
        }
      }

      const therapistRates = mockSuccessRates[therapistId as keyof typeof mockSuccessRates]
      if (therapistRates) {
        return therapistRates[studentId as keyof typeof therapistRates] || 85
      }

      return 85 // Default success rate
    } catch (error) {
      console.error('Error getting therapist-patient success rate:', error)
      return 85
    }
  }
}
