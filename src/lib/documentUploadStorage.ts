import { DocumentUploadLink, UploadedDocument, StudentIntakeForm } from '@/types/document-upload'
import { sendDocumentUploadEmail } from './emailService'

const DOCUMENT_LINKS_KEY = 'document-upload-links'
const STUDENT_INTAKE_KEY = 'student-intake-forms'

// Generate unique token for document upload links
export function generateUniqueToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Create a new document upload link
export function createDocumentUploadLink(
  studentId: string,
  studentName: string,
  parentEmail: string,
  parentName: string,
  parentPhone: string,
  notes?: string
): DocumentUploadLink {
  const uniqueToken = generateUniqueToken()
  const uploadUrl = `${window.location.origin}/document-upload/${uniqueToken}`
  
  const link: DocumentUploadLink = {
    id: `link-${Date.now()}`,
    studentId,
    studentName,
    parentEmail,
    parentName,
    parentPhone,
    uniqueToken,
    uploadUrl,
    status: 'pending',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date(),
    uploadedDocuments: [],
    notes
  }

  // Save to localStorage
  const existingLinks = getAllDocumentLinks()
  const updatedLinks = [...existingLinks, link]
  localStorage.setItem(DOCUMENT_LINKS_KEY, JSON.stringify(updatedLinks))

  return link
}

// Get all document upload links
export function getAllDocumentLinks(): DocumentUploadLink[] {
  try {
    const stored = localStorage.getItem(DOCUMENT_LINKS_KEY)
    if (!stored) return []
    
    const links = JSON.parse(stored)
    return links.map((link: any) => ({
      ...link,
      expiresAt: new Date(link.expiresAt),
      createdAt: new Date(link.createdAt),
      uploadedDocuments: link.uploadedDocuments.map((doc: any) => ({
        ...doc,
        uploadDate: new Date(doc.uploadDate)
      }))
    }))
  } catch (error) {
    console.error('Error loading document links:', error)
    return []
  }
}

// Get document link by token
export function getDocumentLinkByToken(token: string): DocumentUploadLink | null {
  const links = getAllDocumentLinks()
  return links.find(link => link.uniqueToken === token) || null
}

// Get document links for a specific student
export function getDocumentLinksForStudent(studentId: string): DocumentUploadLink[] {
  const links = getAllDocumentLinks()
  return links.filter(link => link.studentId === studentId)
}

// Update document link status
export function updateDocumentLinkStatus(linkId: string, status: DocumentUploadLink['status']): void {
  const links = getAllDocumentLinks()
  const updatedLinks = links.map(link => 
    link.id === linkId ? { ...link, status } : link
  )
  localStorage.setItem(DOCUMENT_LINKS_KEY, JSON.stringify(updatedLinks))
}

// Add uploaded document to a link
export function addUploadedDocument(linkId: string, document: UploadedDocument): void {
  const links = getAllDocumentLinks()
  const updatedLinks = links.map(link => 
    link.id === linkId 
      ? { 
          ...link, 
          uploadedDocuments: [...link.uploadedDocuments, document],
          status: 'uploaded' as const
        }
      : link
  )
  localStorage.setItem(DOCUMENT_LINKS_KEY, JSON.stringify(updatedLinks))
}

// Save student intake form
export function saveStudentIntakeForm(form: StudentIntakeForm): string {
  const formId = `intake-${Date.now()}`
  const formWithId = { ...form, id: formId, createdAt: new Date() }
  
  const existingForms = getAllStudentIntakeForms()
  const updatedForms = [...existingForms, formWithId]
  localStorage.setItem(STUDENT_INTAKE_KEY, JSON.stringify(updatedForms))
  
  return formId
}

// Get all student intake forms
export function getAllStudentIntakeForms(): (StudentIntakeForm & { id: string; createdAt: Date })[] {
  try {
    const stored = localStorage.getItem(STUDENT_INTAKE_KEY)
    if (!stored) return []
    
    const forms = JSON.parse(stored)
    return forms.map((form: any) => ({
      ...form,
      dateOfBirth: new Date(form.dateOfBirth),
      createdAt: new Date(form.createdAt)
    }))
  } catch (error) {
    console.error('Error loading intake forms:', error)
    return []
  }
}

// Re-export email service function
export { sendDocumentUploadEmail } from './emailService'
