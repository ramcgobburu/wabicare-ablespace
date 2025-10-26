export interface DocumentUploadLink {
  id: string
  studentId: string
  studentName: string
  parentEmail: string
  parentName: string
  parentPhone: string
  uniqueToken: string
  uploadUrl: string
  status: 'pending' | 'uploaded' | 'expired' | 'cancelled'
  expiresAt: Date
  createdAt: Date
  uploadedDocuments: UploadedDocument[]
  notes?: string
}

export interface UploadedDocument {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  uploadDate: Date
  documentType: 'medical-records' | 'insurance' | 'identification' | 'assessment-reports' | 'other'
  description?: string
  fileUrl: string
}

export interface StudentIntakeForm {
  studentName: string
  dateOfBirth: Date
  parentName: string
  parentEmail: string
  parentPhone: string
  address: string
  city: string
  state: string
  zipCode: string
  emergencyContact: string
  emergencyPhone: string
  medicalConditions?: string
  currentMedications?: string
  previousAssessments?: string
  notes?: string
}
