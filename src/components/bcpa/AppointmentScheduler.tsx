"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Plus,
  Search,
  Filter,
  Sparkles
} from "lucide-react"
import { format, addDays, addWeeks, addMonths } from "date-fns"
import type { 
  BCPAAppointment, 
  PatientRecord, 
  AppointmentSuggestion,
  BCPACalendar,
  TechnicianCalendar 
} from "@/types/bcpa-appointments"

interface AppointmentSchedulerProps {
  bcpaId: string
  patients: PatientRecord[]
  onAppointmentCreated: (appointment: BCPAAppointment) => void
}

export function AppointmentScheduler({ 
  bcpaId, 
  patients, 
  onAppointmentCreated 
}: AppointmentSchedulerProps) {
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null)
  const [appointmentType, setAppointmentType] = useState<'initial-assessment' | 'follow-up' | 'technician-session'>('initial-assessment')
  const [suggestions, setSuggestions] = useState<AppointmentSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Mock BCPA and Technician calendars
  const [bcpaCalendar] = useState<BCPACalendar>({
    id: "bcpa-cal-1",
    bcpaId,
    workingHours: {
      monday: { start: "09:00", end: "17:00", available: true },
      tuesday: { start: "09:00", end: "17:00", available: true },
      wednesday: { start: "09:00", end: "17:00", available: true },
      thursday: { start: "09:00", end: "17:00", available: true },
      friday: { start: "09:00", end: "17:00", available: true },
      saturday: { start: "10:00", end: "14:00", available: true },
      sunday: { start: "10:00", end: "14:00", available: false }
    },
    blockedTimes: [],
    maxAppointmentsPerDay: 8,
    preferredTimeSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  })

  const [technicianCalendars] = useState<TechnicianCalendar[]>([
    {
      id: "tech-cal-1",
      technicianId: "tech-1",
      workingHours: {
        monday: { start: "08:00", end: "18:00", available: true },
        tuesday: { start: "08:00", end: "18:00", available: true },
        wednesday: { start: "08:00", end: "18:00", available: true },
        thursday: { start: "08:00", end: "18:00", available: true },
        friday: { start: "08:00", end: "18:00", available: true },
        saturday: { start: "09:00", end: "15:00", available: true },
        sunday: { start: "09:00", end: "15:00", available: false }
      },
      blockedTimes: [],
      maxSessionsPerDay: 12,
      specialties: ["ABA Therapy", "Speech Therapy", "Occupational Therapy"]
    }
  ])

  const filteredPatients = patients.filter(patient =>
    patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.parentContact.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const generateSuggestions = async () => {
    if (!selectedPatient) return

    setLoading(true)
    try {
      // Mock AI-powered suggestions
      const mockSuggestions: AppointmentSuggestion[] = [
        {
          id: "suggestion-1",
          patientId: selectedPatient.id,
          appointmentType,
          suggestedTimes: [
            {
              start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
              end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
              provider: {
                id: bcpaId,
                name: "Dr. Sarah Wilson",
                type: "bcpa"
              },
              confidence: 95,
              rationale: "High confidence based on BCPA availability and patient history"
            }
          ],
          priority: "high",
          createdAt: new Date()
        }
      ]

      if (appointmentType === 'technician-session') {
        // Add technician suggestions
        mockSuggestions.push({
          id: "suggestion-2",
          patientId: selectedPatient.id,
          appointmentType,
          suggestedTimes: [
            {
              start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
              provider: {
                id: "tech-1",
                name: "Jennifer Martinez",
                type: "technician"
              },
              confidence: 90,
              rationale: "Optimal time slot for technician session"
            }
          ],
          priority: "medium",
          createdAt: new Date()
        })
      }

      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const scheduleAppointment = (suggestion: AppointmentSuggestion, timeIndex: number) => {
    const selectedTime = suggestion.suggestedTimes[timeIndex]
    const newAppointment: BCPAAppointment = {
      id: `apt-${Date.now()}`,
      patientId: suggestion.patientId,
      patientName: selectedPatient?.patientName || "",
      parentContact: selectedPatient?.parentContact || {
        name: "",
        email: "",
        phone: ""
      },
      appointmentType: suggestion.appointmentType,
      code: suggestion.appointmentType === 'initial-assessment' ? '151' : 
            suggestion.appointmentType === 'follow-up' ? '155' : 'technician',
      status: 'scheduled',
      scheduledBy: 'bcpa',
      startTime: selectedTime.start,
      endTime: selectedTime.end,
      duration: 60,
      provider: selectedTime.provider,
      location: 'office',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    onAppointmentCreated(newAppointment)
    setSuggestions([])
  }

  const getAppointmentTypeLabel = (type: string) => {
    switch (type) {
      case 'initial-assessment': return 'Initial Assessment (Code 151)'
      case 'follow-up': return 'BCPA Follow-up (Code 155)'
      case 'technician-session': return 'Technician Session'
      default: return type
    }
  }

  return (
    <div className="space-y-6">
      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Select Patient
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
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {patient.parentContact.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {patient.parentContact.email}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {patient.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Configuration */}
      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment-type">Appointment Type</Label>
                <Select value={appointmentType} onValueChange={(value: any) => setAppointmentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial-assessment">
                      Initial Assessment (Code 151)
                    </SelectItem>
                    <SelectItem value="follow-up">
                      BCPA Follow-up (Code 155)
                    </SelectItem>
                    <SelectItem value="technician-session">
                      Technician Session
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                placeholder="Add any special notes for this appointment..."
                rows={3}
              />
            </div>

            <Button 
              onClick={generateSuggestions} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Generating Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Smart Suggestions
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              AI-Powered Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-l-4 border-l-pink-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">
                        {getAppointmentTypeLabel(suggestion.appointmentType)}
                      </h3>
                      <Badge variant={suggestion.priority === 'high' ? 'destructive' : 'default'}>
                        {suggestion.priority.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {suggestion.suggestedTimes.map((time, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {format(time.start, 'MMM d, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {format(time.start, 'HH:mm')} - {format(time.end, 'HH:mm')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{time.provider.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {time.confidence}% confidence
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() => scheduleAppointment(suggestion, index)}
                            >
                              Schedule
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <strong>Rationale:</strong> {suggestion.suggestedTimes[0]?.rationale}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Technician Session Planning */}
      {appointmentType === 'technician-session' && selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Technician Session Planning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total-hours">Total Hours</Label>
                <Input
                  type="number"
                  placeholder="30"
                  min="1"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  type="date"
                  defaultValue={format(addDays(new Date(), 7), 'yyyy-MM-dd')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  type="date"
                  defaultValue={format(addMonths(new Date(), 3), 'yyyy-MM-dd')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessions-per-week">Sessions per Week</Label>
                <Select defaultValue="2">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 session</SelectItem>
                    <SelectItem value="2">2 sessions</SelectItem>
                    <SelectItem value="3">3 sessions</SelectItem>
                    <SelectItem value="4">4 sessions</SelectItem>
                    <SelectItem value="5">5 sessions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-duration">Session Duration</Label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Technician Schedule
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

