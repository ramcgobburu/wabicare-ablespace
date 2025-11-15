// Recurring Appointments Service
// Handles creation and management of recurring appointment series

import { format, addDays, addWeeks, addMonths, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  interval: number // e.g., every 2 weeks = interval: 2
  daysOfWeek?: number[] // 0 = Sunday, 1 = Monday, etc.
  endDate?: Date
  occurrenceCount?: number // Total number of occurrences
  startDate: Date
}

export interface RecurringAppointmentSeries {
  id: string
  patientId: string
  appointmentType: string
  billingCode?: string
  duration: number // minutes
  provider: {
    id: string
    name: string
    type: 'bcba' | 'technician'
  }
  location: 'office' | 'virtual' | 'home'
  recurrenceRule: RecurrenceRule
  notes?: string
  status: 'active' | 'paused' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface GeneratedAppointment {
  id: string
  seriesId: string
  patientId: string
  startTime: Date
  endTime: Date
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  occurrenceNumber: number
}

export class RecurringAppointmentsService {
  /**
   * Generates all appointments in a recurring series based on recurrence rule
   */
  static generateAppointments(
    series: RecurringAppointmentSeries,
    limit?: number
  ): GeneratedAppointment[] {
    const appointments: GeneratedAppointment[] = []
    const { recurrenceRule, duration, patientId } = series
    let currentDate = new Date(recurrenceRule.startDate)
    let occurrenceNumber = 1

    // Determine end condition
    const hasEndDate = recurrenceRule.endDate !== undefined
    const hasOccurrenceCount = recurrenceRule.occurrenceCount !== undefined
    const maxOccurrences = limit || recurrenceRule.occurrenceCount || 100 // Safety limit

    while (occurrenceNumber <= maxOccurrences) {
      // Check end date
      if (hasEndDate && currentDate > recurrenceRule.endDate!) {
        break
      }

      // Check occurrence count
      if (hasOccurrenceCount && occurrenceNumber > recurrenceRule.occurrenceCount!) {
        break
      }

      // Generate appointment based on frequency
      let appointmentDate: Date | null = null

      switch (recurrenceRule.frequency) {
        case 'daily':
          appointmentDate = this.getNextDailyDate(currentDate, recurrenceRule.interval, occurrenceNumber)
          break
        case 'weekly':
          appointmentDate = this.getNextWeeklyDate(currentDate, recurrenceRule, occurrenceNumber)
          break
        case 'biweekly':
          appointmentDate = this.getNextBiweeklyDate(currentDate, recurrenceRule, occurrenceNumber)
          break
        case 'monthly':
          appointmentDate = this.getNextMonthlyDate(currentDate, recurrenceRule.interval, occurrenceNumber)
          break
      }

      if (appointmentDate) {
        const endTime = new Date(appointmentDate.getTime() + duration * 60 * 1000)

        appointments.push({
          id: `${series.id}-${occurrenceNumber}`,
          seriesId: series.id,
          patientId,
          startTime: appointmentDate,
          endTime,
          status: 'scheduled',
          occurrenceNumber
        })

        currentDate = appointmentDate
        occurrenceNumber++
      } else {
        break
      }
    }

    return appointments
  }

  /**
   * Gets next date for daily recurrence
   */
  private static getNextDailyDate(
    startDate: Date,
    interval: number,
    occurrenceNumber: number
  ): Date {
    return addDays(startDate, (occurrenceNumber - 1) * interval)
  }

  /**
   * Gets next date for weekly recurrence
   */
  private static getNextWeeklyDate(
    startDate: Date,
    rule: RecurrenceRule,
    occurrenceNumber: number
  ): Date {
    if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
      // Specific days of week (e.g., Monday and Wednesday)
      const weekStart = startOfWeek(startDate, { weekStartsOn: 0 })
      const weeksFromStart = Math.floor((occurrenceNumber - 1) / rule.daysOfWeek.length)
      const dayIndex = (occurrenceNumber - 1) % rule.daysOfWeek.length
      const targetDay = rule.daysOfWeek[dayIndex]
      
      const firstOccurrence = addDays(weekStart, targetDay)
      if (firstOccurrence < startDate) {
        // Move to next week
        return addWeeks(addDays(weekStart, targetDay), weeksFromStart + 1)
      }
      return addWeeks(addDays(weekStart, targetDay), weeksFromStart)
    } else {
      // Same day of week, every N weeks
      return addWeeks(startDate, (occurrenceNumber - 1) * rule.interval)
    }
  }

  /**
   * Gets next date for biweekly recurrence (every 2 weeks)
   */
  private static getNextBiweeklyDate(
    startDate: Date,
    rule: RecurrenceRule,
    occurrenceNumber: number
  ): Date {
    return addWeeks(startDate, (occurrenceNumber - 1) * 2)
  }

  /**
   * Gets next date for monthly recurrence
   */
  private static getNextMonthlyDate(
    startDate: Date,
    interval: number,
    occurrenceNumber: number
  ): Date {
    return addMonths(startDate, (occurrenceNumber - 1) * interval)
  }

  /**
   * Creates a recurring appointment series
   */
  static async createRecurringSeries(
    series: Omit<RecurringAppointmentSeries, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<RecurringAppointmentSeries> {
    const newSeries: RecurringAppointmentSeries = {
      ...series,
      id: `series-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // TODO: Save to database
    // For now, store in localStorage or state management
    
    return newSeries
  }

  /**
   * Updates a recurring appointment series
   */
  static async updateRecurringSeries(
    seriesId: string,
    updates: Partial<RecurringAppointmentSeries>
  ): Promise<RecurringAppointmentSeries | null> {
    // TODO: Implement database update
    console.log(`Updating series ${seriesId}:`, updates)
    return null
  }

  /**
   * Cancels a recurring appointment series
   */
  static async cancelSeries(seriesId: string): Promise<boolean> {
    // TODO: Implement cancellation logic
    // Should cancel all future appointments in the series
    console.log(`Cancelling series ${seriesId}`)
    return true
  }

  /**
   * Pauses a recurring appointment series
   */
  static async pauseSeries(seriesId: string): Promise<boolean> {
    // TODO: Implement pause logic
    console.log(`Pausing series ${seriesId}`)
    return true
  }

  /**
   * Resumes a paused recurring appointment series
   */
  static async resumeSeries(seriesId: string): Promise<boolean> {
    // TODO: Implement resume logic
    console.log(`Resuming series ${seriesId}`)
    return true
  }

  /**
   * Gets all appointments for a series
   */
  static async getSeriesAppointments(seriesId: string): Promise<GeneratedAppointment[]> {
    // TODO: Fetch series from database and generate appointments
    return []
  }

  /**
   * Validates recurrence rule
   */
  static validateRecurrenceRule(rule: RecurrenceRule): { valid: boolean; error?: string } {
    if (!rule.startDate) {
      return { valid: false, error: 'Start date is required' }
    }

    if (rule.endDate && rule.endDate < rule.startDate) {
      return { valid: false, error: 'End date must be after start date' }
    }

    if (rule.occurrenceCount && rule.occurrenceCount < 1) {
      return { valid: false, error: 'Occurrence count must be at least 1' }
    }

    if (rule.frequency === 'weekly' && rule.daysOfWeek) {
      if (rule.daysOfWeek.length === 0) {
        return { valid: false, error: 'At least one day of week must be selected for weekly recurrence' }
      }
      if (rule.daysOfWeek.some(day => day < 0 || day > 6)) {
        return { valid: false, error: 'Invalid day of week (must be 0-6)' }
      }
    }

    if (rule.interval < 1) {
      return { valid: false, error: 'Interval must be at least 1' }
    }

    return { valid: true }
  }
}

