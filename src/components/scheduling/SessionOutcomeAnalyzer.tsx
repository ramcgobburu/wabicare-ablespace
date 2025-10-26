"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react"
import type { PatientProgress } from "@/types/smart-scheduling"

interface SessionOutcomeAnalyzerProps {
  studentId: string
  studentName: string
  onAnalysisComplete?: (progress: PatientProgress) => void
}

export function SessionOutcomeAnalyzer({ 
  studentId, 
  studentName, 
  onAnalysisComplete 
}: SessionOutcomeAnalyzerProps) {
  const [progress, setProgress] = useState<PatientProgress | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeProgress = async () => {
    setLoading(true)
    setError(null)
    try {
      // Mock analysis for demo purposes
      const mockAnalysis: PatientProgress = {
        studentId,
        studentName,
        recentAccuracy: studentId === 'student-1' ? 95 : 72,
        trend: studentId === 'student-1' ? 'improving' : 'declining',
        consecutiveHighSessions: studentId === 'student-1' ? 3 : 0,
        overallProgress: studentId === 'student-1' ? 'excellent' : 'struggling',
        lastSessionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
      
      setProgress(mockAnalysis)
      onAnalysisComplete?.(mockAnalysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze progress')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    analyzeProgress()
  }, [studentId])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'struggling': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getProgressBadgeVariant = (progress: string) => {
    switch (progress) {
      case 'excellent': return 'default'
      case 'good': return 'secondary'
      case 'struggling': return 'destructive'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-pink-500" />
            <span className="text-muted-foreground">Analyzing session outcomes...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
            <p className="text-red-600 font-medium">Analysis Failed</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={analyzeProgress} size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!progress) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Target className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No session data available for analysis</p>
            <Button onClick={analyzeProgress} size="sm">
              Analyze Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Session Outcome Analysis</span>
          <Button variant="outline" size="sm" onClick={analyzeProgress}>
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <Badge variant={getProgressBadgeVariant(progress.overallProgress)}>
              {progress.overallProgress.toUpperCase()}
            </Badge>
          </div>
          <Progress 
            value={progress.recentAccuracy} 
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            Recent accuracy: {progress.recentAccuracy}%
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getTrendIcon(progress.trend)}
              <span className="text-sm font-medium">Trend</span>
            </div>
            <p className="text-xs text-muted-foreground capitalize">{progress.trend}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">High Sessions</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {progress.consecutiveHighSessions} consecutive 90%+ sessions
            </p>
          </div>
        </div>

        {/* Last Session */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Last Session</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {progress.lastSessionDate.toLocaleDateString()} at {progress.lastSessionDate.toLocaleTimeString()}
          </p>
        </div>

        {/* Scheduling Recommendations */}
        <div className="bg-muted/50 p-3 rounded-lg space-y-2">
          <h4 className="text-sm font-medium">Scheduling Recommendations</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            {progress.overallProgress === 'excellent' && (
              <p>• Patient performing excellently - maintain current session frequency</p>
            )}
            {progress.overallProgress === 'good' && (
              <p>• Patient showing good progress - continue with current schedule</p>
            )}
            {progress.overallProgress === 'struggling' && (
              <p>• Patient needs increased support - consider more frequent sessions</p>
            )}
            {progress.trend === 'declining' && (
              <p>• Recent decline in performance - immediate attention recommended</p>
            )}
            {progress.consecutiveHighSessions >= 3 && (
              <p>• Excellent consistency - consider reducing session frequency</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => {
            // This would trigger the smart scheduling
            console.log('Triggering smart scheduling for:', studentId)
          }}
        >
          <Target className="h-4 w-4 mr-2" />
          Generate Smart Scheduling Suggestions
        </Button>
      </CardContent>
    </Card>
  )
}
