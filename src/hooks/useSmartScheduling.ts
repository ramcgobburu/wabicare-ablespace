import { useState, useCallback } from 'react'
import { AIScheduler } from '@/lib/smart-scheduling/ai-scheduler'
import { OutlookIntegration } from '@/lib/smart-scheduling/outlook-integration'
import type { SmartSchedulingSuggestion, PatientProgress } from '@/types/smart-scheduling'

export function useSmartScheduling() {
  const [suggestions, setSuggestions] = useState<SmartSchedulingSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSuggestions = useCallback(async (studentId: string) => {
    setLoading(true)
    setError(null)
    try {
      const newSuggestions = await AIScheduler.generateSchedulingSuggestions(studentId)
      setSuggestions(newSuggestions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate suggestions')
    } finally {
      setLoading(false)
    }
  }, [])

  const scheduleAppointment = useCallback(async (suggestion: SmartSchedulingSuggestion) => {
    try {
      // Create Outlook appointment
      const appointmentResult = await OutlookIntegration.createAppointment(suggestion)
      
      if (appointmentResult.success) {
        // Send parent notification
        await OutlookIntegration.sendParentNotification(suggestion, appointmentResult.appointmentId!)
        
        // Remove from suggestions after successful scheduling
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
        
        return { success: true, appointmentId: appointmentResult.appointmentId }
      } else {
        throw new Error(appointmentResult.error || 'Failed to create appointment')
      }
    } catch (err) {
      console.error('Error scheduling appointment:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to schedule appointment' 
      }
    }
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    setError(null)
  }, [])

  return {
    suggestions,
    loading,
    error,
    generateSuggestions,
    scheduleAppointment,
    clearSuggestions
  }
}

export function useSessionAnalysis() {
  const [progress, setProgress] = useState<PatientProgress | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeProgress = useCallback(async (studentId: string) => {
    setLoading(true)
    setError(null)
    try {
      const { SessionAnalyzer } = await import('@/lib/smart-scheduling/session-analyzer')
      const analysis = await SessionAnalyzer.analyzePatientProgress(studentId)
      setProgress(analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze progress')
    } finally {
      setLoading(false)
    }
  }, [])

  const clearAnalysis = useCallback(() => {
    setProgress(null)
    setError(null)
  }, [])

  return {
    progress,
    loading,
    error,
    analyzeProgress,
    clearAnalysis
  }
}
