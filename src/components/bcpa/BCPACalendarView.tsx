"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ChevronLeft, 
  ChevronRight,
  Move,
  Edit,
  Trash2
} from "lucide-react"
import { format, addMonths, subMonths, isToday, isSameDay, startOfDay, addDays } from "date-fns"
import type { BCPAAppointment } from "@/types/bcpa-appointments"

interface BCPACalendarViewProps {
  appointments: BCPAAppointment[]
  onAppointmentUpdate: (appointment: BCPAAppointment) => void
}

export function BCPACalendarView({ appointments, onAppointmentUpdate }: BCPACalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [draggedAppointment, setDraggedAppointment] = useState<BCPAAppointment | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1))
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.startTime), date)
    )
  }

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'initial-assessment': return 'bg-blue-500'
      case 'follow-up': return 'bg-green-500'
      case 'technician-session': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'border-blue-200 bg-blue-50'
      case 'completed': return 'border-green-200 bg-green-50'
      case 'cancelled': return 'border-red-200 bg-red-50'
      case 'rescheduled': return 'border-yellow-200 bg-yellow-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const handleDragStart = (appointment: BCPAAppointment) => {
    setDraggedAppointment(appointment)
  }

  const handleDragEnd = (newDate: Date) => {
    if (draggedAppointment) {
      const updatedAppointment = {
        ...draggedAppointment,
        startTime: newDate,
        endTime: new Date(newDate.getTime() + draggedAppointment.duration * 60 * 1000),
        updatedAt: new Date()
      }
      onAppointmentUpdate(updatedAppointment)
      setDraggedAppointment(null)
    }
  }

  const renderMonthView = () => {
    const monthStart = startOfDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    const monthEnd = addDays(monthStart, 35) // 5 weeks
    const days = []
    
    for (let i = 0; i < 35; i++) {
      const day = addDays(monthStart, i)
      const dayAppointments = getAppointmentsForDate(day)
      
      days.push(
        <div 
          key={day.toISOString()}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            isToday(day) ? 'bg-blue-50' : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleDragEnd(day)
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isToday(day) ? 'text-blue-600' : 'text-gray-700'
            }`}>
              {format(day, 'd')}
            </span>
            {dayAppointments.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {dayAppointments.length}
              </Badge>
            )}
          </div>
          
          <div className="space-y-1">
            {dayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                draggable
                onDragStart={() => handleDragStart(appointment)}
                className={`p-2 rounded text-xs cursor-move border-l-4 ${
                  getAppointmentTypeColor(appointment.appointmentType)
                } ${getStatusColor(appointment.status)}`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">
                    {format(new Date(appointment.startTime), 'HH:mm')}
                  </span>
                </div>
                <div className="font-medium truncate">
                  {appointment.patientName}
                </div>
                <div className="text-xs opacity-75">
                  {appointment.appointmentType.replace('-', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-50 p-3 text-center font-medium text-sm border-b">
            {day}
          </div>
        ))}
        {days}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfDay(new Date(currentDate))
    const weekDays = []
    
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i)
      const dayAppointments = getAppointmentsForDate(day)
      
      weekDays.push(
        <div key={day.toISOString()} className="flex-1 border border-gray-200">
          <div className="bg-gray-50 p-3 text-center font-medium text-sm border-b">
            {format(day, 'EEE, MMM d')}
          </div>
          <div className="p-3 space-y-2 min-h-[400px]">
            {dayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                draggable
                onDragStart={() => handleDragStart(appointment)}
                className={`p-3 rounded border-l-4 ${
                  getAppointmentTypeColor(appointment.appointmentType)
                } ${getStatusColor(appointment.status)}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">
                    {format(new Date(appointment.startTime), 'HH:mm')} - 
                    {format(new Date(appointment.endTime), 'HH:mm')}
                  </span>
                </div>
                <div className="font-medium mb-1">
                  {appointment.patientName}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {appointment.appointmentType.replace('-', ' ')}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="flex border border-gray-200 rounded-lg overflow-hidden">
        {weekDays}
      </div>
    )
  }

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate)
    
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 text-center font-medium text-lg border-b">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </div>
        <div className="p-4 space-y-4">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No appointments scheduled for this day
            </div>
          ) : (
            dayAppointments.map((appointment) => (
              <Card key={appointment.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getAppointmentTypeColor(appointment.appointmentType)}>
                        {appointment.appointmentType.replace('-', ' ')}
                      </Badge>
                      <Badge variant="outline">
                        {appointment.code}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {appointment.patientName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(appointment.startTime), 'HH:mm')} - 
                        {format(new Date(appointment.endTime), 'HH:mm')}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {appointment.provider.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {appointment.parentContact.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {appointment.parentContact.email}
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Initial Assessment (151)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Follow-up (155)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span>Technician Sessions</span>
        </div>
      </div>
    </div>
  )
}

