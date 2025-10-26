"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Plus
} from "lucide-react"
import { format } from "date-fns"
import type { 
  PatientRecord, 
  DocumentUpload 
} from "@/types/bcpa-appointments"

interface DocumentUploadPortalProps {
  patients: PatientRecord[]
  onDocumentUploaded: (patientId: string, document: DocumentUpload) => void
}

export function DocumentUploadPortal({ 
  patients, 
  onDocumentUploaded 
}: DocumentUploadPortalProps) {
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredPatients = patients.filter(patient =>
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.parentContact.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !selectedPatient) return

    setUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval)
              return 100
            }
            return prev + 10
          })
        }, 100)

        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 1000))

        const newDocument: DocumentUpload = {
          id: `doc-${Date.now()}-${i}`,
          patientId: selectedPatient.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          uploadDate: new Date(),
          uploadedBy: 'parent',
          category: 'medical-records', // Default category
          status: 'pending',
          notes: ''
        }

        onDocumentUploaded(selectedPatient.id, newDocument)
        clearInterval(progressInterval)
      }

      setUploadProgress(100)
      setTimeout(() => {
        setUploadProgress(0)
        setUploading(false)
      }, 1000)

    } catch (error) {
      console.error('Error uploading files:', error)
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'approved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medical-records': return 'bg-blue-100 text-blue-800'
      case 'assessment-reports': return 'bg-green-100 text-green-800'
      case 'insurance-documents': return 'bg-purple-100 text-purple-800'
      case 'other': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Upload Portal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPatients.map((patient) => (
              <Card
                key={patient.id}
                className={`cursor-pointer transition-colors ${
                  selectedPatient?.id === patient.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedPatient(patient)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{patient.patientName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Parent: {patient.parentContact.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {patient.documents.length} documents
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {patient.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Documents for {selectedPatient.patientName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading documents...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop files here, or click to select files
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Select Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Document Category</Label>
                <Select defaultValue="medical-records">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical-records">Medical Records</SelectItem>
                    <SelectItem value="assessment-reports">Assessment Reports</SelectItem>
                    <SelectItem value="insurance-documents">Insurance Documents</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any notes about these documents..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document List */}
      {selectedPatient && selectedPatient.documents.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents ({selectedPatient.documents.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="medical-records">Medical Records</SelectItem>
                    <SelectItem value="assessment-reports">Assessment Reports</SelectItem>
                    <SelectItem value="insurance-documents">Insurance Documents</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedPatient.documents
                .filter(doc => filterCategory === "all" || doc.category === filterCategory)
                .map((document) => (
                <Card key={document.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{document.fileName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(document.category)}>
                            {document.category.replace('-', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(document.status)}>
                            {document.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {getFileSize(document.fileSize)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Uploaded {format(document.uploadDate, 'MMM d, yyyy HH:mm')}
                        </p>
                        {document.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Notes: {document.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Upload Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Accepted file types: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Maximum file size: 10MB per file</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>You can upload multiple files at once</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Documents will be reviewed by BCPA before approval</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

