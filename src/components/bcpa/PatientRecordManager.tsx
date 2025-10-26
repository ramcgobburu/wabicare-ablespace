"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react"
import { format } from "date-fns"
import type { 
  PatientRecord, 
  BCPAAppointment 
} from "@/types/bcpa-appointments"

interface PatientRecordManagerProps {
  patients: PatientRecord[]
  onPatientUpdate: (patient: PatientRecord) => void
}

export function PatientRecordManager({ 
  patients, 
  onPatientUpdate 
}: PatientRecordManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null)

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.parentContact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.doctorReferral.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || patient.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-gray-100 text-gray-800'
      case 'assessment-scheduled': return 'bg-blue-100 text-blue-800'
      case 'assessment-completed': return 'bg-green-100 text-green-800'
      case 'technician-sessions': return 'bg-purple-100 text-purple-800'
      case 'follow-up-scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4" />
      case 'assessment-scheduled': return <Clock className="h-4 w-4" />
      case 'assessment-completed': return <CheckCircle className="h-4 w-4" />
      case 'technician-sessions': return <Clock className="h-4 w-4" />
      case 'follow-up-scheduled': return <Clock className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getNextAction = (patient: PatientRecord) => {
    switch (patient.status) {
      case 'new': return 'Schedule initial assessment'
      case 'assessment-scheduled': return 'Wait for assessment completion'
      case 'assessment-completed': return 'Schedule technician sessions'
      case 'technician-sessions': return 'Monitor session progress'
      case 'follow-up-scheduled': return 'Wait for follow-up completion'
      case 'completed': return 'Case completed'
      default: return 'Review case status'
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Records
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients, parents, or doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="status-filter">Status:</Label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="assessment-scheduled">Assessment Scheduled</option>
                <option value="assessment-completed">Assessment Completed</option>
                <option value="technician-sessions">Technician Sessions</option>
                <option value="follow-up-scheduled">Follow-up Scheduled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Patient
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{patient.patientName}</h3>
                    <p className="text-sm text-muted-foreground">
                      DOB: {format(patient.dateOfBirth, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(patient.status)}>
                    {patient.status.replace('-', ' ')}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.parentContact.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.parentContact.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{patient.parentContact.email}</span>
                  </div>
                </div>

                {/* Doctor Referral */}
                <div className="p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium">Referred by:</div>
                  <div>{patient.doctorReferral.doctorName}</div>
                  <div className="text-muted-foreground">
                    {patient.doctorReferral.practice}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.appointments.length} appointments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.documents.length} documents</span>
                  </div>
                </div>

                {/* Next Action */}
                <div className="flex items-center gap-2 text-sm">
                  {getStatusIcon(patient.status)}
                  <span className="text-muted-foreground">
                    {getNextAction(patient)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Detail View */}
      {selectedPatient && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {selectedPatient.patientName} - Patient Details
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedPatient.status)}>
                  {selectedPatient.status.replace('-', ' ')}
                </Badge>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Patient Information</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {selectedPatient.patientName}</div>
                  <div><strong>Date of Birth:</strong> {format(selectedPatient.dateOfBirth, 'MMMM d, yyyy')}</div>
                  <div><strong>Age:</strong> {Math.floor((Date.now() - selectedPatient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years old</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Parent Contact</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {selectedPatient.parentContact.name}</div>
                  <div><strong>Phone:</strong> {selectedPatient.parentContact.phone}</div>
                  <div><strong>Email:</strong> {selectedPatient.parentContact.email}</div>
                </div>
              </div>
            </div>

            {/* Doctor Referral */}
            <div>
              <h3 className="font-semibold mb-3">Doctor Referral</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div><strong>Doctor:</strong> {selectedPatient.doctorReferral.doctorName}</div>
                  <div><strong>Practice:</strong> {selectedPatient.doctorReferral.practice}</div>
                  <div><strong>Referral Date:</strong> {format(selectedPatient.doctorReferral.referralDate, 'MMMM d, yyyy')}</div>
                  <div><strong>Reason:</strong> {selectedPatient.doctorReferral.referralReason}</div>
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div>
              <h3 className="font-semibold mb-3">Appointments ({selectedPatient.appointments.length})</h3>
              {selectedPatient.appointments.length === 0 ? (
                <p className="text-muted-foreground">No appointments scheduled</p>
              ) : (
                <div className="space-y-2">
                  {selectedPatient.appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {appointment.appointmentType.replace('-', ' ')} (Code {appointment.code})
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(appointment.startTime), 'MMM d, yyyy HH:mm')}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Documents */}
            <div>
              <h3 className="font-semibold mb-3">Documents ({selectedPatient.documents.length})</h3>
              {selectedPatient.documents.length === 0 ? (
                <p className="text-muted-foreground">No documents uploaded</p>
              ) : (
                <div className="space-y-2">
                  {selectedPatient.documents.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{document.fileName}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(document.uploadDate, 'MMM d, yyyy')} • {document.category.replace('-', ' ')}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(document.status)}>
                        {document.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}




