"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { PageLayout } from "@/components/PageLayout"
import { SchedulingDashboardHeader } from "@/components/scheduling/SchedulingDashboardHeader"
import { SchedulingWorkspace } from "@/components/scheduling/SchedulingWorkspace"
import { SmartSchedulingDemo } from "@/components/scheduling/SmartSchedulingDemo"
import { DragDropCalendar } from "@/components/scheduling/DragDropCalendar"
import { UtilizationDashboard } from "@/components/scheduling/UtilizationDashboard"
import { RecurringAppointmentForm } from "@/components/scheduling/RecurringAppointmentForm"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, BarChart3, Repeat, Plus } from "lucide-react"
import { getAllAppointments } from "@/lib/appointmentStorage"
import { BCBAAppointment } from "@/types/bcpa-appointments"
import type { ViewMode } from "@/components/ui/view-mode-toggle"

function SchedulingPageContent() {
  const searchParams = useSearchParams()
  const studentId = searchParams.get('student')
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [showDemo, setShowDemo] = useState(false)
  const [activeTab, setActiveTab] = useState("calendar")
  const [showRecurringForm, setShowRecurringForm] = useState(false)
  const [appointments, setAppointments] = useState<BCBAAppointment[]>([])

  // Load appointments
  useEffect(() => {
    const loadAppointments = () => {
      const allAppts = getAllAppointments()
      setAppointments(allAppts as BCBAAppointment[])
    }
    loadAppointments()
    
    // Listen for appointment updates
    const handleAppointmentUpdate = () => {
      loadAppointments()
    }
    window.addEventListener('appointmentCreated', handleAppointmentUpdate)
    window.addEventListener('appointmentUpdated', handleAppointmentUpdate)
    window.addEventListener('appointmentDeleted', handleAppointmentUpdate)
    
    return () => {
      window.removeEventListener('appointmentCreated', handleAppointmentUpdate)
      window.removeEventListener('appointmentUpdated', handleAppointmentUpdate)
      window.removeEventListener('appointmentDeleted', handleAppointmentUpdate)
    }
  }, [])

  const handleAppointmentMove = (appointmentId: string, newStartTime: Date, newEndTime: Date) => {
    // Update appointment in storage
    const updated = appointments.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, startTime: newStartTime, endTime: newEndTime, updatedAt: new Date() }
        : apt
    )
    setAppointments(updated)
    // TODO: Save to database
    console.log('Appointment moved:', { appointmentId, newStartTime, newEndTime })
  }

  return (
    <PageLayout breadcrumbs={[{ label: "Scheduling", href: "/scheduling" }]}>
      <div className="space-y-6">
        <SchedulingDashboardHeader viewMode={viewMode} onViewModeChange={setViewMode} />
        
        {showDemo ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Smart Scheduling Demo</h2>
              <button 
                onClick={() => setShowDemo(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Scheduling
              </button>
            </div>
            <SmartSchedulingDemo />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Scheduling Management</h2>
                <p className="text-muted-foreground">Manage appointments with drag-and-drop, recurring series, and authorization tracking</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowRecurringForm(!showRecurringForm)}
                >
                  <Repeat className="h-4 w-4 mr-2" />
                  {showRecurringForm ? 'Cancel' : 'Create Recurring'}
                </Button>
                <button 
                  onClick={() => setShowDemo(true)}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  Try Smart Scheduling Demo →
                </button>
              </div>
            </div>

            {/* Recurring Appointment Form */}
            {showRecurringForm && studentId && (
              <RecurringAppointmentForm
                patientId={studentId}
                patientName="Selected Patient"
                onSeriesCreated={(series) => {
                  console.log('Recurring series created:', series)
                  setShowRecurringForm(false)
                  // Refresh appointments
                  setAppointments(getAllAppointments() as BCBAAppointment[])
                }}
                onCancel={() => setShowRecurringForm(false)}
              />
            )}

            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  Drag & Drop Calendar
                </TabsTrigger>
                <TabsTrigger value="workspace">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule New
                </TabsTrigger>
                <TabsTrigger value="utilization">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Utilization
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Drag & Drop Calendar View</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Drag appointments to reschedule. Click time slots to create new appointments.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <DragDropCalendar
                      appointments={appointments}
                      onAppointmentMove={handleAppointmentMove}
                      onAppointmentClick={(apt) => {
                        console.log('Appointment clicked:', apt)
                        // TODO: Open appointment details modal
                      }}
                      onTimeSlotClick={(date, hour) => {
                        console.log('Time slot clicked:', date, hour)
                        // TODO: Open new appointment form
                        setActiveTab('workspace')
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="workspace" className="space-y-4">
                <SchedulingWorkspace variant="full" viewMode={viewMode} selectedStudentId={studentId} />
              </TabsContent>

              <TabsContent value="utilization" className="space-y-4">
                {studentId ? (
                  <UtilizationDashboard patientId={studentId} />
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Please select a patient to view utilization dashboard
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default function SchedulingPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchedulingPageContent />
    </Suspense>
  )
}

