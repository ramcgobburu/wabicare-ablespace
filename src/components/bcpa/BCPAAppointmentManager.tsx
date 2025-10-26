"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Phone, 
  Mail, 
  Plus,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  Users,
  Upload
} from "lucide-react"
import { BCPACalendarView } from "./BCPACalendarView"
import { PatientRecordManager } from "./PatientRecordManager"
import { AppointmentScheduler } from "./AppointmentScheduler"
import { DocumentUploadPortal } from "./DocumentUploadPortal"
import type { 
  BCPAAppointment, 
  PatientRecord, 
  AppointmentSuggestion,
  BCPACalendar 
} from "@/types/bcpa-appointments"

interface BCPAAppointmentManagerProps {
  bcpaId: string
}

export function BCPAAppointmentManager({ bcpaId }: BCPAAppointmentManagerProps) {
  const [activeTab, setActiveTab] = useState("calendar")
  const [appointments, setAppointments] = useState<BCPAAppointment[]>([])
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [suggestions, setSuggestions] = useState<AppointmentSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockAppointments: BCPAAppointment[] = [
      {
        id: "apt-1",
        patientId: "patient-1",
        patientName: "Emma Johnson",
        parentContact: {
          email: "parent@email.com",
          phone: "(555) 123-4567",
          name: "Sarah Johnson"
        },
        appointmentType: "initial-assessment",
        code: "151",
        status: "scheduled",
        scheduledBy: "bcpa",
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        duration: 60,
        provider: {
          id: bcpaId,
          name: "Dr. Sarah Wilson",
          type: "bcpa"
        },
        location: "office",
        notes: "Initial assessment for autism evaluation",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const mockPatients: PatientRecord[] = [
      {
        id: "patient-1",
        patientName: "Emma Johnson",
        dateOfBirth: new Date("2018-03-15"),
        parentContact: {
          name: "Sarah Johnson",
          email: "parent@email.com",
          phone: "(555) 123-4567"
        },
        doctorReferral: {
          doctorName: "Dr. Michael Brown",
          practice: "Pediatric Associates",
          referralDate: new Date(),
          referralReason: "Autism evaluation recommended"
        },
        documents: [],
        appointments: [],
        status: "assessment-scheduled",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    setAppointments(mockAppointments)
    setPatients(mockPatients)
  }, [bcpaId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default'
      case 'completed': return 'secondary'
      case 'cancelled': return 'destructive'
      case 'rescheduled': return 'outline'
      default: return 'outline'
    }
  }

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'initial-assessment': return 'bg-blue-100 text-blue-800'
      case 'follow-up': return 'bg-green-100 text-green-800'
      case 'technician-session': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">BCPA Appointment Management</h1>
          <p className="text-muted-foreground">
            Manage patient appointments, assessments, and technician sessions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            New Referral Call
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Patients</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Assessments Completed</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Scheduling
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <BCPACalendarView 
            appointments={appointments}
            onAppointmentUpdate={(updatedAppointment) => {
              setAppointments(prev => 
                prev.map(apt => apt.id === updatedAppointment.id ? updatedAppointment : apt)
              )
            }}
          />
        </TabsContent>

        <TabsContent value="patients" className="mt-6">
          <PatientRecordManager 
            patients={patients}
            onPatientUpdate={(updatedPatient) => {
              setPatients(prev => 
                prev.map(patient => patient.id === updatedPatient.id ? updatedPatient : patient)
              )
            }}
          />
        </TabsContent>

        <TabsContent value="scheduling" className="mt-6">
          <AppointmentScheduler 
            bcpaId={bcpaId}
            patients={patients}
            onAppointmentCreated={(newAppointment) => {
              setAppointments(prev => [...prev, newAppointment])
            }}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentUploadPortal 
            patients={patients}
            onDocumentUploaded={(patientId, document) => {
              setPatients(prev => 
                prev.map(patient => 
                  patient.id === patientId 
                    ? { ...patient, documents: [...patient.documents, document] }
                    : patient
                )
              )
            }}
          />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Assessment Reports</h3>
            <p className="text-muted-foreground mb-4">
              Generate and manage assessment reports for insurance submission
            </p>
            <Button>Generate Report</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

