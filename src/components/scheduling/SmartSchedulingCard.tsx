"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Clock, 
  User, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Sparkles,
  Loader2,
  ExternalLink
} from "lucide-react"
import type { SmartSchedulingSuggestion } from "@/types/smart-scheduling"

interface SmartSchedulingCardProps {
  studentId: string
  studentName: string
  onScheduled?: (suggestion: SmartSchedulingSuggestion) => void
}

export function SmartSchedulingCard({ studentId, studentName, onScheduled }: SmartSchedulingCardProps) {
  const [suggestions, setSuggestions] = useState<SmartSchedulingSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [scheduling, setScheduling] = useState<string | null>(null)
  const [scheduled, setScheduled] = useState<string | null>(null)

  const generateSuggestions = async () => {
    setLoading(true)
    try {
      // Mock suggestions for demo purposes
      const mockSuggestions: SmartSchedulingSuggestion[] = [
        {
          id: `suggestion-${studentId}-1`,
          studentId,
          studentName,
          therapistId: 'therapist-1',
          therapistName: 'Rachel Smith',
          suggestedTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
          suggestedEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
          confidence: 85,
          rationale: 'Patient performing excellently (95% accuracy) • 8 authorization hours remaining • High success rate with Rachel Smith (95%) • Optimal 3-day spacing between sessions',
          priority: 'medium',
          factors: {
            patientProgress: {
              studentId,
              studentName,
              recentAccuracy: 95,
              trend: 'improving',
              consecutiveHighSessions: 3,
              overallProgress: 'excellent',
              lastSessionDate: new Date()
            },
            authorizationStatus: {
              studentId,
              totalHours: 40,
              usedHours: 32,
              remainingHours: 8,
              expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              urgencyLevel: 'medium'
            },
            therapistAvailability: {
              therapistId: 'therapist-1',
              therapistName: 'Rachel Smith',
              availableSlots: [],
              preferredTimes: ['morning', 'afternoon'],
              maxSessionsPerDay: 8,
              workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
            },
            successRate: {
              therapistId: 'therapist-1',
              studentId,
              successRate: 95,
              totalSessions: 10,
              averageAccuracy: 95,
              lastSessionDate: new Date()
            },
            optimalSpacing: 3
          },
          alternatives: []
        }
      ]
      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const scheduleAppointment = async (suggestion: SmartSchedulingSuggestion) => {
    setScheduling(suggestion.id)
    try {
      // Mock appointment creation for demo
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
      
      setScheduled(suggestion.id)
      onScheduled?.(suggestion)
      
      // Remove from suggestions after successful scheduling
      setTimeout(() => {
        setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
        setScheduled(null)
      }, 3000)
    } catch (error) {
      console.error('Error scheduling appointment:', error)
    } finally {
      setScheduling(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-pink-500" />
          Smart Scheduling for {studentName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.length === 0 && !loading && (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Generate AI-powered scheduling suggestions based on session outcomes and therapist availability.
            </p>
            <Button onClick={generateSuggestions} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Smart Suggestions
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Analyzing session data and generating suggestions...</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">AI-Generated Suggestions</h3>
              <Button variant="outline" size="sm" onClick={generateSuggestions}>
                <Sparkles className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>

            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border-l-4 border-l-pink-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header with priority and confidence */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          {suggestion.therapistName}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                          {suggestion.confidence}% confidence
                        </span>
                        <Progress value={suggestion.confidence} className="w-16 h-2" />
                      </div>
                    </div>

                    {/* Time and date */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{suggestion.suggestedTime.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {suggestion.suggestedTime.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {suggestion.suggestedEndTime.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Rationale */}
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{suggestion.rationale}</p>
                    </div>

                    {/* Factors breakdown */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span className="font-medium">Progress:</span>
                          <Badge variant="outline" className="text-xs">
                            {suggestion.factors.patientProgress.overallProgress}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="font-medium">Success Rate:</span>
                          <span>{suggestion.factors.successRate.successRate}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span className="font-medium">Authorization:</span>
                          <span>{suggestion.factors.authorizationStatus.remainingHours}h left</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">Spacing:</span>
                          <span>{suggestion.factors.optimalSpacing} days</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      {scheduled === suggestion.id ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Scheduled Successfully!</span>
                        </div>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            onClick={() => scheduleAppointment(suggestion)}
                            disabled={scheduling === suggestion.id}
                            className="flex-1"
                          >
                            {scheduling === suggestion.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Scheduling...
                              </>
                            ) : (
                              <>
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Appointment
                              </>
                            )}
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
