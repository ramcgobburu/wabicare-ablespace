// AI-Powered Session Outcome Analyzer
import type { SessionOutcome, PatientProgress } from '@/types/smart-scheduling'
import { SessionService } from '@/lib/services'

export class SessionAnalyzer {
  /**
   * Analyzes recent session outcomes to determine patient progress
   */
  static async analyzePatientProgress(studentId: string): Promise<PatientProgress> {
    try {
      // Get recent sessions for the student
      const sessions = await SessionService.getByStudentId(studentId)
      
      if (sessions.length === 0) {
        return {
          studentId,
          studentName: 'Unknown Student',
          recentAccuracy: 0,
          trend: 'stable',
          consecutiveHighSessions: 0,
          overallProgress: 'struggling',
          lastSessionDate: new Date()
        }
      }

      // Get session data points for accuracy calculation
      const recentSessions = sessions.slice(0, 5) // Last 5 sessions
      const sessionOutcomes: SessionOutcome[] = []

      for (const session of recentSessions) {
        const dataPoints = await SessionService.getDataPointsBySessionId(session.id)
        
        if (dataPoints.length > 0) {
          const accuracy = this.calculateSessionAccuracy(dataPoints)
          const engagement = this.calculateEngagement(session, dataPoints)
          
          sessionOutcomes.push({
            sessionId: session.id,
            studentId: session.student_id || '',
            therapistId: session.teacher_id || '',
            accuracy,
            engagement,
            duration: 60, // Default session duration
            goalsCompleted: dataPoints.filter(dp => dp.performance_level === 'correct').length,
            totalGoals: dataPoints.length,
            notes: session.notes || '',
            timestamp: new Date(session.session_date)
          })
        }
      }

      // Calculate progress metrics
      const recentAccuracy = this.calculateAverageAccuracy(sessionOutcomes)
      const trend = this.determineTrend(sessionOutcomes)
      const consecutiveHighSessions = this.countConsecutiveHighSessions(sessionOutcomes)
      const overallProgress = this.determineOverallProgress(recentAccuracy, consecutiveHighSessions)

      return {
        studentId,
        studentName: 'Student Name', // This would come from student data
        recentAccuracy,
        trend,
        consecutiveHighSessions,
        overallProgress,
        lastSessionDate: new Date(recentSessions[0].session_date)
      }
    } catch (error) {
      console.error('Error analyzing patient progress:', error)
      throw error
    }
  }

  /**
   * Calculates session accuracy based on data points
   */
  private static calculateSessionAccuracy(dataPoints: any[]): number {
    if (dataPoints.length === 0) return 0
    
    const correctCount = dataPoints.filter(dp => dp.performance_level === 'correct').length
    return Math.round((correctCount / dataPoints.length) * 100)
  }

  /**
   * Calculates engagement score based on session data
   */
  private static calculateEngagement(session: any, dataPoints: any[]): number {
    // Simple engagement calculation based on data points and session duration
    const dataPointDensity = dataPoints.length / 60 // data points per minute
    const baseEngagement = Math.min(dataPointDensity * 20, 100) // Scale to 0-100
    
    // Adjust based on session notes (simple keyword analysis)
    const notes = session.notes?.toLowerCase() || ''
    let engagementAdjustment = 0
    
    if (notes.includes('engaged') || notes.includes('focused')) engagementAdjustment += 10
    if (notes.includes('distracted') || notes.includes('difficult')) engagementAdjustment -= 10
    if (notes.includes('excellent') || notes.includes('great')) engagementAdjustment += 15
    if (notes.includes('challenging') || notes.includes('struggled')) engagementAdjustment -= 5
    
    return Math.max(0, Math.min(100, baseEngagement + engagementAdjustment))
  }

  /**
   * Calculates average accuracy from recent sessions
   */
  private static calculateAverageAccuracy(sessionOutcomes: SessionOutcome[]): number {
    if (sessionOutcomes.length === 0) return 0
    
    const totalAccuracy = sessionOutcomes.reduce((sum, session) => sum + session.accuracy, 0)
    return Math.round(totalAccuracy / sessionOutcomes.length)
  }

  /**
   * Determines if patient progress is improving, stable, or declining
   */
  private static determineTrend(sessionOutcomes: SessionOutcome[]): 'improving' | 'stable' | 'declining' {
    if (sessionOutcomes.length < 2) return 'stable'
    
    const recent = sessionOutcomes.slice(0, 2)
    const older = sessionOutcomes.slice(2, 4)
    
    if (recent.length === 0 || older.length === 0) return 'stable'
    
    const recentAvg = this.calculateAverageAccuracy(recent)
    const olderAvg = this.calculateAverageAccuracy(older)
    
    const difference = recentAvg - olderAvg
    
    if (difference > 5) return 'improving'
    if (difference < -5) return 'declining'
    return 'stable'
  }

  /**
   * Counts consecutive sessions with 90%+ accuracy
   */
  private static countConsecutiveHighSessions(sessionOutcomes: SessionOutcome[]): number {
    let count = 0
    for (const session of sessionOutcomes) {
      if (session.accuracy >= 90) {
        count++
      } else {
        break
      }
    }
    return count
  }

  /**
   * Determines overall progress level
   */
  private static determineOverallProgress(
    recentAccuracy: number, 
    consecutiveHighSessions: number
  ): 'excellent' | 'good' | 'struggling' {
    if (recentAccuracy >= 90 && consecutiveHighSessions >= 3) return 'excellent'
    if (recentAccuracy >= 75 && consecutiveHighSessions >= 1) return 'good'
    return 'struggling'
  }

  /**
   * Analyzes session outcomes for scheduling recommendations
   */
  static async getSchedulingRecommendations(studentId: string): Promise<{
    frequency: 'increased' | 'maintained' | 'decreased'
    urgency: 'high' | 'medium' | 'low'
    rationale: string
  }> {
    const progress = await this.analyzePatientProgress(studentId)
    
    let frequency: 'increased' | 'maintained' | 'decreased' = 'maintained'
    let urgency: 'high' | 'medium' | 'low' = 'medium'
    let rationale = ''

    // Determine frequency based on progress
    if (progress.overallProgress === 'struggling' || progress.trend === 'declining') {
      frequency = 'increased'
      urgency = 'high'
      rationale = 'Patient is struggling - recommend increased session frequency'
    } else if (progress.overallProgress === 'excellent' && progress.consecutiveHighSessions >= 3) {
      frequency = 'maintained'
      urgency = 'low'
      rationale = 'Patient performing excellently - maintain current frequency'
    } else if (progress.overallProgress === 'good' && progress.trend === 'improving') {
      frequency = 'maintained'
      urgency = 'medium'
      rationale = 'Patient showing good progress - maintain current frequency'
    }

    return { frequency, urgency, rationale }
  }
}
