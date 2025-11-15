"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  GripVertical,
  Clock,
  User
} from "lucide-react"
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addWeeks, 
  subWeeks,
  isSameDay,
  isToday,
  addDays,
  setHours,
  setMinutes,
  getHours,
  getMinutes
} from "date-fns"
import { BCBAAppointment } from "@/types/bcpa-appointments"
import { cn } from "@/lib/utils"

interface DragDropCalendarProps {
  appointments: BCBAAppointment[]
  onAppointmentMove?: (appointmentId: string, newStartTime: Date, newEndTime: Date) => void
  onAppointmentClick?: (appointment: BCBAAppointment) => void
  onTimeSlotClick?: (date: Date, hour: number) => void
  viewMode?: 'week' | 'month'
  startHour?: number
  endHour?: number
}

interface DraggedAppointment {
  appointment: BCBAAppointment
  offsetX: number
  offsetY: number
}

export function DragDropCalendar({
  appointments,
  onAppointmentMove,
  onAppointmentClick,
  onTimeSlotClick,
  viewMode = 'week',
  startHour = 8,
  endHour = 20
}: DragDropCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [draggedAppointment, setDraggedAppointment] = useState<DraggedAppointment | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<{ date: Date; hour: number } | null>(null)

  // Get week days
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 0 })
    const end = endOfWeek(currentWeek, { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [currentWeek])

  // Generate time slots
  const timeSlots = useMemo(() => {
    const slots: number[] = []
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(hour)
    }
    return slots
  }, [startHour, endHour])

  // Get appointments for a specific day and hour
  const getAppointmentsForSlot = useCallback((date: Date, hour: number) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startTime)
      const aptHour = getHours(aptDate)
      return isSameDay(aptDate, date) && aptHour === hour
    })
  }, [appointments])

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent, appointment: BCBAAppointment) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDraggedAppointment({
      appointment,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('appointmentId', appointment.id)
  }, [])

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverSlot({ date, hour })
  }, [])

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault()
    const appointmentId = e.dataTransfer.getData('appointmentId')
    const appointment = appointments.find(apt => apt.id === appointmentId)
    
    if (appointment && onAppointmentMove) {
      const originalStart = new Date(appointment.startTime)
      const duration = appointment.duration || 60
      
      // Calculate new start time
      const newStartTime = setMinutes(setHours(date, hour), getMinutes(originalStart))
      const newEndTime = new Date(newStartTime.getTime() + duration * 60 * 1000)
      
      onAppointmentMove(appointmentId, newStartTime, newEndTime)
    }
    
    setDraggedAppointment(null)
    setDragOverSlot(null)
  }, [appointments, onAppointmentMove])

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedAppointment(null)
    setDragOverSlot(null)
  }, [])

  // Navigate weeks
  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1))
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1))
  const goToToday = () => setCurrentWeek(new Date())

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendar View
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {format(startOfWeek(currentWeek, { weekStartsOn: 0 }), 'MMM d')} - {format(endOfWeek(currentWeek, { weekStartsOn: 0 }), 'MMM d, yyyy')}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day Headers */}
            <div className="grid grid-cols-8 border-b">
              <div className="p-2 font-medium text-sm text-muted-foreground">Time</div>
              {weekDays.map((day, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-2 text-center border-l",
                    isToday(day) && "bg-blue-50 font-semibold"
                  )}
                >
                  <div className="text-xs text-muted-foreground">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-lg font-semibold">
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="relative">
              {timeSlots.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-l">
                  {/* Time Label */}
                  <div className="p-2 text-xs text-muted-foreground border-r">
                    {format(setHours(new Date(), hour), 'h:mm a')}
                  </div>

                  {/* Day Columns */}
                  {weekDays.map((day, dayIdx) => {
                    const slotAppointments = getAppointmentsForSlot(day, hour)
                    const isDragOver = dragOverSlot?.hour === hour && isSameDay(dragOverSlot.date, day)
                    
                    return (
                      <div
                        key={dayIdx}
                        className={cn(
                          "min-h-[80px] p-1 border-l relative",
                          isDragOver && "bg-blue-100 border-blue-400 border-2"
                        )}
                        onDragOver={(e) => handleDragOver(e, day, hour)}
                        onDrop={(e) => handleDrop(e, day, hour)}
                        onClick={() => onTimeSlotClick?.(day, hour)}
                      >
                        {slotAppointments.map((appointment) => {
                          const startTime = new Date(appointment.startTime)
                          const appointmentHour = getHours(startTime)
                          const appointmentMinutes = getMinutes(startTime)
                          const isFirstSlot = appointmentHour === hour && appointmentMinutes < 30
                          
                          if (!isFirstSlot && appointmentHour === hour) return null
                          
                          return (
                            <div
                              key={appointment.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, appointment)}
                              onDragEnd={handleDragEnd}
                              onClick={(e) => {
                                e.stopPropagation()
                                onAppointmentClick?.(appointment)
                              }}
                              className={cn(
                                "mb-1 p-2 rounded text-xs cursor-move hover:shadow-md transition-all",
                                "bg-blue-100 border border-blue-300 text-blue-900",
                                "flex items-start gap-1"
                              )}
                            >
                              <GripVertical className="h-3 w-3 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold truncate">
                                  {appointment.patientName}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-blue-700">
                                  <Clock className="h-3 w-3" />
                                  {format(startTime, 'h:mm a')}
                                </div>
                                {appointment.code && (
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    {appointment.code}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <GripVertical className="h-4 w-4" />
              <span>Drag to reschedule</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded" />
              <span>Appointment</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

