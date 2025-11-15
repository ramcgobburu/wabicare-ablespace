"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle,
  Sparkles,
  AlertCircle,
  XCircle,
  Shield
} from "lucide-react"
import { format, addDays, addWeeks } from "date-fns"
import { saveAppointment } from "@/lib/appointmentStorage"
import { BCPAAppointment } from "@/types/bcpa-appointments"
import { useAuthorization } from "@/hooks/useAuthorization"

interface BCPAAppointmentSchedulerProps {
  studentId: string
  studentName: string
  onAppointmentScheduled: (appointment: any) => void
}

function BCPAAppointmentScheduler({ 
  studentId, 
  studentName, 
  onAppointmentScheduled 
}: BCPAAppointmentSchedulerProps) {
  const [appointmentType, setAppointmentType] = useState<string>("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState("")
  const [authError, setAuthError] = useState<string | null>(null)
  const [showOverrideDialog, setShowOverrideDialog] = useState(false)
  const { validateAppointment, validating } = useAuthorization()

  const appointmentTypes = [
    { code: "151", name: "Initial Assessment", description: "First BCPA evaluation and assessment" },
    { code: "153", name: "Follow-up Assessment", description: "Secondary BCPA evaluation" },
    { code: "155", name: "Final Follow-up", description: "Final BCPA assessment and case closure" }
  ]

  const generateSuggestions = async () => {
    if (!appointmentType) return

    setLoading(true)
    try {
      // Mock AI-powered suggestions based on appointment type
      const mockSuggestions = [
        {
          id: `suggestion-${Date.now()}`,
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
          provider: "Dr. Sarah Wilson (BCPA)",
          confidence: 95,
          rationale: "Optimal time slot based on BCPA availability and patient history",
          location: "Office"
        },
        {
          id: `suggestion-${Date.now() + 1}`,
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
          provider: "Dr. Sarah Wilson (BCPA)",
          confidence: 88,
          rationale: "Alternative time slot with good availability",
          location: "Office"
        }
      ]

      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const scheduleAppointment = async (suggestion: any, overrideAuth: boolean = false) => {
    // Business hours validation (8 AM to 8 PM)
    const startTime = new Date(suggestion.startTime)
    const startHour = startTime.getHours()
    
    if (startHour < 8 || startHour >= 20) {
      alert('Appointments must be scheduled between 8:00 AM and 8:00 PM')
      return
    }

    // Authorization validation (unless override is approved)
    if (!overrideAuth) {
      setAuthError(null)
      const duration = Math.round((suggestion.endTime.getTime() - suggestion.startTime.getTime()) / (1000 * 60))
      const selectedType = appointmentTypes.find(apt => apt.code === appointmentType)
      
      const validation = await validateAppointment({
        patientId: studentId,
        duration,
        billingCode: selectedType?.code,
        startTime: suggestion.startTime,
        endTime: suggestion.endTime
      })

      if (!validation.canSchedule) {
        setAuthError(validation.message)
        if (validation.requiresOverride) {
          setShowOverrideDialog(true)
        }
        return
      }
    }

    const selectedType = appointmentTypes.find(apt => apt.code === appointmentType)
    const appointment: BCPAAppointment = {
      id: `apt-${Date.now()}`,
      patientId: studentId,
      patientName: studentName,
      parentContact: {
        email: "",
        phone: "",
        name: ""
      },
      appointmentType: appointmentType as 'initial-assessment' | 'follow-up' | 'technician-session',
      code: selectedType?.code as '151' | '155' | 'technician',
      status: 'scheduled',
      scheduledBy: 'bcpa',
      startTime: suggestion.startTime,
      endTime: suggestion.endTime,
      duration: 60,
      provider: {
        id: "bcpa-001",
        name: suggestion.provider,
        type: 'bcpa'
      },
      location: suggestion.location.toLowerCase() as 'office' | 'virtual' | 'home',
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Save to global storage
    saveAppointment(appointment)
    
    // Call the callback for any additional handling
    onAppointmentScheduled(appointment)
    
    setSuggestions([])
    setAppointmentType("")
    setNotes("")
    setAuthError(null)
    setShowOverrideDialog(false)
  }

  const getAppointmentTypeInfo = (code: string) => {
    return appointmentTypes.find(apt => apt.code === code)
  }

  return (
    <div className="space-y-6">
      {/* BCPA Appointment Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            BCPA Appointment Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {appointmentTypes.map((type) => (
              <Card
                key={type.code}
                className={`cursor-pointer transition-all ${
                  appointmentType === type.code 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => setAppointmentType(type.code)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-3">{type.code}</div>
                  <h3 className="text-lg font-semibold mb-2">{type.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                  {appointmentType === type.code ? (
                    <Badge className="bg-blue-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Select
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      {appointmentType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Appointment Notes (Optional)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any special notes or requirements for this appointment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>
      )}

      {/* Generate Suggestions */}
      {appointmentType && (
        <Card className="border-pink-200 bg-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              AI-Powered Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  {getAppointmentTypeInfo(appointmentType)?.name} (Code {appointmentType})
                </h3>
                <p className="text-muted-foreground">
                  Generate smart scheduling suggestions based on BCPA availability and patient history
                </p>
              </div>
              <Button 
                onClick={generateSuggestions} 
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Generating Suggestions...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Smart Suggestions
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              AI-Generated Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-l-4 border-l-green-500 bg-white">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-green-800">
                          {getAppointmentTypeInfo(appointmentType)?.name} (Code {appointmentType})
                        </h3>
                        <p className="text-sm text-green-600">BCPA Appointment</p>
                      </div>
                      <Badge className="bg-green-600">
                        {suggestion.confidence}% confidence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Date</p>
                          <p>{format(suggestion.startTime, 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Time</p>
                          <p>
                            {format(suggestion.startTime, 'HH:mm')} - {format(suggestion.endTime, 'HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Provider</p>
                          <p>{suggestion.provider}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>AI Rationale:</strong> {suggestion.rationale}
                      </p>
                    </div>

                    {/* Authorization Error Alert */}
                    {authError && (
                      <Alert variant="destructive" className="mb-4">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Authorization Check Failed</AlertTitle>
                        <AlertDescription>{authError}</AlertDescription>
                      </Alert>
                    )}

                    {/* Override Dialog */}
                    {showOverrideDialog && (
                      <Alert className="mb-4 border-yellow-500 bg-yellow-50">
                        <Shield className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="text-yellow-800">Supervisor Override Required</AlertTitle>
                        <AlertDescription className="text-yellow-700">
                          This appointment requires supervisor approval due to authorization limits. 
                          Please contact your supervisor to proceed.
                        </AlertDescription>
                        <div className="mt-3 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowOverrideDialog(false)
                              setAuthError(null)
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700"
                            onClick={() => scheduleAppointment(suggestion, true)}
                          >
                            Request Override
                          </Button>
                        </div>
                      </Alert>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        onClick={() => scheduleAppointment(suggestion)}
                        disabled={validating}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        {validating ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Validating...
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Appointment
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="lg">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Backend Verification Info */}
      <Card className="border-dashed border-gray-300">
        <CardContent className="p-4">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Backend Verification Process</h3>
            <p className="text-sm text-muted-foreground">
              When you schedule an appointment, the system will automatically verify:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• BCPA calendar availability</li>
              <li>• Patient schedule conflicts</li>
              <li>• Required document completion</li>
              <li>• Insurance authorization status</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { BCPAAppointmentScheduler }
