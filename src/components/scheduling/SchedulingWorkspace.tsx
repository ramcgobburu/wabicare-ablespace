"use client"

import { useState, useEffect, useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useSchedulingSuggestions } from "@/hooks/useScheduling"
import { useStudents } from "@/hooks/useSupabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, User, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import type { ViewMode } from "@/components/ui/view-mode-toggle"
import { saveAppointment, getAppointmentsForProvider } from "@/lib/appointmentStorage"
import { BCBAAppointment } from "@/types/bcpa-appointments"
import { mockBCBAs, BCBA } from "@/data/mockBCBAs"

interface SchedulingWorkspaceProps {
  variant?: "sheet" | "full"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  viewMode?: ViewMode
  selectedStudentId?: string | null
}

export function SchedulingWorkspace({ variant = "sheet", open = false, onOpenChange, viewMode = "cards", selectedStudentId }: SchedulingWorkspaceProps) {
  const { suggestions, loading } = useSchedulingSuggestions()
  const { students } = useStudents()
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null)
  const [selectedBCBA, setSelectedBCBA] = useState<BCBA | null>(null)
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<string | null>(null)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [scheduledAppointments, setScheduledAppointments] = useState<any[]>([])

  // Set selected student from URL parameter
  useEffect(() => {
    if (selectedStudentId && students.length > 0) {
      const student = students.find(s => s.id === selectedStudentId)
      if (student) {
        setSelectedStudent({ id: student.id, name: student.name })
      }
    }
  }, [selectedStudentId, students])

  const handleAppointmentClick = (appointmentCode: string) => {
    setSelectedAppointmentType(appointmentCode)
    setShowAppointmentForm(true)
    console.log(`Selected appointment type: ${appointmentCode}`)
  }


  // Function to schedule an appointment
  const scheduleAppointment = (suggestion: any) => {
    if (!selectedStudent) {
      alert('Please select a student first')
      return
    }
    
    if (!selectedBCBA) {
      alert('Please select a BCBA first')
      return
    }

    const appointmentStart = new Date(suggestion.date)
    const appointmentEnd = new Date(suggestion.date)
    
    // Parse time string (e.g., "2:00 PM - 3:00 PM")
    const timeMatch = suggestion.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/)
    if (timeMatch) {
      let hours = parseInt(timeMatch[1])
      const minutes = parseInt(timeMatch[2])
      const ampm = timeMatch[3]
      
      if (ampm === 'PM' && hours !== 12) hours += 12
      if (ampm === 'AM' && hours === 12) hours = 0
      
      appointmentStart.setHours(hours, minutes, 0, 0)
      appointmentEnd.setHours(hours + 1, minutes, 0, 0) // 1 hour duration
    }

    // Business hours validation (8 AM to 8 PM)
    const startHour = appointmentStart.getHours()
    if (startHour < 8 || startHour >= 20) {
      alert('Appointments must be scheduled between 8:00 AM and 8:00 PM')
      return
    }

    // Check for conflicts with existing appointments
    const existingAppointments = getAppointmentsForProvider("bcpa-001")
    const hasConflict = existingAppointments.some(existing => {
      const existingStart = new Date(existing.startTime)
      const existingEnd = new Date(existing.endTime)
      
      // Check if the new appointment overlaps with any existing appointment
      return (appointmentStart < existingEnd && appointmentEnd > existingStart)
    })

    if (hasConflict) {
      alert('This time slot conflicts with an existing appointment. Please choose a different time.')
      return
    }

    // Create BCBA appointment for global storage
    const bcbaAppointment: BCBAAppointment = {
      id: `scheduled-${Date.now()}`,
      patientId: selectedStudent.id,
      patientName: selectedStudent.name,
      parentContact: {
        email: "",
        phone: "",
        name: ""
      },
      appointmentType: selectedAppointmentType === '97151' ? 'initial-assessment-reauthorization' : 
                      selectedAppointmentType === '97152' ? 'behavior-identification-supportive-assessment' :
                      selectedAppointmentType === '97153' ? 'direct-services' :
                      selectedAppointmentType === '97155' ? 'supervision' : 
                      selectedAppointmentType === '97156' ? 'care-giver-training' : 
                      selectedAppointmentType === '97158' ? 'adaptive-behavior-treatment' :
                      selectedAppointmentType === 'H0032' ? 'indirect-supervision' : 'technician-session',
      code: selectedAppointmentType as '97151' | '97152' | '97153' | '97155' | '97156' | '97158' | 'H0032' | 'technician',
      status: 'scheduled',
      scheduledBy: 'bcba',
      startTime: appointmentStart,
      endTime: appointmentEnd,
      duration: 60,
      provider: {
        id: selectedBCBA.id,
        name: `${selectedBCBA.name} (BCBA)`,
        type: 'bcba'
      },
      location: 'office',
      notes: "",
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Save to global storage
    saveAppointment(bcbaAppointment)

    // Also update local state for immediate UI feedback
    const newAppointment = {
      id: bcbaAppointment.id,
      student: selectedStudent.name,
      therapist: selectedBCBA.name,
      start: appointmentStart.toISOString(),
      end: appointmentEnd.toISOString(),
      status: "confirmed" as const,
      appointmentType: 'bcba',
      code: selectedAppointmentType
    }

    setScheduledAppointments(prev => [...prev, newAppointment])
    console.log(`Scheduled ${selectedAppointmentType} appointment for ${selectedStudent.name} with ${selectedBCBA.name} on ${format(appointmentStart, 'EEEE, MMM dd, yyyy')} at ${suggestion.time}`)
  }


  const content = (
    <div className="space-y-8">
      {/* Header Message */}
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <h1 className="text-2xl font-bold text-gray-900">Please select the type of appointment</h1>
        {selectedStudent && (
          <p className="text-lg text-blue-600 mt-2">
            You are scheduling an appointment for <strong>{selectedStudent.name}</strong>
            {selectedBCBA && (
              <span> with <strong>{selectedBCBA.name}</strong></span>
            )}
          </p>
        )}
      </div>

      {/* Schedule an Appointment Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Schedule an Appointment</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {/* BCBA Appointment Types */}
          <Card 
            className="cursor-pointer transition-all hover:border-blue-300 hover:shadow-sm"
            onClick={() => handleAppointmentClick('97151')}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-blue-600 mb-1">97151</div>
              <h3 className="text-sm font-semibold mb-1">Initial Assessment / Reauthorization</h3>
              <p className="text-xs text-muted-foreground mb-3">BCBA initial evaluation and reauthorization services</p>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1 h-7"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAppointmentClick('97151')
                }}
              >
                Schedule
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:border-green-300 hover:shadow-sm"
            onClick={() => handleAppointmentClick('97152')}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-green-600 mb-1">97152</div>
              <h3 className="text-sm font-semibold mb-1">Behavior Identification Supportive Assessment</h3>
              <p className="text-xs text-muted-foreground mb-3">BCBA behavior identification and supportive assessment</p>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1 h-7"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAppointmentClick('97152')
                }}
              >
                Schedule
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:border-green-300 hover:shadow-sm"
            onClick={() => handleAppointmentClick('97153')}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-green-600 mb-1">97153</div>
              <h3 className="text-sm font-semibold mb-1">Direct Services</h3>
              <p className="text-xs text-muted-foreground mb-3">BCBA direct behavioral intervention services</p>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1 h-7"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAppointmentClick('97153')
                }}
              >
                Schedule
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:border-purple-300 hover:shadow-sm"
            onClick={() => handleAppointmentClick('97155')}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-purple-600 mb-1">97155</div>
              <h3 className="text-sm font-semibold mb-1">Supervision</h3>
              <p className="text-xs text-muted-foreground mb-3">BCBA supervision of RBT and staff</p>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1 h-7"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAppointmentClick('97155')
                }}
              >
                Schedule
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:border-orange-300 hover:shadow-sm"
            onClick={() => handleAppointmentClick('97156')}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-orange-600 mb-1">97156</div>
              <h3 className="text-sm font-semibold mb-1">Care Giver Training</h3>
              <p className="text-xs text-muted-foreground mb-3">BCBA training for parents and caregivers</p>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1 h-7"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAppointmentClick('97156')
                }}
              >
                Schedule
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:border-pink-300 hover:shadow-sm"
            onClick={() => handleAppointmentClick('97158')}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-pink-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-pink-600 mb-1">97158</div>
              <h3 className="text-sm font-semibold mb-1">Adaptive Behavior Treatment</h3>
              <p className="text-xs text-muted-foreground mb-3">BCBA adaptive behavior treatment with protocol modification</p>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1 h-7"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAppointmentClick('97158')
                }}
              >
                Schedule
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:border-teal-300 hover:shadow-sm"
            onClick={() => handleAppointmentClick('H0032')}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-teal-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-teal-600 mb-1">H0032</div>
              <h3 className="text-sm font-semibold mb-1">Indirect Supervision</h3>
              <p className="text-xs text-muted-foreground mb-3">BCBA indirect supervision and consultation</p>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1 h-7"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAppointmentClick('H0032')
                }}
              >
                Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Appointment Suggestions */}
      {showAppointmentForm && selectedAppointmentType && (
        <div className="space-y-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Schedule {selectedAppointmentType} Appointment - AI Suggestions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on BCBA calendar availability and optimal scheduling patterns
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Student Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {selectedStudent ? `Scheduling for: ${selectedStudent.name}` : 'Select Student'}
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedStudent?.id || ''}
                  onChange={(e) => {
                    const student = students.find(s => s.id === e.target.value)
                    if (student) {
                      setSelectedStudent({ id: student.id, name: student.name })
                    }
                  }}
                >
                  <option value="">Select a student...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* BCBA Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {selectedBCBA ? `Assigned BCBA: ${selectedBCBA.name}` : 'Select BCBA'}
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedBCBA?.id || ''}
                  onChange={(e) => {
                    const bcba = mockBCBAs.find(b => b.id === e.target.value)
                    if (bcba) {
                      setSelectedBCBA(bcba)
                    }
                  }}
                >
                  <option value="">Select a BCBA...</option>
                  {mockBCBAs.filter(bcba => bcba.isActive).map(bcba => (
                    <option key={bcba.id} value={bcba.id}>
                      {bcba.name} - {bcba.credentials} ({bcba.currentPatients}/{bcba.maxPatients} patients)
                    </option>
                  ))}
                </select>
                {selectedBCBA && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm">
                    <div className="font-medium text-blue-800">{selectedBCBA.name}</div>
                    <div className="text-blue-600">{selectedBCBA.credentials}</div>
                    <div className="text-blue-600">Specializations: {selectedBCBA.specialization.join(', ')}</div>
                    <div className="text-blue-600">Email: {selectedBCBA.email}</div>
                  </div>
                )}
              </div>

              {/* AI Suggestions */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Recommended Time Slots</h4>
                <div className="grid gap-3">
                  {/* Generate dynamic suggestions based on current date */}
                  {(() => {
                    const now = new Date()
                    const suggestions = [
                      {
                        date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
                        time: "2:00 PM - 3:00 PM",
                        duration: "60 min",
                        status: "High availability • Optimal time",
                        color: "green",
                        icon: Check
                      },
                      {
                        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
                        time: "10:30 AM - 11:30 AM",
                        duration: "60 min",
                        status: "Good availability • Morning slot",
                        color: "blue",
                        icon: Check
                      },
                      {
                        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                        time: "3:30 PM - 4:30 PM",
                        duration: "60 min",
                        status: "Available • Afternoon slot",
                        color: "orange",
                        icon: Check
                      },
                      {
                        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                        time: "1:00 PM - 2:00 PM",
                        duration: "60 min",
                        status: "Available • End of week",
                        color: "purple",
                        icon: Check
                      }
                    ]

                    return suggestions.map((suggestion, index) => {
                      const IconComponent = suggestion.icon
                      const colorClasses = {
                        green: "border-green-200 bg-green-50 hover:border-green-300 text-green-600 bg-green-100",
                        blue: "border-blue-200 bg-blue-50 hover:border-blue-300 text-blue-600 bg-blue-100",
                        orange: "border-orange-200 bg-orange-50 hover:border-orange-300 text-orange-600 bg-orange-100",
                        purple: "border-purple-200 bg-purple-50 hover:border-purple-300 text-purple-600 bg-purple-100"
                      }

                      return (
                        <Card key={index} className={`${colorClasses[suggestion.color as keyof typeof colorClasses].split(' ')[0]} ${colorClasses[suggestion.color as keyof typeof colorClasses].split(' ')[1]} hover:${colorClasses[suggestion.color as keyof typeof colorClasses].split(' ')[2]} cursor-pointer transition-all`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 ${colorClasses[suggestion.color as keyof typeof colorClasses].split(' ')[4]} rounded-full flex items-center justify-center`}>
                                  <IconComponent className={`h-4 w-4 ${colorClasses[suggestion.color as keyof typeof colorClasses].split(' ')[3]}`} />
                                </div>
                                <div>
                                  <p className="font-medium">{format(suggestion.date, 'EEEE, MMM dd, yyyy')}</p>
                                  <p className="text-sm text-muted-foreground">{suggestion.time} ({suggestion.duration})</p>
                                  <p className={`text-xs ${colorClasses[suggestion.color as keyof typeof colorClasses].split(' ')[3]}`}>✓ {suggestion.status}</p>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                className={`${colorClasses[suggestion.color as keyof typeof colorClasses].split(' ')[3].replace('text-', 'bg-')} hover:${colorClasses[suggestion.color as keyof typeof colorClasses].split(' ')[3].replace('text-', 'bg-').replace('-600', '-700')}`}
                                onClick={() => {
                                  scheduleAppointment(suggestion)
                                  setShowAppointmentForm(false)
                                  setSelectedAppointmentType(null)
                                }}
                              >
                                Select
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  })()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowAppointmentForm(false)
                    setSelectedAppointmentType(null)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    console.log(`Generating more suggestions for ${selectedAppointmentType}`)
                    // In a real app, this would fetch more suggestions
                  }}
                >
                  Show More Options
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}






    </div>
  )

  if (variant === "full") {
    return (
      <div className="rounded-xl border border-muted bg-card shadow-sm p-6">
        {content}
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange ?? (() => {})}>
      <SheetContent side="right" className="max-w-4xl mx-auto w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Scheduling Dashboard</SheetTitle>
          <SheetDescription>
            Schedule BCBA appointments and manage client sessions.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-6">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  )
}