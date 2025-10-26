import { BCPAAppointment } from "@/types/bcpa-appointments"

// Global appointment storage using localStorage
const APPOINTMENT_STORAGE_KEY = 'bcpa-appointments'

export interface StoredAppointment {
  id: string
  patientId: string
  patientName: string
  parentContact: {
    email: string
    phone: string
    name: string
  }
  appointmentType: 'initial-assessment' | 'follow-up' | 'technician-session'
  code: '151' | '155' | 'technician'
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
  scheduledBy: 'bcpa' | 'parent' | 'system'
  startTime: string // ISO string
  endTime: string // ISO string
  duration: number // minutes
  provider: {
    id: string
    name: string
    type: 'bcpa' | 'technician'
  }
  location: 'office' | 'virtual' | 'home'
  notes?: string
  createdAt: string // ISO string
  updatedAt: string // ISO string
}

// Convert BCPAAppointment to StoredAppointment
export function toStoredAppointment(appointment: BCPAAppointment): StoredAppointment {
  return {
    ...appointment,
    startTime: appointment.startTime.toISOString(),
    endTime: appointment.endTime.toISOString(),
    createdAt: appointment.createdAt.toISOString(),
    updatedAt: appointment.updatedAt.toISOString()
  }
}

// Convert StoredAppointment to BCPAAppointment
export function fromStoredAppointment(stored: StoredAppointment): BCPAAppointment {
  return {
    ...stored,
    startTime: new Date(stored.startTime),
    endTime: new Date(stored.endTime),
    createdAt: new Date(stored.createdAt),
    updatedAt: new Date(stored.updatedAt)
  }
}

// Get all appointments from storage
export function getAllAppointments(): BCPAAppointment[] {
  try {
    const stored = localStorage.getItem(APPOINTMENT_STORAGE_KEY)
    if (!stored) return []
    
    const storedAppointments: StoredAppointment[] = JSON.parse(stored)
    return storedAppointments.map(fromStoredAppointment)
  } catch (error) {
    console.error('Error loading appointments from storage:', error)
    return []
  }
}

// Get appointments for a specific BCPA provider
export function getAppointmentsForProvider(bcpaId: string): BCPAAppointment[] {
  const allAppointments = getAllAppointments()
  return allAppointments.filter(appointment => appointment.provider.id === bcpaId)
}

// Save a new appointment
export function saveAppointment(appointment: BCPAAppointment): void {
  try {
    const existingAppointments = getAllAppointments()
    const newAppointments = [...existingAppointments, appointment]
    
    const storedAppointments = newAppointments.map(toStoredAppointment)
    localStorage.setItem(APPOINTMENT_STORAGE_KEY, JSON.stringify(storedAppointments))
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('appointmentCreated', { detail: appointment }))
  } catch (error) {
    console.error('Error saving appointment:', error)
  }
}

// Update an existing appointment
export function updateAppointment(appointmentId: string, updates: Partial<BCPAAppointment>): void {
  try {
    const existingAppointments = getAllAppointments()
    const appointmentIndex = existingAppointments.findIndex(apt => apt.id === appointmentId)
    
    if (appointmentIndex === -1) {
      console.error('Appointment not found:', appointmentId)
      return
    }
    
    const updatedAppointment = {
      ...existingAppointments[appointmentIndex],
      ...updates,
      updatedAt: new Date()
    }
    
    const newAppointments = [...existingAppointments]
    newAppointments[appointmentIndex] = updatedAppointment
    
    const storedAppointments = newAppointments.map(toStoredAppointment)
    localStorage.setItem(APPOINTMENT_STORAGE_KEY, JSON.stringify(storedAppointments))
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('appointmentUpdated', { detail: updatedAppointment }))
  } catch (error) {
    console.error('Error updating appointment:', error)
  }
}

// Delete an appointment
export function deleteAppointment(appointmentId: string): void {
  try {
    const existingAppointments = getAllAppointments()
    const newAppointments = existingAppointments.filter(apt => apt.id !== appointmentId)
    
    const storedAppointments = newAppointments.map(toStoredAppointment)
    localStorage.setItem(APPOINTMENT_STORAGE_KEY, JSON.stringify(storedAppointments))
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('appointmentDeleted', { detail: { id: appointmentId } }))
  } catch (error) {
    console.error('Error deleting appointment:', error)
  }
}

// Clear all appointments (for testing)
export function clearAllAppointments(): void {
  localStorage.removeItem(APPOINTMENT_STORAGE_KEY)
}

// Initialize with mock data if no appointments exist
export function initializeAppointments(): void {
  const existingAppointments = getAllAppointments()
  if (existingAppointments.length === 0) {
    // Initialize with some mock data
    const mockAppointments: BCPAAppointment[] = [
      {
        id: "bcpa-001",
        patientId: "patient-001",
        patientName: "Sarah Johnson",
        parentContact: {
          email: "parent.johnson@email.com",
          phone: "(555) 123-4567",
          name: "Mary Johnson"
        },
        appointmentType: "initial-assessment",
        code: "151",
        status: "scheduled",
        scheduledBy: "bcpa",
        startTime: new Date(2024, 11, 15, 14, 0), // December 15, 2024 at 2:00 PM
        endTime: new Date(2024, 11, 15, 15, 0), // December 15, 2024 at 3:00 PM
        duration: 60,
        provider: {
          id: "bcpa-001",
          name: "Dr. Sarah Wilson (BCPA)",
          type: "bcpa"
        },
        location: "office",
        notes: "Initial BCPA assessment for autism evaluation",
        createdAt: new Date(2024, 11, 10),
        updatedAt: new Date(2024, 11, 10)
      }
    ]
    
    mockAppointments.forEach(saveAppointment)
  }
}
