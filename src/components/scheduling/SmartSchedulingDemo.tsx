"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  User, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Brain,
  Target
} from "lucide-react"
import { SmartSchedulingCard } from "./SmartSchedulingCard"
import { SessionOutcomeAnalyzer } from "./SessionOutcomeAnalyzer"

export function SmartSchedulingDemo() {
  const [activeDemo, setActiveDemo] = useState<'overview' | 'scheduling' | 'analysis'>('overview')

  const demoScenarios = [
    {
      id: 'scenario-1',
      title: 'Sarah Johnson - Excellent Progress',
      description: '95% accuracy, 3 consecutive high sessions',
      studentId: 'student-1',
      studentName: 'Sarah Johnson',
      status: 'excellent',
      accuracy: 95,
      sessions: 3,
      authorization: { used: 32, total: 40, remaining: 8 }
    },
    {
      id: 'scenario-2', 
      title: 'Alex Chen - Struggling Patient',
      description: '72% accuracy, declining trend',
      studentId: 'student-2',
      studentName: 'Alex Chen',
      status: 'struggling',
      accuracy: 72,
      sessions: 0,
      authorization: { used: 28, total: 30, remaining: 2 }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600'
      case 'struggling': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'excellent': return 'default'
      case 'struggling': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-pink-500" />
          Smart Scheduling Demo
        </h2>
        <p className="text-muted-foreground">
          AI-powered scheduling that analyzes session outcomes, therapist availability, and authorization status
        </p>
      </div>

      {/* Demo Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={activeDemo === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveDemo('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeDemo === 'scheduling' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveDemo('scheduling')}
          >
            Smart Scheduling
          </Button>
          <Button
            variant={activeDemo === 'analysis' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveDemo('analysis')}
          >
            Session Analysis
          </Button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeDemo === 'overview' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600">1</div>
                    <div>
                      <p className="font-medium">Analyze Session Outcomes</p>
                      <p className="text-sm text-muted-foreground">AI analyzes accuracy, engagement, and progress trends</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600">2</div>
                    <div>
                      <p className="font-medium">Check Therapist Availability</p>
                      <p className="text-sm text-muted-foreground">Integrates with Outlook calendar for real-time availability</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600">3</div>
                    <div>
                      <p className="font-medium">Generate Smart Suggestions</p>
                      <p className="text-sm text-muted-foreground">AI suggests optimal times based on multiple factors</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600">4</div>
                    <div>
                      <p className="font-medium">One-Click Scheduling</p>
                      <p className="text-sm text-muted-foreground">Create Outlook appointments and notify parents instantly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Session outcome analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Therapist availability checking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Authorization status tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Optimal spacing calculation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Outlook calendar integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Parent notification system</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {demoScenarios.map((scenario) => (
                  <Card key={scenario.id} className="border-l-4 border-l-pink-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{scenario.title}</h4>
                          <Badge variant={getStatusBadgeVariant(scenario.status)}>
                            {scenario.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{scenario.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Accuracy:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={scenario.accuracy} className="w-16 h-2" />
                              <span className={getStatusColor(scenario.status)}>{scenario.accuracy}%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>High Sessions:</span>
                            <span>{scenario.sessions} consecutive 90%+</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Authorization:</span>
                            <span>{scenario.authorization.remaining} of {scenario.authorization.total} hours left</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setActiveDemo('scheduling')}
                            className="flex-1"
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Test Scheduling
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setActiveDemo('analysis')}
                            className="flex-1"
                          >
                            <Brain className="h-4 w-4 mr-1" />
                            View Analysis
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Smart Scheduling Tab */}
      {activeDemo === 'scheduling' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">AI-Powered Smart Scheduling</h3>
            <p className="text-muted-foreground">Select a scenario to test the smart scheduling system</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {demoScenarios.map((scenario) => (
              <div key={scenario.id} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{scenario.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SmartSchedulingCard 
                      studentId={scenario.studentId}
                      studentName={scenario.studentName}
                      onScheduled={(suggestion) => {
                        console.log('Appointment scheduled:', suggestion)
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session Analysis Tab */}
      {activeDemo === 'analysis' && (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Session Outcome Analysis</h3>
            <p className="text-muted-foreground">Analyze session outcomes and get scheduling recommendations</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {demoScenarios.map((scenario) => (
              <div key={scenario.id} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{scenario.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SessionOutcomeAnalyzer 
                      studentId={scenario.studentId}
                      studentName={scenario.studentName}
                      onAnalysisComplete={(progress) => {
                        console.log('Analysis complete:', progress)
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
