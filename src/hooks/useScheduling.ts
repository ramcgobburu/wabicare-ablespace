import { useState, useCallback, useEffect } from "react"
import { useStudents } from "./useSupabase"
import { useAuth } from "@/contexts/AuthContext"

import { mockCalendarSessions } from "@/data/mockCalendarSessions"
import { mockBCPAAppointments, getBCPAAppointmentsForProvider } from "@/data/mockBCPAAppointments"
import { getAppointmentsForProvider, initializeAppointments } from "@/lib/appointmentStorage"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey)

export type SchedulingSuggestion = {
  id: string
  student: string
  therapist: string
  suggested_time: string
  rationale: string
}

export function useSchedulingSuggestions() {
  const [suggestions, setSuggestions] = useState<SchedulingSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const { students } = useStudents()

  const computeMetrics = (suggestionsData: SchedulingSuggestion[]) => {
    const totalSuggestions = suggestionsData.length
    const upcomingWithinWeek = suggestionsData.filter((suggestion) => {
      const date = new Date(suggestion.suggested_time)
      const diff = date.getTime() - Date.now()
      return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000
    })

    const nextSuggestion = suggestionsData
      .map((suggestion) => new Date(suggestion.suggested_time).getTime())
      .filter((time) => time >= Date.now())
      .sort((a, b) => a - b)[0]

    const upcomingNext = nextSuggestion ? new Date(nextSuggestion).toISOString() : null

    const utilization = totalSuggestions === 0
      ? 0
      : Math.min(100, Math.round((upcomingWithinWeek.length / totalSuggestions) * 100))

    const requestsPending = Math.max(0, Math.round(totalSuggestions * 0.35))

    return {
      totalSuggestions,
      upcomingWithinWeek: upcomingWithinWeek.length,
      upcomingNext,
      utilization,
      requestsPending,
    }
  }

  const [metrics, setMetrics] = useState(() => computeMetrics([]))

  const fetchSuggestions = useCallback(async () => {
    setLoading(true)
    
    console.log('Scheduling: Students data:', students)
    console.log('Scheduling: Students count:', students.length)
    
    // If no students, create some sample data for demonstration
    if (!hasSupabaseConfig || students.length === 0) {
      console.log('Scheduling: No students found, creating sample data')
      const sampleStudents = [
        { id: '1', name: 'Alex Johnson' },
        { id: '2', name: 'Sarah Williams' },
        { id: '3', name: 'Michael Chen' },
        { id: '4', name: 'Emma Davis' },
        { id: '5', name: 'James Wilson' }
      ]
      
      const sampleSuggestions: SchedulingSuggestion[] = sampleStudents.map((student, index) => {
        const suggestedTime = new Date()
        suggestedTime.setDate(suggestedTime.getDate() + (index + 1))
        suggestedTime.setHours(14 + (index % 3), 0, 0, 0) // 2 PM, 3 PM, 4 PM
        
        return {
          id: `suggestion-${student.id}-${index}`,
          student: student.name,
          therapist: "Rachel Smith",
          suggested_time: suggestedTime.toISOString(),
          rationale: "Based on last session performance"
        }
      })
      
      setSuggestions(sampleSuggestions)
      setMetrics(computeMetrics(sampleSuggestions))
      setLoading(false)
      return
    }
    
    // Create realistic scheduling suggestions based on actual students
    const mockSuggestions: SchedulingSuggestion[] = students.slice(0, 5).map((student, index) => {
      const suggestedTime = new Date()
      suggestedTime.setDate(suggestedTime.getDate() + (index + 1))
      suggestedTime.setHours(14 + (index % 3), 0, 0, 0) // 2 PM, 3 PM, 4 PM
      
      return {
        id: `suggestion-${student.id}-${index}`,
        student: student.name,
        therapist: "Rachel Smith",
        suggested_time: suggestedTime.toISOString(),
        rationale: "Based on last session performance"
      }
    })
    
    setSuggestions(mockSuggestions)
    setMetrics(computeMetrics(mockSuggestions))
    setLoading(false)
  }, [students])

  useEffect(() => {
    if (students.length >= 0) { // Allow empty array to trigger sample data
      fetchSuggestions()
    }
  }, [fetchSuggestions, students])

  const schedulingOverview = metrics

  return { suggestions, loading, refresh: fetchSuggestions, schedulingOverview }
}

export type SchedulingCalendarEntry = {
  id: string
  student: string
  therapist: string
  start: string
  end: string
  status: "suggested" | "confirmed" | "pending" | "scheduled" | "completed" | "cancelled"
  appointmentType?: "initial-assessment" | "follow-up" | "technician-session"
  code?: "151" | "155" | "technician"
  location?: "office" | "virtual" | "home"
}

export function useSchedulingCalendar() {
  const [entries, setEntries] = useState<SchedulingCalendarEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { students } = useStudents()
  const { user } = useAuth()

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    
    console.log('Calendar: Students data:', students)
    console.log('Calendar: Students count:', students.length)
    console.log('Calendar: User data:', user)
    
    // If no user is logged in, return empty calendar
    if (!user) {
      console.log('Calendar: No user logged in, returning empty calendar')
      setEntries([])
      setLoading(false)
      return
    }
    
    // Initialize appointments if none exist
    initializeAppointments()
    
    // Get BCPA appointments for the logged-in user from global storage
    // For now, we'll use a mock BCPA ID, but in a real app this would come from the user's profile
    const bcpaId = "bcpa-001" // This should come from user profile in real implementation
    const bcpaAppointments = getAppointmentsForProvider(bcpaId)
    
    // Convert BCPA appointments to calendar entries
    const calendarEntries: SchedulingCalendarEntry[] = bcpaAppointments.map(appointment => ({
      id: appointment.id,
      student: appointment.patientName,
      therapist: appointment.provider.name,
      start: appointment.startTime.toISOString(),
      end: appointment.endTime.toISOString(),
      status: appointment.status as "scheduled" | "completed" | "cancelled",
      appointmentType: appointment.appointmentType,
      code: appointment.code,
      location: appointment.location
    }))
    
    setEntries(calendarEntries)
    setLoading(false)
  }, [students, user])

  useEffect(() => {
    if (user !== undefined) { // Wait for auth to be determined
      fetchEntries()
    }
  }, [fetchEntries, user])

  // Listen for storage changes to refresh calendar when new appointments are added
  useEffect(() => {
    const handleStorageChange = () => {
      fetchEntries()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events (for same-tab updates)
    window.addEventListener('appointmentCreated', handleStorageChange)
    window.addEventListener('appointmentUpdated', handleStorageChange)
    window.addEventListener('appointmentDeleted', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('appointmentCreated', handleStorageChange)
      window.removeEventListener('appointmentUpdated', handleStorageChange)
      window.removeEventListener('appointmentDeleted', handleStorageChange)
    }
  }, [fetchEntries])

  return { entries, loading, refresh: fetchEntries }
}
