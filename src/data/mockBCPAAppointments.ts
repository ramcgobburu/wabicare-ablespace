import { BCPAAppointment } from "@/types/bcpa-appointments"

// Mock BCPA appointments data for the logged-in user
export const mockBCPAAppointments: BCPAAppointment[] = [
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
  },
  {
    id: "bcpa-002",
    patientId: "patient-002",
    patientName: "Alex Chen",
    parentContact: {
      email: "parent.chen@email.com",
      phone: "(555) 234-5678",
      name: "David Chen"
    },
    appointmentType: "follow-up",
    code: "155",
    status: "scheduled",
    scheduledBy: "bcpa",
    startTime: new Date(2024, 11, 16, 10, 0), // December 16, 2024 at 10:00 AM
    endTime: new Date(2024, 11, 16, 11, 0), // December 16, 2024 at 11:00 AM
    duration: 60,
    provider: {
      id: "bcpa-001",
      name: "Dr. Sarah Wilson (BCPA)",
      type: "bcpa"
    },
    location: "virtual",
    notes: "Follow-up assessment for progress evaluation",
    createdAt: new Date(2024, 11, 12),
    updatedAt: new Date(2024, 11, 12)
  },
  {
    id: "bcpa-003",
    patientId: "patient-003",
    patientName: "Emma Davis",
    parentContact: {
      email: "parent.davis@email.com",
      phone: "(555) 345-6789",
      name: "Jennifer Davis"
    },
    appointmentType: "initial-assessment",
    code: "151",
    status: "completed",
    scheduledBy: "bcpa",
    startTime: new Date(2024, 11, 14, 15, 0), // December 14, 2024 at 3:00 PM
    endTime: new Date(2024, 11, 14, 16, 0), // December 14, 2024 at 4:00 PM
    duration: 60,
    provider: {
      id: "bcpa-001",
      name: "Dr. Sarah Wilson (BCPA)",
      type: "bcpa"
    },
    location: "office",
    notes: "Completed initial BCPA assessment",
    createdAt: new Date(2024, 11, 8),
    updatedAt: new Date(2024, 11, 14)
  },
  {
    id: "bcpa-004",
    patientId: "patient-004",
    patientName: "Michael Rodriguez",
    parentContact: {
      email: "parent.rodriguez@email.com",
      phone: "(555) 456-7890",
      name: "Carlos Rodriguez"
    },
    appointmentType: "technician-session",
    code: "technician",
    status: "scheduled",
    scheduledBy: "bcpa",
    startTime: new Date(2024, 11, 17, 9, 0), // December 17, 2024 at 9:00 AM
    endTime: new Date(2024, 11, 17, 10, 0), // December 17, 2024 at 10:00 AM
    duration: 60,
    provider: {
      id: "tech-001",
      name: "Lisa Martinez (RBT)",
      type: "technician"
    },
    location: "home",
    notes: "Technician session for behavior intervention",
    createdAt: new Date(2024, 11, 13),
    updatedAt: new Date(2024, 11, 13)
  },
  {
    id: "bcpa-005",
    patientId: "patient-005",
    patientName: "Olivia Thompson",
    parentContact: {
      email: "parent.thompson@email.com",
      phone: "(555) 567-8901",
      name: "Susan Thompson"
    },
    appointmentType: "follow-up",
    code: "155",
    status: "scheduled",
    scheduledBy: "bcpa",
    startTime: new Date(2024, 11, 18, 13, 0), // December 18, 2024 at 1:00 PM
    endTime: new Date(2024, 11, 18, 14, 0), // December 18, 2024 at 2:00 PM
    duration: 60,
    provider: {
      id: "bcpa-001",
      name: "Dr. Sarah Wilson (BCPA)",
      type: "bcpa"
    },
    location: "office",
    notes: "Final follow-up assessment",
    createdAt: new Date(2024, 11, 11),
    updatedAt: new Date(2024, 11, 11)
  }
]

// Helper function to get appointments for a specific BCPA provider
export function getBCPAAppointmentsForProvider(bcpaId: string): BCPAAppointment[] {
  return mockBCPAAppointments.filter(appointment => appointment.provider.id === bcpaId)
}

// Helper function to get appointments by status
export function getBCPAAppointmentsByStatus(status: BCPAAppointment['status']): BCPAAppointment[] {
  return mockBCPAAppointments.filter(appointment => appointment.status === status)
}

// Helper function to get appointments by type
export function getBCPAAppointmentsByType(type: BCPAAppointment['appointmentType']): BCPAAppointment[] {
  return mockBCPAAppointments.filter(appointment => appointment.appointmentType === type)
}

