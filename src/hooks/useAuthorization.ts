// React hook for authorization validation
import { useState, useCallback } from 'react'
import { AuthorizationService, type AuthorizationValidationResult, type AppointmentRequest } from '@/lib/scheduling/authorization-service'

export function useAuthorization() {
  const [validating, setValidating] = useState(false)
  const [lastValidation, setLastValidation] = useState<AuthorizationValidationResult | null>(null)

  const validateAppointment = useCallback(async (request: AppointmentRequest): Promise<AuthorizationValidationResult> => {
    setValidating(true)
    try {
      const result = await AuthorizationService.validateAuthorization(request)
      setLastValidation(result)
      return result
    } catch (error) {
      console.error('Authorization validation error:', error)
      const errorResult: AuthorizationValidationResult = {
        isValid: false,
        canSchedule: false,
        remainingHours: 0,
        requestedHours: request.duration / 60,
        message: 'Error validating authorization. Please try again.',
        requiresOverride: true
      }
      setLastValidation(errorResult)
      return errorResult
    } finally {
      setValidating(false)
    }
  }, [])

  const getUtilizationSummary = useCallback(async (patientId: string) => {
    return await AuthorizationService.getUtilizationSummary(patientId)
  }, [])

  return {
    validateAppointment,
    getUtilizationSummary,
    validating,
    lastValidation
  }
}

