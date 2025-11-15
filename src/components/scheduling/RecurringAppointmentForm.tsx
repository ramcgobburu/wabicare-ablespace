"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Repeat, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { RecurringAppointmentsService, type RecurringAppointmentSeries, type RecurrenceRule } from "@/lib/scheduling/recurring-appointments"

interface RecurringAppointmentFormProps {
  patientId: string
  patientName: string
  defaultDuration?: number
  defaultProvider?: { id: string; name: string; type: 'bcba' | 'technician' }
  defaultLocation?: 'office' | 'virtual' | 'home'
  onSeriesCreated?: (series: RecurringAppointmentSeries) => void
  onCancel?: () => void
}

export function RecurringAppointmentForm({
  patientId,
  patientName,
  defaultDuration = 60,
  defaultProvider,
  defaultLocation = 'office',
  onSeriesCreated,
  onCancel
}: RecurringAppointmentFormProps) {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly')
  const [interval, setInterval] = useState(1)
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [occurrenceCount, setOccurrenceCount] = useState<number | undefined>(undefined)
  const [endType, setEndType] = useState<'never' | 'date' | 'count'>('never')
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [duration, setDuration] = useState(defaultDuration)
  const [provider, setProvider] = useState(defaultProvider)
  const [location, setLocation] = useState<'office' | 'virtual' | 'home'>(defaultLocation)
  const [notes, setNotes] = useState("")
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ]

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    )
  }

  const handleCreate = async () => {
    setError(null)

    // Validation
    if (!provider) {
      setError('Provider is required')
      return
    }

    if (!startDate) {
      setError('Start date is required')
      return
    }

    if (frequency === 'weekly' && selectedDays.length === 0) {
      setError('Please select at least one day of the week')
      return
    }

    // Build recurrence rule
    const recurrenceRule: RecurrenceRule = {
      frequency,
      interval,
      startDate,
      ...(frequency === 'weekly' && selectedDays.length > 0 && { daysOfWeek: selectedDays }),
      ...(endType === 'date' && endDate && { endDate }),
      ...(endType === 'count' && occurrenceCount && { occurrenceCount })
    }

    // Validate rule
    const validation = RecurringAppointmentsService.validateRecurrenceRule(recurrenceRule)
    if (!validation.valid) {
      setError(validation.error || 'Invalid recurrence rule')
      return
    }

    setCreating(true)
    try {
      const series = await RecurringAppointmentsService.createRecurringSeries({
        patientId,
        appointmentType: 'treatment',
        billingCode: undefined,
        duration: duration || 60,
        provider,
        location,
        recurrenceRule,
        notes: notes || undefined
      })

      // Generate preview of appointments
      const appointments = RecurringAppointmentsService.generateAppointments(series, 10)
      
      onSeriesCreated?.(series)
    } catch (err) {
      console.error('Error creating recurring series:', err)
      setError('Failed to create recurring appointment series')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Repeat className="h-5 w-5" />
          Create Recurring Appointment Series
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Patient Info */}
        <div>
          <Label>Patient</Label>
          <div className="mt-1 text-sm font-medium">{patientName}</div>
        </div>

        {/* Frequency */}
        <div className="space-y-2">
          <Label>Recurrence Frequency</Label>
          <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly (Every 2 weeks)</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interval */}
        {frequency !== 'biweekly' && (
          <div className="space-y-2">
            <Label>Repeat Every</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">
                {frequency === 'daily' ? 'day(s)' : frequency === 'weekly' ? 'week(s)' : 'month(s)'}
              </span>
            </div>
          </div>
        )}

        {/* Days of Week (for weekly) */}
        {frequency === 'weekly' && (
          <div className="space-y-2">
            <Label>Days of Week</Label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => toggleDay(day.value)}
                  />
                  <Label
                    htmlFor={`day-${day.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start Date */}
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Condition */}
        <div className="space-y-2">
          <Label>Ends</Label>
          <Select value={endType} onValueChange={(v) => setEndType(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="date">On Date</SelectItem>
              <SelectItem value="count">After Occurrences</SelectItem>
            </SelectContent>
          </Select>

          {endType === 'date' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => setEndDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}

          {endType === 'count' && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={occurrenceCount || ''}
                onChange={(e) => setOccurrenceCount(parseInt(e.target.value) || undefined)}
                className="w-32"
                placeholder="Number"
              />
              <span className="text-sm text-muted-foreground">occurrences</span>
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            min="15"
            step="15"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
          />
        </div>

        {/* Provider */}
        {!defaultProvider && (
          <div className="space-y-2">
            <Label>Provider</Label>
            <Input
              placeholder="Provider name"
              value={provider?.name || ''}
              onChange={(e) => setProvider({ id: 'temp', name: e.target.value, type: 'bcba' })}
            />
          </div>
        )}

        {/* Location */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Select value={location} onValueChange={(v) => setLocation(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="virtual">Virtual/Telehealth</SelectItem>
              <SelectItem value="home">Patient's Home</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes (Optional)</Label>
          <textarea
            className="w-full min-h-[80px] px-3 py-2 text-sm border rounded-md"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes for this recurring series..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleCreate}
            disabled={creating}
            className="flex-1"
          >
            {creating ? 'Creating...' : 'Create Recurring Series'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

