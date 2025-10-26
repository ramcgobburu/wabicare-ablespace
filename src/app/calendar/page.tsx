"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Plus, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useSchedulingCalendar } from "@/hooks/useScheduling"
import { format, addMonths, subMonths, isToday, isSameDay, startOfDay } from "date-fns"
import { Badge } from "@/components/ui/badge"
import PageLayout from "@/components/PageLayout"
import { updateAppointment, clearAllAppointments } from "@/lib/appointmentStorage"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { entries, loading } = useSchedulingCalendar()

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1))
  }

  const todayEvents = useMemo(() => {
    return entries.filter(entry => isSameDay(new Date(entry.start), new Date()))
  }, [entries])


  const getEventDate = (event: any) => new Date(event.start)
  const getEventKey = (event: any, index: number) => `${event.id}-${index}`
  
  const handleEventMove = (event: any, newDate: Date) => {
    // Calculate the time difference between original and new date
    const originalDate = new Date(event.start)
    const timeDiff = newDate.getTime() - originalDate.getTime()
    
    // Create new start and end times with the same time but new date
    const newStart = new Date(originalDate.getTime() + timeDiff)
    const newEnd = new Date(new Date(event.end).getTime() + timeDiff)
    
    // Update the appointment in storage
    updateAppointment(event.id, {
      startTime: newStart,
      endTime: newEnd
    })
    
    console.log(`Moved appointment ${event.student} to ${format(newDate, 'MMM d, yyyy')}`)
  }
  
  const handleEventDragStart = (event: any) => {
    console.log('Started dragging:', event.student)
  }
  
  const handleEventDragEnd = (event: any) => {
    console.log('Finished dragging:', event.student)
  }
  
  const getAppointmentTypeColor = (appointmentType: string) => {
    switch (appointmentType) {
      case 'initial-assessment':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'follow-up':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'technician-session':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'default'
      case 'completed':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      case 'suggested':
        return 'outline'
      default:
        return 'outline'
    }
  }
  
  const renderEvent = (event: any) => (
    <div className="group relative">
      {/* Two-line display */}
      <div className="bg-green-50 border border-green-200 rounded-md px-2 py-1.5 text-xs hover:bg-green-100 transition-colors cursor-pointer">
        {/* First line: Student name */}
        <div className="flex items-center gap-1 mb-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
          <span className="font-semibold text-green-800 truncate">{event.student}</span>
        </div>
        
        {/* Second line: Type and time */}
        <div className="flex items-center justify-between gap-1">
          {event.appointmentType && (
            <span className="text-xs text-green-700 font-medium truncate">
              {event.appointmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          )}
          <span className="text-xs text-green-600 font-medium flex-shrink-0">
            {format(new Date(event.start), 'h:mm a')}
          </span>
        </div>
      </div>

      {/* Hover tooltip with full details */}
      <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none top-full left-0 mt-1 w-80">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-gray-800 text-sm">{event.student}</span>
            </div>
            <Badge 
              variant={getStatusColor(event.status)}
              className="text-xs px-2 py-1"
            >
              {event.status}
            </Badge>
          </div>
          
          {/* Full details */}
          <div className="space-y-1">
            {/* Provider */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600 font-medium">Provider:</span>
              <span className="text-xs text-gray-700">{event.therapist}</span>
            </div>
            
            {/* Appointment Type and Code */}
            {event.appointmentType && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">Type:</span>
                <div className={`text-xs px-2 py-0.5 rounded-full ${getAppointmentTypeColor(event.appointmentType)}`}>
                  {event.appointmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                {event.code && (
                  <Badge variant="outline" className="text-xs px-1 py-0 ml-1">
                    {event.code}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Time */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600 font-medium">Time:</span>
              <span className="text-xs text-gray-700">
                {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
              </span>
            </div>
            
            {/* Location */}
            {event.location && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">Location:</span>
                <span className="text-xs text-gray-700 capitalize">{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New BCPA Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Calendar View
                    </CardTitle>
                    <CardDescription>
                      View and manage BCPA appointments and assessments
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        if (confirm('Are you sure you want to clear all appointment data? This action cannot be undone.')) {
                          clearAllAppointments()
                          window.location.reload()
                        }
                      }}
                    >
                      Clear All Data
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                    Loading calendar...
                  </div>
                ) : (
                  <Calendar
                    currentDate={currentDate}
                    events={entries}
                    getEventDate={getEventDate}
                    getEventKey={getEventKey}
                    renderEvent={renderEvent}
                    className="h-auto"
                    onEventMove={handleEventMove}
                    onEventDragStart={handleEventDragStart}
                    onEventDragEnd={handleEventDragEnd}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today&apos;s BCPA Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : todayEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events scheduled for today</p>
                ) : (
                  <div className="space-y-3">
                    {todayEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{event.student}</p>
                            {event.code && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                {event.code}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
                          </p>
                          <p className="text-xs text-muted-foreground">with {event.therapist}</p>
                          {event.appointmentType && (
                            <div className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${getAppointmentTypeColor(event.appointmentType)}`}>
                              {event.appointmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </div>
                          )}
                          {event.location && (
                            <p className="text-xs text-muted-foreground mt-1">
                              📍 {event.location.charAt(0).toUpperCase() + event.location.slice(1)}
                            </p>
                          )}
                        </div>
                        <Badge 
                          variant={getStatusColor(event.status)}
                          className="text-xs"
                        >
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </PageLayout>
  )
}
