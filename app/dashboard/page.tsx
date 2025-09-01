"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Eye, Clock, Smartphone, Monitor, Globe, TrendingUp, Activity, Calendar, MapPin } from "lucide-react"
import { API_URL } from "../variables"

interface PageView {
    path: string
    timestamp: number
    sequence: number
    timeSpent?: number
}

interface DeviceInfo {
    userAgent: string
    language: string
    platform: string
    timezone: string
    screenResolution: string
    isMobile: boolean
}

interface Session {
    sessionId: string
    startTime: number
    pages: PageView[]
    deviceInfo: DeviceInfo
    currentPath: string
    totalPages: number
    sessionDuration: number
    lastActivity: number
    lastUpdated: string
}

interface Analytics {
    totalSessions: number
    totalPageViews: number
    averageSessionDuration: number
    popularPages: Record<string, number>
    deviceBreakdown: {
        mobile: number
        desktop: number
    }
    averageTimePerPage: Record<string, number>
    userFlow: any[]
}

interface DashboardData {
    sessions: Session[]
    analytics: Analytics
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/log-metadata`)
                if (!response.ok) {
                    throw new Error("Failed to fetch analytics data")
                }
                const result = await response.json()
                setData(result)
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
        // Refresh data every 30 seconds
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [])

    const formatDuration = (ms: number) => {
        if (ms < 0) return "Active"
        const seconds = Math.floor(ms / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`
        } else {
            return `${seconds}s`
        }
    }

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleString()
    }

    const getPageName = (path: string) => {
        const pageNames: Record<string, string> = {
            "/": "Home",
            "/contact": "Contact",
            "/gallery": "Gallery",
            "/configuration": "Configuration",
            "/events": "Events",
            "/guide": "Guide",
            "/guide/appointment-setup": "Appointment Setup",
            "/guide/customer-setup": "Customer Setup",
            "/guide/customer-onboarding": "Customer Onboarding",
            "/guide/best-practices": "Best Practices",
            "/guide/after-appointment": "After Appointment",
        }
        return pageNames[path] || path
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading analytics data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-red-800 font-semibold mb-2">Error Loading Data</h2>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!data) return null

    const { sessions, analytics } = data

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">Real-time website analytics and user sessions</p>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.totalSessions}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{analytics.totalPageViews}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatDuration(analytics.averageSessionDuration)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Device Split</CardTitle>
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Monitor className="h-4 w-4" />
                                <span className="text-sm">{analytics.deviceBreakdown.desktop}</span>
                                <Smartphone className="h-4 w-4" />
                                <span className="text-sm">{analytics.deviceBreakdown.mobile}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Popular Pages */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Popular Pages
                            </CardTitle>
                            <CardDescription>Most visited pages on your website</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Object.entries(analytics.popularPages)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([path, views]) => (
                                        <div key={path} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Globe className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">{getPageName(path)}</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {path}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600">{views} views</span>
                                                {analytics.averageTimePerPage[path] && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {formatDuration(analytics.averageTimePerPage[path])} avg
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Sessions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Activity className="w-5 h-5 mr-2" />
                                Recent Sessions
                            </CardTitle>
                            <CardDescription>Latest user sessions and activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {sessions.slice(0, 5).map((session) => (
                                    <div key={session.sessionId} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                {session.deviceInfo.isMobile ? (
                                                    <Smartphone className="w-4 h-4 text-blue-600" />
                                                ) : (
                                                    <Monitor className="w-4 h-4 text-green-600" />
                                                )}
                                                <span className="font-mono text-xs text-gray-500">{session.sessionId.split("_")[2]}</span>
                                            </div>
                                            <Badge variant={session.sessionDuration === -1 ? "default" : "secondary"}>
                                                {session.sessionDuration === -1 ? "Active" : "Completed"}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Duration:</span>
                                                <span className="ml-1 font-medium">{formatDuration(session.sessionDuration)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Pages:</span>
                                                <span className="ml-1 font-medium">{session.totalPages}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Current:</span>
                                                <span className="ml-1 font-medium">{getPageName(session.currentPath)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                                <span className="text-gray-500">{session.deviceInfo.timezone}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Sessions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            Session Details
                        </CardTitle>
                        <CardDescription>Complete session information and user journeys</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {sessions.map((session) => (
                                <div key={session.sessionId} className="border rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-2">
                                                {session.deviceInfo.isMobile ? (
                                                    <Smartphone className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <Monitor className="w-5 h-5 text-green-600" />
                                                )}
                                                <span className="font-semibold">Session {session.sessionId.split("_")[2]}</span>
                                            </div>
                                            <Badge variant={session.sessionDuration === -1 ? "default" : "secondary"}>
                                                {session.sessionDuration === -1 ? "Active Session" : "Completed"}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-gray-500">Started: {formatTimestamp(session.startTime)}</div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-sm text-gray-500 mb-1">Device Info</div>
                                            <div className="text-sm">
                                                <div>{session.deviceInfo.platform}</div>
                                                <div>{session.deviceInfo.screenResolution}</div>
                                                <div>{session.deviceInfo.language}</div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-sm text-gray-500 mb-1">Session Stats</div>
                                            <div className="text-sm">
                                                <div>Duration: {formatDuration(session.sessionDuration)}</div>
                                                <div>Pages Visited: {session.totalPages}</div>
                                                <div>Current: {getPageName(session.currentPath)}</div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="text-sm text-gray-500 mb-1">Location</div>
                                            <div className="text-sm">
                                                <div className="flex items-center">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {session.deviceInfo.timezone}
                                                </div>
                                                <div>Last Activity: {formatTimestamp(session.lastActivity)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-gray-700 mb-3">Page Journey</div>
                                        <div className="space-y-2">
                                            {session.pages.map((page, index) => (
                                                <div key={index} className="flex items-center justify-between bg-white border rounded-lg p-3">
                                                    <div className="flex items-center space-x-3">
                                                        <Badge variant="outline" className="text-xs">
                                                            {page.sequence}
                                                        </Badge>
                                                        <span className="font-medium">{getPageName(page.path)}</span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {page.path}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <div>{formatTimestamp(page.timestamp)}</div>
                                                        {page.timeSpent && (
                                                            <div className="flex items-center">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                {formatDuration(page.timeSpent)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
