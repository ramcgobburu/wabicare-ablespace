// Authorization Balance Validation Service
// Validates remaining authorized hours before allowing appointment scheduling

export interface AuthorizationRecord {
  id: string
  patientId: string
  authorizationNumber: string
  totalHours: number
  usedHours: number
  scheduledHours: number
  remainingHours: number
  startDate: Date
  endDate: Date
  billingCode?: string // e.g., '97151', '97153', '97155'
  status: 'active' | 'expired' | 'exhausted' | 'pending'
  createdAt: Date
  updatedAt: Date
}

export interface AuthorizationValidationResult {
  isValid: boolean
  canSchedule: boolean
  remainingHours: number
  requestedHours: number
  message: string
  authorization?: AuthorizationRecord
  requiresOverride?: boolean
}

export interface AppointmentRequest {
  patientId: string
  duration: number // in minutes
  billingCode?: string
  startTime: Date
  endTime: Date
}

export class AuthorizationService {
  /**
   * Validates if an appointment can be scheduled based on authorization balance
   */
  static async validateAuthorization(
    request: AppointmentRequest
  ): Promise<AuthorizationValidationResult> {
    try {
      // Get active authorization for patient
      const authorization = await this.getActiveAuthorization(request.patientId, request.billingCode)
      
      if (!authorization) {
        return {
          isValid: false,
          canSchedule: false,
          remainingHours: 0,
          requestedHours: request.duration / 60,
          message: 'No active authorization found for this patient. Please add authorization before scheduling.',
          requiresOverride: true
        }
      }

      // Check if authorization is expired
      if (authorization.status === 'expired' || new Date() > authorization.endDate) {
        return {
          isValid: false,
          canSchedule: false,
          remainingHours: 0,
          requestedHours: request.duration / 60,
          message: `Authorization expired on ${authorization.endDate.toLocaleDateString()}. Please renew authorization.`,
          authorization,
          requiresOverride: true
        }
      }

      // Check if authorization is exhausted
      if (authorization.status === 'exhausted' || authorization.remainingHours <= 0) {
        return {
          isValid: false,
          canSchedule: false,
          remainingHours: 0,
          requestedHours: request.duration / 60,
          message: 'Authorization hours exhausted. All authorized hours have been used or scheduled.',
          authorization,
          requiresOverride: true
        }
      }

      // Calculate requested hours
      const requestedHours = request.duration / 60

      // Check if requested hours exceed remaining
      if (requestedHours > authorization.remainingHours) {
        return {
          isValid: false,
          canSchedule: false,
          remainingHours: authorization.remainingHours,
          requestedHours,
          message: `Requested ${requestedHours.toFixed(2)} hours exceeds remaining ${authorization.remainingHours.toFixed(2)} hours.`,
          authorization,
          requiresOverride: true
        }
      }

      // Valid - can schedule
      return {
        isValid: true,
        canSchedule: true,
        remainingHours: authorization.remainingHours,
        requestedHours,
        message: `Authorization valid. ${authorization.remainingHours.toFixed(2)} hours remaining.`,
        authorization
      }
    } catch (error) {
      console.error('Authorization validation error:', error)
      return {
        isValid: false,
        canSchedule: false,
        remainingHours: 0,
        requestedHours: request.duration / 60,
        message: 'Error validating authorization. Please try again or contact support.',
        requiresOverride: true
      }
    }
  }

  /**
   * Gets active authorization for a patient, optionally filtered by billing code
   */
  static async getActiveAuthorization(
    patientId: string,
    billingCode?: string
  ): Promise<AuthorizationRecord | null> {
    // TODO: Replace with actual database query
    // For now, using mock data structure
    // In production, this would query Supabase or your database
    
    // Mock implementation - replace with actual database call
    const mockAuthorizations: AuthorizationRecord[] = [
      {
        id: 'auth-1',
        patientId: 'student-1',
        authorizationNumber: 'AUTH-2024-001',
        totalHours: 40,
        usedHours: 20,
        scheduledHours: 8,
        remainingHours: 12,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        billingCode: '97151',
        status: 'active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ]

    // Filter by patient and billing code if provided
    let filtered = mockAuthorizations.filter(auth => auth.patientId === patientId)
    
    if (billingCode) {
      filtered = filtered.filter(auth => auth.billingCode === billingCode)
    }

    // Return most recent active authorization
    const active = filtered
      .filter(auth => auth.status === 'active' && new Date() <= auth.endDate)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0]

    return active || null
  }

  /**
   * Reserves hours for a scheduled appointment
   */
  static async reserveHours(
    authorizationId: string,
    hours: number
  ): Promise<boolean> {
    try {
      // TODO: Implement database update
      // Update authorization: scheduledHours += hours, remainingHours -= hours
      console.log(`Reserving ${hours} hours for authorization ${authorizationId}`)
      return true
    } catch (error) {
      console.error('Error reserving hours:', error)
      return false
    }
  }

  /**
   * Releases reserved hours when appointment is cancelled
   */
  static async releaseHours(
    authorizationId: string,
    hours: number
  ): Promise<boolean> {
    try {
      // TODO: Implement database update
      // Update authorization: scheduledHours -= hours, remainingHours += hours
      console.log(`Releasing ${hours} hours for authorization ${authorizationId}`)
      return true
    } catch (error) {
      console.error('Error releasing hours:', error)
      return false
    }
  }

  /**
   * Marks hours as used when appointment is completed
   */
  static async markHoursUsed(
    authorizationId: string,
    hours: number
  ): Promise<boolean> {
    try {
      // TODO: Implement database update
      // Update authorization: usedHours += hours, scheduledHours -= hours
      console.log(`Marking ${hours} hours as used for authorization ${authorizationId}`)
      return true
    } catch (error) {
      console.error('Error marking hours as used:', error)
      return false
    }
  }

  /**
   * Gets utilization summary for a patient
   */
  static async getUtilizationSummary(patientId: string): Promise<{
    authorizedHours: number
    scheduledHours: number
    usedHours: number
    remainingHours: number
    utilizationPercent: number
  }> {
    const authorization = await this.getActiveAuthorization(patientId)
    
    if (!authorization) {
      return {
        authorizedHours: 0,
        scheduledHours: 0,
        usedHours: 0,
        remainingHours: 0,
        utilizationPercent: 0
      }
    }

    const totalConsumed = authorization.usedHours + authorization.scheduledHours
    const utilizationPercent = authorization.totalHours > 0
      ? (totalConsumed / authorization.totalHours) * 100
      : 0

    return {
      authorizedHours: authorization.totalHours,
      scheduledHours: authorization.scheduledHours,
      usedHours: authorization.usedHours,
      remainingHours: authorization.remainingHours,
      utilizationPercent
    }
  }

  /**
   * Checks if override is required and logs it
   */
  static async logOverride(
    authorizationId: string,
    requestedHours: number,
    approvedBy: string,
    reason: string
  ): Promise<boolean> {
    try {
      // TODO: Implement audit log
      console.log(`Override logged: ${requestedHours} hours for ${authorizationId} by ${approvedBy}. Reason: ${reason}`)
      return true
    } catch (error) {
      console.error('Error logging override:', error)
      return false
    }
  }
}

