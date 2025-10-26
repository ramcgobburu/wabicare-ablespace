export interface BCBA {
  id: string
  name: string
  email: string
  phone: string
  credentials: string
  specialization: string[]
  availability: {
    monday: string[]
    tuesday: string[]
    wednesday: string[]
    thursday: string[]
    friday: string[]
    saturday: string[]
    sunday: string[]
  }
  maxPatients: number
  currentPatients: number
  isActive: boolean
}

// Mock BCBA data
export const mockBCBAs: BCBA[] = [
  {
    id: 'bcba-1',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@wabicare.com',
    phone: '+1 (555) 123-4567',
    credentials: 'BCBA-D, PhD',
    specialization: ['Autism Spectrum Disorders', 'Behavioral Interventions', 'Parent Training'],
    availability: {
      monday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      wednesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      thursday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      friday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      saturday: ['10:00', '11:00', '12:00'],
      sunday: []
    },
    maxPatients: 25,
    currentPatients: 18,
    isActive: true
  },
  {
    id: 'bcba-2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@wabicare.com',
    phone: '+1 (555) 234-5678',
    credentials: 'BCBA-D, MS',
    specialization: ['ADHD', 'School-Based Services', 'Social Skills Training'],
    availability: {
      monday: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'],
      tuesday: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'],
      wednesday: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'],
      thursday: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'],
      friday: ['08:00', '09:00', '10:00', '13:00', '14:00', '15:00'],
      saturday: [],
      sunday: []
    },
    maxPatients: 20,
    currentPatients: 15,
    isActive: true
  },
  {
    id: 'bcba-3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@wabicare.com',
    phone: '+1 (555) 345-6789',
    credentials: 'BCBA-D, PhD',
    specialization: ['Early Intervention', 'Developmental Disabilities', 'Family Support'],
    availability: {
      monday: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
      tuesday: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
      wednesday: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
      thursday: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
      friday: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
      saturday: ['09:00', '10:00', '11:00'],
      sunday: []
    },
    maxPatients: 22,
    currentPatients: 19,
    isActive: true
  },
  {
    id: 'bcba-4',
    name: 'Dr. James Thompson',
    email: 'james.thompson@wabicare.com',
    phone: '+1 (555) 456-7890',
    credentials: 'BCBA-D, MS',
    specialization: ['Adolescent Services', 'Transition Planning', 'Community Integration'],
    availability: {
      monday: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      tuesday: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      wednesday: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      thursday: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      friday: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      saturday: [],
      sunday: []
    },
    maxPatients: 18,
    currentPatients: 12,
    isActive: true
  },
  {
    id: 'bcba-5',
    name: 'Dr. Lisa Park',
    email: 'lisa.park@wabicare.com',
    phone: '+1 (555) 567-8901',
    credentials: 'BCBA-D, PhD',
    specialization: ['Severe Behaviors', 'Crisis Intervention', 'Staff Training'],
    availability: {
      monday: ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
      tuesday: ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
      wednesday: ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
      thursday: ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
      friday: ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'],
      saturday: ['10:00', '11:00', '12:00'],
      sunday: []
    },
    maxPatients: 15,
    currentPatients: 11,
    isActive: true
  }
]

// Helper functions
export function getBCBAById(id: string): BCBA | undefined {
  return mockBCBAs.find(bcba => bcba.id === id)
}

export function getActiveBCBAs(): BCBA[] {
  return mockBCBAs.filter(bcba => bcba.isActive)
}

export function getBCBAsBySpecialization(specialization: string): BCBA[] {
  return mockBCBAs.filter(bcba => 
    bcba.isActive && bcba.specialization.some(spec => 
      spec.toLowerCase().includes(specialization.toLowerCase())
    )
  )
}

export function getAvailableBCBAs(): BCBA[] {
  return mockBCBAs.filter(bcba => 
    bcba.isActive && bcba.currentPatients < bcba.maxPatients
  )
}
