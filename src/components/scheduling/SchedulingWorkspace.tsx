"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useSchedulingSuggestions } from "@/hooks/useScheduling"
import { useStudents } from "@/hooks/useSupabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, User, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react"
import { format, addMonths, subMonths, isSameDay, startOfDay, addDays, isToday, getHours, getMinutes, setHours, setMinutes } from "date-fns"
import type { ViewMode } from "@/components/ui/view-mode-toggle"
import { saveAppointment, getAllAppointments } from "@/lib/appointmentStorage"
import { BCBAAppointment } from "@/types/bcpa-appointments"
import { mockBCBAs, BCBA } from "@/data/mockBCBAs"
import { useCalendarAvailability } from "@/hooks/useCalendarAvailability"
import { getCurrentTenantId, loadTenantFromEnvironment } from "@/lib/calendar/tenant-config"
import type { BCBACalendarInfo } from "@/lib/calendar/calendar-availability-service"
import { Calendar } from "@/components/ui/calendar"

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
  const [fallbackSuggestions, setFallbackSuggestions] = useState<any[]>([])
  const [calendarDate, setCalendarDate] = useState(new Date())
  const [bcbaAppointments, setBcbaAppointments] = useState<BCBAAppointment[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ date: Date; time: string } | null>(null)
  const [showAllTimeSlots, setShowAllTimeSlots] = useState(false)
  const [selectedDateForSlots, setSelectedDateForSlots] = useState<Date | null>(null)
  const [showMoreDates, setShowMoreDates] = useState(false)
  
  // Calendar availability hook
  const {
    suggestions: calendarSuggestions,
    loading: calendarLoading,
    error: calendarError,
    isInitialized: calendarInitialized,
    fetchSuggestions: fetchCalendarSuggestions,
    initializeService
  } = useCalendarAvailability()
  
  // Use calendar suggestions if available, otherwise use fallback
  const displayedSuggestions = calendarSuggestions.length > 0 ? calendarSuggestions : fallbackSuggestions

  // Initialize calendar service on mount
  useEffect(() => {
    const initializeCalendar = async () => {
      try {
        const tenantId = getCurrentTenantId()
        const tenantConfig = loadTenantFromEnvironment(tenantId)
        
        if (tenantConfig) {
          await initializeService(tenantConfig)
        } else {
          console.warn('Calendar service not initialized: No tenant configuration found')
        }
      } catch (error) {
        console.error('Failed to initialize calendar service:', error)
      }
    }

    initializeCalendar()
  }, [initializeService])

  // Generate fallback mock suggestions when calendar service is not available
  const generateFallbackSuggestions = useCallback((bcba: BCBA) => {
    const suggestions: any[] = []
    const now = new Date()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    
    // Generate suggestions for the next 14 days
    for (let i = 1; i <= 14; i++) {
      const currentDate = new Date(now)
      currentDate.setDate(now.getDate() + i)
      const dayOfWeek = dayNames[currentDate.getDay()]
      
      // Skip weekends
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue
      }
      
      // Get BCBA availability for this day
      const availableTimes = bcba.availability[dayOfWeek as keyof typeof bcba.availability] || []
      
      // Generate suggestions for each available time slot
      availableTimes.slice(0, 2).forEach((timeSlot, index) => {
        const [hours, minutes] = timeSlot.split(':').map(Number)
        const suggestionDate = new Date(currentDate)
        suggestionDate.setHours(hours, minutes, 0, 0)
        
        // Skip past times
        if (suggestionDate < now) return
        
        const endTime = new Date(suggestionDate)
        endTime.setHours(endTime.getHours() + 1)
        
        const timeString = format(suggestionDate, 'h:mm a') + ' - ' + format(endTime, 'h:mm a')
        
        // Calculate confidence and availability score
        const availabilityScore = 5 + (index === 0 ? 3 : 1) // First slot gets higher score
        const confidence = Math.min(100, availabilityScore * 15)
        
        suggestions.push({
          date: suggestionDate,
          time: timeString,
          duration: '60 min',
          status: availabilityScore >= 7 ? 'High availability • Optimal time' : 
                  availabilityScore >= 5 ? 'Good availability • Recommended' : 
                  'Available • Good option',
          color: availabilityScore >= 7 ? 'green' : 
                 availabilityScore >= 5 ? 'blue' : 
                 'orange',
          bcba: {
            id: bcba.id,
            email: bcba.email,
            name: bcba.name,
            workingHours: {
              start: '08:00',
              end: '20:00'
            },
            specialization: bcba.specialization
          },
          confidence,
          availabilityScore
        })
      })
    }
    
    // Sort by date and limit to top 8
    return suggestions
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 8)
  }, [])

  // Fetch BCBA appointments when BCBA is selected
  useEffect(() => {
    if (selectedBCBA && showAppointmentForm) {
      // Get all appointments and filter for this BCBA
      const allAppointments = getAllAppointments()
      const bcbaAppts = allAppointments.filter(apt => 
        apt.provider.id === selectedBCBA.id && 
        (apt.provider.type === 'bcba' || apt.provider.type === 'bcpa')
      )
      setBcbaAppointments(bcbaAppts)
      
      // Also try to fetch real calendar data if available
      if (calendarInitialized) {
        const bcbaCalendarInfo: BCBACalendarInfo = {
          id: selectedBCBA.id,
          email: selectedBCBA.email,
          name: selectedBCBA.name,
          workingHours: {
            start: '08:00',
            end: '20:00'
          },
          specialization: selectedBCBA.specialization
        }

        fetchCalendarSuggestions(bcbaCalendarInfo, {
          daysAhead: 14,
          durationMinutes: 60,
          excludeWeekends: true
        }).catch(() => {
          console.log('Calendar service failed, using stored appointments only')
        })
      }
    }
  }, [selectedBCBA, showAppointmentForm, calendarInitialized, fetchCalendarSuggestions])

  // Listen for appointment updates
  useEffect(() => {
    const handleAppointmentUpdate = () => {
      if (selectedBCBA) {
        const allAppointments = getAllAppointments()
        const bcbaAppts = allAppointments.filter(apt => 
          apt.provider.id === selectedBCBA.id && 
          (apt.provider.type === 'bcba' || apt.provider.type === 'bcpa')
        )
        setBcbaAppointments(bcbaAppts)
      }
    }

    window.addEventListener('appointmentCreated', handleAppointmentUpdate)
    window.addEventListener('appointmentUpdated', handleAppointmentUpdate)
    window.addEventListener('appointmentDeleted', handleAppointmentUpdate)

    return () => {
      window.removeEventListener('appointmentCreated', handleAppointmentUpdate)
      window.removeEventListener('appointmentUpdated', handleAppointmentUpdate)
      window.removeEventListener('appointmentDeleted', handleAppointmentUpdate)
    }
  }, [selectedBCBA])

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
    const allAppointments = getAllAppointments()
    const existingAppointments = allAppointments.filter(apt => 
      apt.provider.id === selectedBCBA.id && 
      (apt.provider.type === 'bcba' || apt.provider.type === 'bcpa')
    )
    const hasConflict = existingAppointments.some((existing: BCBAAppointment) => {
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
    
    // Show success message
    alert(`✓ Appointment scheduled successfully!\n\n${selectedAppointmentType} appointment for ${selectedStudent.name} with ${selectedBCBA.name}\n${format(appointmentStart, 'EEEE, MMM dd, yyyy')} at ${format(appointmentStart, 'h:mm a')}\n\nThis appointment will appear on the calendar.`)
    
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

              {/* BCBA Calendar View */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">
                    {selectedBCBA?.name}'s Calendar
                  </h4>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCalendarDate(subMonths(calendarDate, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCalendarDate(new Date())}
                    >
                      Today
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCalendarDate(addMonths(calendarDate, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {selectedBCBA && (
                  <div className="border rounded-lg p-4 bg-white">
                    <Calendar
                      currentDate={calendarDate}
                      events={bcbaAppointments.map(apt => ({
                        id: apt.id,
                        start: apt.startTime,
                        end: apt.endTime,
                        student: apt.patientName,
                        therapist: apt.provider.name,
                        appointmentType: apt.appointmentType,
                        code: apt.code,
                        status: apt.status
                      }))}
                      getEventDate={(event) => new Date(event.start)}
                      getEventKey={(event) => event.id}
                      renderEvent={(event) => (
                        <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-xs">
                          <div className="font-medium text-blue-800 truncate">{event.student}</div>
                          <div className="text-blue-600">{format(new Date(event.start), 'h:mm a')}</div>
                          {event.code && (
                            <Badge variant="outline" className="text-xs mt-1">{event.code}</Badge>
                          )}
                        </div>
                      )}
                      className="min-h-[500px]"
                    />

                    {/* Time Slot Selection */}
                    {selectedTimeSlot && (
                      <Card className="mt-4 border-green-200 bg-green-50">
                        <CardHeader>
                          <CardTitle className="text-sm">Selected Time Slot</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm">
                              <strong>Date:</strong> {format(selectedTimeSlot.date, 'EEEE, MMM dd, yyyy')}
                            </p>
                            <p className="text-sm">
                              <strong>Time:</strong> {selectedTimeSlot.time}
                            </p>
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  if (selectedTimeSlot && selectedStudent && selectedBCBA) {
                                    scheduleAppointment({
                                      date: selectedTimeSlot.date,
                                      time: selectedTimeSlot.time,
                                      duration: '60 min'
                                    })
                                    setShowAppointmentForm(false)
                                    setSelectedAppointmentType(null)
                                    setSelectedTimeSlot(null)
                                  }
                                }}
                              >
                                Confirm Appointment
                              </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                                onClick={() => setSelectedTimeSlot(null)}
                >
                                Cancel
                </Button>
              </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Available Time Slots for Selected Date */}
                    {showAllTimeSlots && selectedDateForSlots && selectedBCBA && (
                      <Card className="mt-4 border-blue-200 bg-blue-50">
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center justify-between">
                            <span>Available Time Slots for {format(selectedDateForSlots, 'EEEE, MMM dd, yyyy')}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowAllTimeSlots(false)
                                setSelectedDateForSlots(null)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {(() => {
                              const dayOfWeek = format(selectedDateForSlots, 'EEEE').toLowerCase()
                              const availableTimes = selectedBCBA.availability[dayOfWeek as keyof typeof selectedBCBA.availability] || []
                              const dayAppointments = bcbaAppointments.filter(apt => 
                                isSameDay(new Date(apt.startTime), selectedDateForSlots)
                              )
                              
                              return availableTimes
                                .filter(time => {
                                  const [hours, minutes] = time.split(':').map(Number)
                                  const slotStart = setHours(setMinutes(selectedDateForSlots, minutes), hours)
                                  const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000)
                                  
                                  return !dayAppointments.some(apt => {
                                    const aptStart = new Date(apt.startTime)
                                    const aptEnd = new Date(apt.endTime)
                                    return (slotStart < aptEnd && slotEnd > aptStart)
                                  })
                                })
                                .map((time, idx) => {
                                  const [hours, minutes] = time.split(':').map(Number)
                                  const slotDate = setHours(setMinutes(selectedDateForSlots, minutes), hours)
                                  const timeString = format(slotDate, 'h:mm a')
                                  const isSelected = selectedTimeSlot?.time === timeString && 
                                                    isSameDay(selectedTimeSlot.date, selectedDateForSlots)
                                  
                                  return (
                                    <Button
                                      key={idx}
                                      variant={isSelected ? "default" : "outline"}
                                      size="sm"
                                      className={isSelected ? "bg-blue-600 hover:bg-blue-700" : ""}
                                      onClick={() => {
                                        setSelectedTimeSlot({ date: selectedDateForSlots, time: timeString })
                                      }}
                                    >
                                      {timeString}
                                    </Button>
                                  )
                                })
                            })()}
                          </div>
                          {(() => {
                            const dayOfWeek = format(selectedDateForSlots, 'EEEE').toLowerCase()
                            const availableTimes = selectedBCBA.availability[dayOfWeek as keyof typeof selectedBCBA.availability] || []
                            const dayAppointments = bcbaAppointments.filter(apt => 
                              isSameDay(new Date(apt.startTime), selectedDateForSlots)
                            )
                            const availableCount = availableTimes.filter(time => {
                              const [hours, minutes] = time.split(':').map(Number)
                              const slotStart = setHours(setMinutes(selectedDateForSlots, minutes), hours)
                              const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000)
                              
                              return !dayAppointments.some(apt => {
                                const aptStart = new Date(apt.startTime)
                                const aptEnd = new Date(apt.endTime)
                                return (slotStart < aptEnd && slotEnd > aptStart)
                              })
                            }).length
                            
                            if (availableCount === 0) {
                              return (
                                <p className="text-sm text-muted-foreground mt-2">
                                  No available time slots for this date.
                                </p>
                              )
                            }
                            return null
                          })()}
                        </CardContent>
                      </Card>
                    )}
                    
                    {!showAllTimeSlots && (
                      <div className="mt-4">
                        <h5 className="font-medium text-sm mb-2">Click on a date to see available time slots</h5>
                        <div className="grid grid-cols-7 gap-2 mt-2">
                          {Array.from({ length: showMoreDates ? 14 : 7 }).map((_, dayOffset) => {
                            const date = addDays(startOfDay(calendarDate), dayOffset - 3)
                            const dayAppointments = bcbaAppointments.filter(apt => 
                              isSameDay(new Date(apt.startTime), date)
                            )
                            const isAvailable = date >= startOfDay(new Date())
                            const dayName = format(date, 'EEE')
                            const dayNumber = format(date, 'd')

                            // Get available time slots based on BCBA availability
                            const getAvailableSlots = () => {
                              if (!selectedBCBA || !isAvailable) return []
                              const dayOfWeek = format(date, 'EEEE').toLowerCase()
                              const availableTimes = selectedBCBA.availability[dayOfWeek as keyof typeof selectedBCBA.availability] || []
                              
                              // Filter out times that conflict with existing appointments
                              return availableTimes.filter(time => {
                                const [hours, minutes] = time.split(':').map(Number)
                                const slotStart = setHours(setMinutes(date, minutes), hours)
                                const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000)
                                
                                return !dayAppointments.some(apt => {
                                  const aptStart = new Date(apt.startTime)
                                  const aptEnd = new Date(apt.endTime)
                                  return (slotStart < aptEnd && slotEnd > aptStart)
                                })
                              })
                            }

                            const availableSlots = getAvailableSlots()

                            return (
                              <div
                                key={dayOffset}
                                className={`p-2 rounded border cursor-pointer transition-all ${
                                  isAvailable
                                    ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                    : 'border-gray-100 bg-gray-50 opacity-50'
                                }`}
                                onClick={() => {
                                  if (isAvailable && availableSlots.length > 0) {
                                    setSelectedDateForSlots(date)
                                    setShowAllTimeSlots(true)
                                    // Also set the first slot as default
                                    const firstSlot = availableSlots[0]
                                    const [hours, minutes] = firstSlot.split(':').map(Number)
                                    const timeString = format(setHours(setMinutes(date, minutes), hours), 'h:mm a')
                                    setSelectedTimeSlot({ date, time: timeString })
                                  }
                                }}
                              >
                                <div className="text-xs font-medium text-gray-600">{dayName}</div>
                                <div className={`text-lg font-bold ${isToday(date) ? 'text-blue-600' : 'text-gray-800'}`}>
                                  {dayNumber}
                                </div>
                                {dayAppointments.length > 0 && (
                                  <div className="text-xs text-blue-600 mt-1">
                                    {dayAppointments.length} appointment{dayAppointments.length > 1 ? 's' : ''}
                                  </div>
                                )}
                                {isAvailable && availableSlots.length > 0 && (
                                  <div className="text-xs text-green-600 mt-1">
                                    {availableSlots.length} slot{availableSlots.length > 1 ? 's' : ''} available
            </div>
          )}
        </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                    setShowMoreDates(!showMoreDates)
                  }}
                >
                  {showMoreDates ? 'Show Fewer Dates' : 'Show More Options'}
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