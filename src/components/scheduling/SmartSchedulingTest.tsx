"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SmartSchedulingCard } from "./SmartSchedulingCard"
import { SessionOutcomeAnalyzer } from "./SessionOutcomeAnalyzer"

export function SmartSchedulingTest() {
  const [testStudent, setTestStudent] = useState<{ id: string; name: string } | null>(null)

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Scheduling Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Test the smart scheduling components with mock data. This verifies that all components are working correctly.
            </p>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setTestStudent({ id: 'student-1', name: 'Sarah Johnson' })}
                variant={testStudent?.id === 'student-1' ? 'default' : 'outline'}
              >
                Test Sarah Johnson (Excellent Progress)
              </Button>
              <Button 
                onClick={() => setTestStudent({ id: 'student-2', name: 'Alex Chen' })}
                variant={testStudent?.id === 'student-2' ? 'default' : 'outline'}
              >
                Test Alex Chen (Struggling)
              </Button>
              <Button 
                onClick={() => setTestStudent(null)}
                variant="ghost"
              >
                Clear
              </Button>
            </div>

            {testStudent && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Session Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SessionOutcomeAnalyzer 
                        studentId={testStudent.id}
                        studentName={testStudent.name}
                        onAnalysisComplete={(progress) => {
                          console.log('Analysis complete:', progress)
                        }}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Smart Scheduling</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SmartSchedulingCard 
                        studentId={testStudent.id}
                        studentName={testStudent.name}
                        onScheduled={(suggestion) => {
                          console.log('Appointment scheduled:', suggestion)
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
