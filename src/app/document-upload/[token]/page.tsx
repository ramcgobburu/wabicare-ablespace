"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertCircle, Clock, User, Mail, Phone } from "lucide-react"
import { getDocumentLinkByToken, addUploadedDocument, updateDocumentLinkStatus } from "@/lib/documentUploadStorage"
import { uploadFileToCloud, createUploadedDocument } from "@/lib/cloudStorageService"
import { DocumentUploadLink, UploadedDocument } from "@/types/document-upload"

interface DocumentUploadPageProps {
  params: {
    token: string
  }
}

export default function DocumentUploadPage({ params }: DocumentUploadPageProps) {
  const [uploadLink, setUploadLink] = useState<DocumentUploadLink | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [documentType, setDocumentType] = useState<string>("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const link = getDocumentLinkByToken(params.token)
    setUploadLink(link)
    setLoading(false)
  }, [params.token])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!uploadLink || uploadedFiles.length === 0 || !documentType) {
      alert('Please select files and document type')
      return
    }

    setUploading(true)

    try {
      // Upload each file to cloud storage
      for (const file of uploadedFiles) {
        // Upload file to cloud storage
        const uploadResult = await uploadFileToCloud(file, uploadLink.studentId, documentType)
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload file')
        }

        // Create uploaded document record
        const uploadedDoc = createUploadedDocument(
          file,
          uploadLink.studentId,
          documentType,
          uploadResult.fileUrl!,
          description || undefined
        )

        // Add to document link
        addUploadedDocument(uploadLink.id, uploadedDoc)
      }

      // Update link status
      updateDocumentLinkStatus(uploadLink.id, 'uploaded')

      alert('Documents uploaded successfully! Thank you for your submission.')
      
      // Reset form
      setUploadedFiles([])
      setDocumentType("")
      setDescription("")

    } catch (error) {
      console.error('Error uploading documents:', error)
      alert('Error uploading documents. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!uploadLink) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Invalid Link</h2>
              <p className="text-muted-foreground">
                This document upload link is invalid or has expired. Please contact your healthcare provider.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = new Date() > uploadLink.expiresAt
  const isUploaded = uploadLink.status === 'uploaded'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Upload Portal
            </CardTitle>
            <CardDescription>
              Secure document upload for {uploadLink.studentName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Student Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Student Name:</span> {uploadLink.studentName}
                </div>
                <div>
                  <span className="font-medium">Parent/Guardian:</span> {uploadLink.parentName}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {uploadLink.parentEmail}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {uploadLink.parentPhone}
                </div>
              </div>
            </div>

            {/* Status Alert */}
            {isExpired && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This upload link has expired. Please contact your healthcare provider for a new link.
                </AlertDescription>
              </Alert>
            )}

            {isUploaded && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Documents have been successfully uploaded. Thank you for your submission.
                </AlertDescription>
              </Alert>
            )}

            {!isExpired && !isUploaded && (
              <>
                {/* Upload Instructions */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Upload Instructions</h3>
                  <ul className="text-sm space-y-1 text-green-800">
                    <li>• Upload medical records, insurance cards, and identification documents</li>
                    <li>• Supported formats: PDF, JPG, PNG, DOC, DOCX</li>
                    <li>• Maximum file size: 10MB per file</li>
                    <li>• You can upload multiple files at once</li>
                  </ul>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload">Select Documents to Upload</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="mt-2"
                    />
                  </div>

                  {/* Selected Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Files</Label>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Document Type */}
                  <div>
                    <Label htmlFor="document-type">Document Type *</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical-records">Medical Records</SelectItem>
                        <SelectItem value="insurance">Insurance Card</SelectItem>
                        <SelectItem value="identification">Identification</SelectItem>
                        <SelectItem value="assessment-reports">Assessment Reports</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the documents"
                      className="mt-2"
                    />
                  </div>

                  {/* Upload Button */}
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || uploadedFiles.length === 0 || !documentType}
                    className="w-full"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documents
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Uploaded Documents History */}
            {uploadLink.uploadedDocuments.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Uploaded Documents</h3>
                <div className="space-y-2">
                  {uploadLink.uploadedDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4" />
                        <div>
                          <div className="font-medium text-sm">{doc.fileName}</div>
                          <div className="text-xs text-muted-foreground">
                            {doc.documentType} • {format(doc.uploadDate, 'MMM d, yyyy h:mm a')}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {doc.fileType}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Link Information */}
            <div className="text-xs text-muted-foreground border-t pt-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-3 w-3" />
                Link expires: {format(uploadLink.expiresAt, 'MMM d, yyyy h:mm a')}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={uploadLink.status === 'pending' ? 'default' : uploadLink.status === 'uploaded' ? 'secondary' : 'destructive'}>
                  {uploadLink.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
