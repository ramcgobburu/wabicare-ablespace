"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { PageLayout } from "@/components/PageLayout"
import { SchedulingDashboardHeader } from "@/components/scheduling/SchedulingDashboardHeader"
import { SchedulingWorkspace } from "@/components/scheduling/SchedulingWorkspace"
import { SmartSchedulingDemo } from "@/components/scheduling/SmartSchedulingDemo"
import type { ViewMode } from "@/components/ui/view-mode-toggle"

function SchedulingPageContent() {
  const searchParams = useSearchParams()
  const studentId = searchParams.get('student')
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [showDemo, setShowDemo] = useState(false)

  return (
    <PageLayout breadcrumbs={[{ label: "Scheduling", href: "/scheduling" }]}>
      <div className="space-y-6">
        <SchedulingDashboardHeader viewMode={viewMode} onViewModeChange={setViewMode} />
        
        {showDemo ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Smart Scheduling Demo</h2>
              <button 
                onClick={() => setShowDemo(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Back to Scheduling
              </button>
            </div>
            <SmartSchedulingDemo />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Scheduling Management</h2>
                <p className="text-muted-foreground">Manage appointments and view AI-powered suggestions</p>
              </div>
              <button 
                onClick={() => setShowDemo(true)}
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                Try Smart Scheduling Demo →
              </button>
            </div>
            <SchedulingWorkspace variant="full" viewMode={viewMode} selectedStudentId={studentId} />
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default function SchedulingPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SchedulingPageContent />
    </Suspense>
  )
}

