// Automated Reminder Service
// Handles SMS and email reminders for appointments

import { addHours, addDays, isBefore, format } from 'date-fns'

export interface AppointmentReminder {
  id: string
  appointmentId: string
  patientId: string
  patientName: string
  parentContact: {
    email: string
    phone: string
    name: string
  }
  appointmentTime: Date
  reminderTime: Date
  reminderType: 'sms' | 'email' | 'both'
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  sentAt?: Date
  errorMessage?: string
  createdAt: Date
}

export interface ReminderPreferences {
  patientId: string
  enableSMS: boolean
  enableEmail: boolean
  reminderHoursBefore: number[] // e.g., [24, 2] = 24 hours and 2 hours before
  timezone?: string
}

export interface ReminderTemplate {
  type: 'sms' | 'email'
  subject?: string // For email
  body: string
}

export class ReminderService {
  /**
   * Schedules reminders for an appointment
   */
  static async scheduleReminders(
    appointmentId: string,
    appointmentTime: Date,
    patientId: string,
    patientName: string,
    parentContact: { email: string; phone: string; name: string },
    preferences?: ReminderPreferences
  ): Promise<AppointmentReminder[]> {
    const reminders: AppointmentReminder[] = []
    
    // Get preferences or use defaults
    const reminderHours = preferences?.reminderHoursBefore || [24, 2] // Default: 24h and 2h before
    const enableSMS = preferences?.enableSMS !== false
    const enableEmail = preferences?.enableEmail !== false

    // Create reminders for each time interval
    for (const hoursBefore of reminderHours) {
      const reminderTime = addHours(appointmentTime, -hoursBefore)
      
      // Only schedule if reminder time is in the future
      if (isBefore(new Date(), reminderTime)) {
        if (enableSMS && parentContact.phone) {
          reminders.push({
            id: `reminder-${appointmentId}-sms-${hoursBefore}h`,
            appointmentId,
            patientId,
            patientName,
            parentContact,
            appointmentTime,
            reminderTime,
            reminderType: 'sms',
            status: 'pending',
            createdAt: new Date()
          })
        }

        if (enableEmail && parentContact.email) {
          reminders.push({
            id: `reminder-${appointmentId}-email-${hoursBefore}h`,
            appointmentId,
            patientId,
            patientName,
            parentContact,
            appointmentTime,
            reminderTime,
            reminderType: 'email',
            status: 'pending',
            createdAt: new Date()
          })
        }
      }
    }

    // TODO: Save reminders to database
    // For now, store in memory or localStorage
    
    return reminders
  }

  /**
   * Sends a reminder (SMS or Email)
   */
  static async sendReminder(reminder: AppointmentReminder): Promise<boolean> {
    try {
      if (reminder.status !== 'pending') {
        console.warn(`Reminder ${reminder.id} is not pending, status: ${reminder.status}`)
        return false
      }

      // Check if it's time to send
      if (isBefore(new Date(), reminder.reminderTime)) {
        console.log(`Reminder ${reminder.id} not yet due`)
        return false
      }

      if (reminder.reminderType === 'sms') {
        return await this.sendSMSReminder(reminder)
      } else if (reminder.reminderType === 'email') {
        return await this.sendEmailReminder(reminder)
      }

      return false
    } catch (error) {
      console.error(`Error sending reminder ${reminder.id}:`, error)
      // TODO: Update reminder status to 'failed' in database
      return false
    }
  }

  /**
   * Sends SMS reminder
   */
  private static async sendSMSReminder(reminder: AppointmentReminder): Promise<boolean> {
    try {
      const template = this.getSMSTemplate(reminder)
      
      // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
      // For now, log the message
      console.log('SMS Reminder:', {
        to: reminder.parentContact.phone,
        message: template.body
      })

      // TODO: Update reminder status to 'sent' in database
      // await updateReminderStatus(reminder.id, 'sent')
      
      return true
    } catch (error) {
      console.error('SMS send error:', error)
      // TODO: Update reminder status to 'failed' in database
      return false
    }
  }

  /**
   * Sends Email reminder
   */
  private static async sendEmailReminder(reminder: AppointmentReminder): Promise<boolean> {
    try {
      const template = this.getEmailTemplate(reminder)
      
      // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
      // For now, use existing emailService if available
      console.log('Email Reminder:', {
        to: reminder.parentContact.email,
        subject: template.subject,
        body: template.body
      })

      // TODO: Update reminder status to 'sent' in database
      // await updateReminderStatus(reminder.id, 'sent')
      
      return true
    } catch (error) {
      console.error('Email send error:', error)
      // TODO: Update reminder status to 'failed' in database
      return false
    }
  }

  /**
   * Gets SMS template for reminder
   */
  private static getSMSTemplate(reminder: AppointmentReminder): ReminderTemplate {
    const appointmentDate = format(reminder.appointmentTime, 'MMM d, yyyy')
    const appointmentTime = format(reminder.appointmentTime, 'h:mm a')
    
    return {
      type: 'sms',
      body: `Reminder: ${reminder.patientName} has an appointment on ${appointmentDate} at ${appointmentTime}. Please reply CONFIRM to confirm or CANCEL to cancel.`
    }
  }

  /**
   * Gets Email template for reminder
   */
  private static getEmailTemplate(reminder: AppointmentReminder): ReminderTemplate {
    const appointmentDate = format(reminder.appointmentTime, 'EEEE, MMMM d, yyyy')
    const appointmentTime = format(reminder.appointmentTime, 'h:mm a')
    
    return {
      type: 'email',
      subject: `Appointment Reminder: ${reminder.patientName} - ${appointmentDate}`,
      body: `
        <html>
          <body>
            <h2>Appointment Reminder</h2>
            <p>Dear ${reminder.parentContact.name},</p>
            <p>This is a reminder that <strong>${reminder.patientName}</strong> has an upcoming appointment:</p>
            <ul>
              <li><strong>Date:</strong> ${appointmentDate}</li>
              <li><strong>Time:</strong> ${appointmentTime}</li>
            </ul>
            <p>Please arrive 10 minutes early for check-in.</p>
            <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
            <p>Thank you,<br>WabiCare Team</p>
          </body>
        </html>
      `
    }
  }

  /**
   * Cancels all reminders for an appointment
   */
  static async cancelReminders(appointmentId: string): Promise<boolean> {
    try {
      // TODO: Update all reminders for this appointment to 'cancelled' in database
      console.log(`Cancelling reminders for appointment ${appointmentId}`)
      return true
    } catch (error) {
      console.error('Error cancelling reminders:', error)
      return false
    }
  }

  /**
   * Processes pending reminders (should be called by a scheduled job)
   */
  static async processPendingReminders(): Promise<{ sent: number; failed: number }> {
    // TODO: Fetch all pending reminders where reminderTime <= now
    // For each reminder, call sendReminder()
    
    const stats = { sent: 0, failed: 0 }
    
    // Mock implementation
    console.log('Processing pending reminders...')
    
    return stats
  }

  /**
   * Gets reminder preferences for a patient
   */
  static async getReminderPreferences(patientId: string): Promise<ReminderPreferences | null> {
    // TODO: Fetch from database
    // Default preferences
    return {
      patientId,
      enableSMS: true,
      enableEmail: true,
      reminderHoursBefore: [24, 2]
    }
  }

  /**
   * Updates reminder preferences for a patient
   */
  static async updateReminderPreferences(
    patientId: string,
    preferences: Partial<ReminderPreferences>
  ): Promise<boolean> {
    // TODO: Save to database
    console.log(`Updating reminder preferences for patient ${patientId}:`, preferences)
    return true
  }
}

