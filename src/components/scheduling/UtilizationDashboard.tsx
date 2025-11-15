"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Calendar
} from "lucide-react"
import { useAuthorization } from "@/hooks/useAuthorization"
import { format } from "date-fns"

interface UtilizationDashboardProps {
  patientId: string
  patientName?: string
}

export function UtilizationDashboard({ patientId, patientName }: UtilizationDashboardProps) {
  const { getUtilizationSummary } = useAuthorization()
  const [utilization, setUtilization] = useState<{
    authorizedHours: number
    scheduledHours: number
    usedHours: number
    remainingHours: number
    utilizationPercent: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUtilization = async () => {
      setLoading(true)
      try {
        const summary = await getUtilizationSummary(patientId)
        setUtilization(summary)
      } catch (error) {
        console.error('Error loading utilization:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUtilization()
  }, [patientId, getUtilizationSummary])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading utilization data...</div>
        </CardContent>
      </Card>
    )
  }

  if (!utilization) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No authorization data found for this patient.
          </div>
        </CardContent>
      </Card>
    )
  }

  const { authorizedHours, scheduledHours, usedHours, remainingHours, utilizationPercent } = utilization
  const totalConsumed = usedHours + scheduledHours
  const isLow = remainingHours < authorizedHours * 0.2 // Less than 20% remaining
  const isCritical = remainingHours <= 0

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Authorization Utilization
            {patientName && (
              <span className="text-sm font-normal text-muted-foreground">
                - {patientName}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Utilization</span>
              <Badge variant={isCritical ? "destructive" : isLow ? "default" : "secondary"}>
                {utilizationPercent.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={utilizationPercent} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Authorized</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {authorizedHours.toFixed(1)}
                </div>
                <div className="text-xs text-blue-600 mt-1">Total Hours</div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Used</span>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {usedHours.toFixed(1)}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {authorizedHours > 0 ? ((usedHours / authorizedHours) * 100).toFixed(1) : 0}% of total
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-700">Scheduled</span>
                </div>
                <div className="text-2xl font-bold text-yellow-900">
                  {scheduledHours.toFixed(1)}
                </div>
                <div className="text-xs text-yellow-600 mt-1">
                  {authorizedHours > 0 ? ((scheduledHours / authorizedHours) * 100).toFixed(1) : 0}% of total
                </div>
              </CardContent>
            </Card>

            <Card className={`border-${isCritical ? 'red' : isLow ? 'orange' : 'purple'}-200 bg-${isCritical ? 'red' : isLow ? 'orange' : 'purple'}-50`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`h-4 w-4 text-${isCritical ? 'red' : isLow ? 'orange' : 'purple'}-600`} />
                  <span className={`text-xs font-medium text-${isCritical ? 'red' : isLow ? 'orange' : 'purple'}-700`}>
                    Remaining
                  </span>
                </div>
                <div className={`text-2xl font-bold text-${isCritical ? 'red' : isLow ? 'orange' : 'purple'}-900`}>
                  {remainingHours.toFixed(1)}
                </div>
                <div className={`text-xs text-${isCritical ? 'red' : isLow ? 'orange' : 'purple'}-600 mt-1`}>
                  {authorizedHours > 0 ? ((remainingHours / authorizedHours) * 100).toFixed(1) : 0}% of total
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          {isCritical && (
            <Card className="border-red-500 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-semibold text-red-900">Authorization Exhausted</div>
                    <div className="text-sm text-red-700">
                      No remaining hours available. Please renew authorization before scheduling new appointments.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isLow && !isCritical && (
            <Card className="border-orange-500 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-semibold text-orange-900">Low Authorization Balance</div>
                    <div className="text-sm text-orange-700">
                      Only {remainingHours.toFixed(1)} hours remaining. Consider renewing authorization soon.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Breakdown Chart */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Hour Breakdown</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="text-sm">Used Hours</span>
                <span className="font-semibold">{usedHours.toFixed(1)}h</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                <span className="text-sm">Scheduled Hours</span>
                <span className="font-semibold">{scheduledHours.toFixed(1)}h</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                <span className="text-sm">Remaining Hours</span>
                <span className="font-semibold">{remainingHours.toFixed(1)}h</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded border-t-2 border-gray-300">
                <span className="text-sm font-semibold">Total Authorized</span>
                <span className="font-bold">{authorizedHours.toFixed(1)}h</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

