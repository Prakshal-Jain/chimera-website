"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, Users, AlertCircle, Smartphone, TrendingUp, Flame, Clock, CheckCircle2, Target, BarChart3, Activity, ArrowUp, ArrowDown, FileText } from 'lucide-react'
import { useState, useMemo } from "react"

interface CustomerWithIntent {
    metadata_type: string
    metadata_value: string
    total_views: number
    successful_ar_views: number
    last_viewed: string
    buying_intent_score: number
    engagement_time?: number
    unique_sessions: number
}

interface AnalyticsData {
    summary: {
        total_views: number
        successful_ar_views: number
        qr_code_shown: number
        errors: number
        ar_compatible_devices: number
        non_ar_compatible_devices: number
        views_with_customer_metadata: number
        unique_customers: number
        views_with_additional_metadata: number
    }
    customer_breakdown: Array<{
        metadata_type: string
        metadata_value: string
        total_views: number
        successful_ar_views: number
        last_viewed: string
    }>
    additional_metadata_analysis: Array<{
        parameter_name: string
        unique_values_count: number
        total_occurrences: number
        values_breakdown: Record<string, { count: number; successful_ar_views: number }>
    }>
    logs: Array<any>
}

interface AnalyticsSectionProps {
    analytics: AnalyticsData
    loading: boolean
    onDownloadCSV: () => void
}

interface EnhancedCustomer {
    metadata_type: string
    metadata_value: string
    total_views: number
    successful_ar_views: number
    last_viewed: string
    engagement_score: number
    buying_intent: "high" | "medium" | "low"
    unique_sessions: number
    ar_success_rate: number
    avg_ar_engagement_time?: number
    metadata?: Record<string, any>
}

export function AnalyticsSection({ analytics, loading, onDownloadCSV }: AnalyticsSectionProps) {
    const [sortBy, setSortBy] = useState<"engagement" | "views" | "ar_success">("engagement")
    const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc")

    const enhancedCustomers = useMemo(() => {
        return analytics.customer_breakdown.map((customer) => {
            // Get all logs for this customer
            const customerLogs = analytics.logs.filter(
                (log: any) => log.customer_metadata?.metadata_value === customer.metadata_value
            )

            // Calculate unique sessions (views separated by 1+ hours)
            const timestamps = customerLogs.map((log: any) => new Date(log.timestamp).getTime()).sort((a, b) => a - b)

            let uniqueSessions = timestamps.length > 0 ? 1 : 0
            for (let i = 1; i < timestamps.length; i++) {
                if (timestamps[i] - timestamps[i - 1] > 3600000) {
                    uniqueSessions++
                }
            }

            // Calculate AR success rate
            const arSuccessRate = customer.total_views > 0 ? (customer.successful_ar_views / customer.total_views) * 100 : 0

            // Calculate AR engagement time
            const logsWithEngagement = customerLogs.filter((log: any) => log.ar_engagement_duration_seconds && log.ar_engagement_duration_seconds > 0)
            const totalEngagementTime = logsWithEngagement.reduce((sum: number, log: any) => sum + (log.ar_engagement_duration_seconds || 0), 0)
            const avgEngagementTime = logsWithEngagement.length > 0 ? totalEngagementTime / logsWithEngagement.length : 0

            // Extract additional metadata from logs
            const metadata: Record<string, any> = {}
            customerLogs.forEach((log: any) => {
                if (log.additional_metadata) {
                    Object.assign(metadata, log.additional_metadata)
                }
            })

            // Calculate engagement score (0-100)
            // - Repeat views (40 pts): up to 10 views = 4 pts each
            // - AR success rate (30 pts): percentage based
            // - Unique sessions (30 pts): up to 5 sessions = 6 pts each
            const viewScore = Math.min((customer.total_views / 10) * 40, 40)
            const arScore = (arSuccessRate / 100) * 30
            const sessionScore = Math.min((uniqueSessions / 5) * 30, 30)
            const engagementScore = Math.round(viewScore + arScore + sessionScore)

            // Determine buying intent
            let buying_intent: "high" | "medium" | "low"
            if (engagementScore >= 70) buying_intent = "high"
            else if (engagementScore >= 40) buying_intent = "medium"
            else buying_intent = "low"

            return {
                ...customer,
                engagement_score: engagementScore,
                buying_intent,
                unique_sessions: uniqueSessions,
                ar_success_rate: Math.round(arSuccessRate),
                avg_ar_engagement_time: avgEngagementTime,
                metadata,
            } as EnhancedCustomer
        })
    }, [analytics])

    const sortedCustomers = useMemo(() => {
        const sorted = [...enhancedCustomers]
        sorted.sort((a, b) => {
            let compareValue = 0
            if (sortBy === "engagement") {
                compareValue = a.engagement_score - b.engagement_score
            } else if (sortBy === "views") {
                compareValue = a.total_views - b.total_views
            } else if (sortBy === "ar_success") {
                compareValue = a.ar_success_rate - b.ar_success_rate
            }
            return sortDirection === "desc" ? -compareValue : compareValue
        })
        return sorted
    }, [enhancedCustomers, sortBy, sortDirection])

    const metrics = useMemo(() => {
        const highIntentCount = enhancedCustomers.filter((c) => c.buying_intent === "high").length
        const mediumIntentCount = enhancedCustomers.filter((c) => c.buying_intent === "medium").length
        const lowIntentCount = enhancedCustomers.filter((c) => c.buying_intent === "low").length

        const conversionRate =
            analytics.summary.total_views > 0
                ? (analytics.summary.successful_ar_views / analytics.summary.total_views) * 100
                : 0

        const avgViewsPerCustomer =
            analytics.summary.unique_customers > 0
                ? analytics.summary.views_with_customer_metadata / analytics.summary.unique_customers
                : 0

        const deviceCompatibilityRate =
            analytics.summary.total_views > 0
                ? (analytics.summary.ar_compatible_devices / analytics.summary.total_views) * 100
                : 0

        const errorRate = analytics.summary.total_views > 0 ? (analytics.summary.errors / analytics.summary.total_views) * 100 : 0

        // Calculate AR engagement metrics
        const logsWithEngagement = analytics.logs.filter((log: any) => log.ar_engagement_duration_seconds && log.ar_engagement_duration_seconds > 0)
        const totalEngagementTime = logsWithEngagement.reduce((sum: number, log: any) => sum + (log.ar_engagement_duration_seconds || 0), 0)
        const avgEngagementTime = logsWithEngagement.length > 0 ? totalEngagementTime / logsWithEngagement.length : 0
        const totalEngagedSessions = logsWithEngagement.length
        
        // Engagement time distribution
        const engagementDistribution = {
            short: logsWithEngagement.filter((log: any) => log.ar_engagement_duration_seconds < 30).length,
            medium: logsWithEngagement.filter((log: any) => log.ar_engagement_duration_seconds >= 30 && log.ar_engagement_duration_seconds < 60).length,
            long: logsWithEngagement.filter((log: any) => log.ar_engagement_duration_seconds >= 60 && log.ar_engagement_duration_seconds < 120).length,
            veryLong: logsWithEngagement.filter((log: any) => log.ar_engagement_duration_seconds >= 120).length,
        }
        
        // QR code conversion tracking
        const qrShownCount = analytics.logs.filter((log: any) => log.action === 'show_qr_code').length
        const qrScannedCount = analytics.logs.filter((log: any) => log.qr_scanned === true).length
        const qrConversionRate = qrShownCount > 0 ? (qrScannedCount / qrShownCount) * 100 : 0

        return {
            highIntentCount,
            mediumIntentCount,
            lowIntentCount,
            conversionRate,
            avgViewsPerCustomer,
            deviceCompatibilityRate,
            errorRate,
            avgEngagementTime,
            totalEngagedSessions,
            engagementDistribution,
            qrConversionRate,
            qrShownCount,
            qrScannedCount,
        }
    }, [enhancedCustomers, analytics])

    const toggleSort = (column: "engagement" | "views" | "ar_success") => {
        if (sortBy === column) {
            setSortDirection(sortDirection === "desc" ? "asc" : "desc")
        } else {
            setSortBy(column)
            setSortDirection("desc")
        }
    }

    const getBuyingIntentBadge = (intent: "high" | "medium" | "low") => {
        if (intent === "high") {
            return {
                label: "High Intent",
                color: "bg-red-500/20 text-red-300 border-red-500/30",
                icon: <Flame className="h-3.5 w-3.5" />,
            }
        } else if (intent === "medium") {
            return {
                label: "Medium Intent",
                color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
                icon: <TrendingUp className="h-3.5 w-3.5" />,
            }
        } else {
            return {
                label: "Low Intent",
                color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                icon: <Target className="h-3.5 w-3.5" />,
            }
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading) {
        return (
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                <CardContent className="pt-12 pb-12 flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-[#d4af37]" />
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-light text-white tracking-tight">Campaign Analytics</h2>
                    <p className="text-white/60 text-sm mt-1">Expert-level insights and engagement metrics</p>
                </div>
                <Button
                    onClick={onDownloadCSV}
                    className="bg-[#d4af37] hover:bg-[#c9a532] text-black font-medium rounded-lg"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl overflow-hidden">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-white/60 font-light mb-1">Total Views</p>
                                <p className="text-4xl font-serif font-light text-white">{analytics.summary.total_views}</p>
                                <p className="text-xs text-white/50 mt-2">{analytics.summary.unique_customers} unique customers</p>
                            </div>
                            <div className="h-14 w-14 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                                <Eye className="h-7 w-7 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl overflow-hidden">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-white/60 font-light mb-1">AR Conversion</p>
                                <p className="text-4xl font-serif font-light text-white">{metrics.conversionRate.toFixed(1)}%</p>
                                <p className="text-xs text-white/50 mt-2">{analytics.summary.successful_ar_views} successful views</p>
                            </div>
                            <div className="h-14 w-14 bg-green-500/20 rounded-2xl flex items-center justify-center border border-green-500/30">
                                <CheckCircle2 className="h-7 w-7 text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl overflow-hidden">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-white/60 font-light mb-1">Avg. Engagement</p>
                                <p className="text-4xl font-serif font-light text-white">{metrics.avgViewsPerCustomer.toFixed(1)}</p>
                                <p className="text-xs text-white/50 mt-2">views per customer</p>
                            </div>
                            <div className="h-14 w-14 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                                <Activity className="h-7 w-7 text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl overflow-hidden">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-white/60 font-light mb-1">Device Support</p>
                                <p className="text-4xl font-serif font-light text-white">{metrics.deviceCompatibilityRate.toFixed(0)}%</p>
                                <p className="text-xs text-white/50 mt-2">AR compatible devices</p>
                            </div>
                            <div className="h-14 w-14 bg-orange-500/20 rounded-2xl flex items-center justify-center border border-orange-500/30">
                                <Smartphone className="h-7 w-7 text-orange-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AR Engagement Metrics */}
            {metrics.totalEngagedSessions > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl overflow-hidden">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-white/60 font-light mb-1">Avg. AR Engagement</p>
                                    <p className="text-4xl font-serif font-light text-white">{metrics.avgEngagementTime.toFixed(0)}s</p>
                                    <p className="text-xs text-white/50 mt-2">{metrics.totalEngagedSessions} sessions tracked</p>
                                </div>
                                <div className="h-14 w-14 bg-[#d4af37]/20 rounded-2xl flex items-center justify-center border border-[#d4af37]/30">
                                    <Clock className="h-7 w-7 text-[#d4af37]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl overflow-hidden">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-white/60 font-light mb-1">Engagement Distribution</p>
                                    <div className="mt-2 space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white/60">&lt;30s</span>
                                            <span className="text-white font-medium">{metrics.engagementDistribution.short}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white/60">30-60s</span>
                                            <span className="text-white font-medium">{metrics.engagementDistribution.medium}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white/60">1-2min</span>
                                            <span className="text-white font-medium">{metrics.engagementDistribution.long}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white/60">2min+</span>
                                            <span className="text-white font-medium">{metrics.engagementDistribution.veryLong}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-14 w-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30">
                                    <BarChart3 className="h-7 w-7 text-cyan-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {metrics.qrShownCount > 0 && (
                        <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl overflow-hidden">
                            <CardContent className="pt-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-white/60 font-light mb-1">QR Code Conversion</p>
                                        <p className="text-4xl font-serif font-light text-white">{metrics.qrConversionRate.toFixed(0)}%</p>
                                        <p className="text-xs text-white/50 mt-2">{metrics.qrScannedCount} of {metrics.qrShownCount} scanned</p>
                                    </div>
                                    <div className="h-14 w-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                                        <FileText className="h-7 w-7 text-indigo-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Buying Intent Distribution */}
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl font-serif font-light text-white flex items-center gap-2">
                        <Flame className="h-5 w-5 text-[#d4af37]" />
                        Buying Intent Distribution
                    </CardTitle>
                    <CardDescription className="text-white/60">Customer readiness to purchase</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* High Intent */}
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Flame className="h-5 w-5 text-red-400" />
                                    <span className="text-white font-medium">High Intent</span>
                                </div>
                                <span className="text-2xl font-serif font-light text-red-400">{metrics.highIntentCount}</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${enhancedCustomers.length > 0 ? (metrics.highIntentCount / enhancedCustomers.length) * 100 : 0
                                            }%`,
                                    }}
                                />
                            </div>
                            <p className="text-xs text-white/50 mt-2">Score 70-100 • Ready to buy</p>
                        </div>

                        {/* Medium Intent */}
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-yellow-400" />
                                    <span className="text-white font-medium">Medium Intent</span>
                                </div>
                                <span className="text-2xl font-serif font-light text-yellow-400">{metrics.mediumIntentCount}</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${enhancedCustomers.length > 0 ? (metrics.mediumIntentCount / enhancedCustomers.length) * 100 : 0
                                            }%`,
                                    }}
                                />
                            </div>
                            <p className="text-xs text-white/50 mt-2">Score 40-69 • Considering</p>
                        </div>

                        {/* Low Intent */}
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Target className="h-5 w-5 text-blue-400" />
                                    <span className="text-white font-medium">Low Intent</span>
                                </div>
                                <span className="text-2xl font-serif font-light text-blue-400">{metrics.lowIntentCount}</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${enhancedCustomers.length > 0 ? (metrics.lowIntentCount / enhancedCustomers.length) * 100 : 0
                                            }%`,
                                    }}
                                />
                            </div>
                            <p className="text-xs text-white/50 mt-2">Score 0-39 • Exploring</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversion Funnel */}
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-serif font-light text-white flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-[#d4af37]" />
                            Conversion Funnel
                        </CardTitle>
                        <CardDescription className="text-white/60">Step-by-step user journey</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-white font-medium">Total Views</span>
                                    <span className="text-sm text-white/70">{analytics.summary.total_views}</span>
                                </div>
                                <div className="h-10 bg-white/10 rounded-lg overflow-hidden relative">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">100%</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-white font-medium">AR Compatible</span>
                                    <span className="text-sm text-white/70">{analytics.summary.ar_compatible_devices}</span>
                                </div>
                                <div className="h-10 bg-white/10 rounded-lg overflow-hidden relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center"
                                        style={{
                                            width: `${analytics.summary.total_views > 0
                                                    ? (analytics.summary.ar_compatible_devices / analytics.summary.total_views) * 100
                                                    : 0
                                                }%`,
                                        }}
                                    >
                                        <span className="text-white text-sm font-medium">{metrics.deviceCompatibilityRate.toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-white font-medium">Successful AR Views</span>
                                    <span className="text-sm text-white/70">{analytics.summary.successful_ar_views}</span>
                                </div>
                                <div className="h-10 bg-white/10 rounded-lg overflow-hidden relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-600 flex items-center justify-center"
                                        style={{
                                            width: `${analytics.summary.total_views > 0
                                                    ? (analytics.summary.successful_ar_views / analytics.summary.total_views) * 100
                                                    : 0
                                                }%`,
                                        }}
                                    >
                                        <span className="text-black text-sm font-medium">{metrics.conversionRate.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-white font-medium">QR Code Shown</span>
                                    <span className="text-sm text-white/70">{analytics.summary.qr_code_shown}</span>
                                </div>
                                <div className="h-10 bg-white/10 rounded-lg overflow-hidden relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center"
                                        style={{
                                            width: `${analytics.summary.total_views > 0
                                                    ? (analytics.summary.qr_code_shown / analytics.summary.total_views) * 100
                                                    : 0
                                                }%`,
                                        }}
                                    >
                                        <span className="text-white text-sm font-medium">
                                            {analytics.summary.total_views > 0
                                                ? Math.round((analytics.summary.qr_code_shown / analytics.summary.total_views) * 100)
                                                : 0}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quality Metrics */}
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-serif font-light text-white flex items-center gap-2">
                            <Activity className="h-5 w-5 text-[#d4af37]" />
                            Quality & Performance
                        </CardTitle>
                        <CardDescription className="text-white/60">Campaign health indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                                    <span className="text-sm text-white/60">Success Rate</span>
                                </div>
                                <p className="text-3xl font-serif font-light text-white">{metrics.conversionRate.toFixed(1)}%</p>
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="h-4 w-4 text-red-400" />
                                    <span className="text-sm text-white/60">Error Rate</span>
                                </div>
                                <p className="text-3xl font-serif font-light text-white">{metrics.errorRate.toFixed(1)}%</p>
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="h-4 w-4 text-blue-400" />
                                    <span className="text-sm text-white/60">Repeat Rate</span>
                                </div>
                                <p className="text-3xl font-serif font-light text-white">
                                    {metrics.avgViewsPerCustomer > 1 ? ((metrics.avgViewsPerCustomer - 1) * 50).toFixed(0) : 0}%
                                </p>
                            </div>

                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Smartphone className="h-4 w-4 text-orange-400" />
                                    <span className="text-sm text-white/60">Compatibility</span>
                                </div>
                                <p className="text-3xl font-serif font-light text-white">{metrics.deviceCompatibilityRate.toFixed(0)}%</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white/60">Overall Health Score</span>
                                <span className="text-lg font-serif font-light text-[#d4af37]">
                                    {Math.round((metrics.conversionRate + metrics.deviceCompatibilityRate + (100 - metrics.errorRate)) / 3)}
                                    /100
                                </span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-600 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.round((metrics.conversionRate + metrics.deviceCompatibilityRate + (100 - metrics.errorRate)) / 3)}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Engagement Table */}
            {sortedCustomers.length > 0 && (
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-serif font-light text-white flex items-center gap-2">
                            <Users className="h-5 w-5 text-[#d4af37]" />
                            Customer Engagement Analysis
                        </CardTitle>
                        <CardDescription className="text-white/60">
                            Ranked by engagement score • {sortedCustomers.length} customers tracked
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-3 px-2 text-sm font-medium text-white/60">#</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Customer</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Intent</th>
                                        <th
                                            className="text-left py-3 px-4 text-sm font-medium text-white/60 cursor-pointer hover:text-white"
                                            onClick={() => toggleSort("engagement")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Engagement
                                                {sortBy === "engagement" &&
                                                    (sortDirection === "desc" ? (
                                                        <ArrowDown className="h-3.5 w-3.5 text-[#d4af37]" />
                                                    ) : (
                                                        <ArrowUp className="h-3.5 w-3.5 text-[#d4af37]" />
                                                    ))}
                                            </div>
                                        </th>
                                        <th
                                            className="text-left py-3 px-4 text-sm font-medium text-white/60 cursor-pointer hover:text-white"
                                            onClick={() => toggleSort("views")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Views
                                                {sortBy === "views" &&
                                                    (sortDirection === "desc" ? (
                                                        <ArrowDown className="h-3.5 w-3.5 text-[#d4af37]" />
                                                    ) : (
                                                        <ArrowUp className="h-3.5 w-3.5 text-[#d4af37]" />
                                                    ))}
                                            </div>
                                        </th>
                                        <th
                                            className="text-left py-3 px-4 text-sm font-medium text-white/60 cursor-pointer hover:text-white"
                                            onClick={() => toggleSort("ar_success")}
                                        >
                                            <div className="flex items-center gap-1">
                                                AR Success
                                                {sortBy === "ar_success" &&
                                                    (sortDirection === "desc" ? (
                                                        <ArrowDown className="h-3.5 w-3.5 text-[#d4af37]" />
                                                    ) : (
                                                        <ArrowUp className="h-3.5 w-3.5 text-[#d4af37]" />
                                                    ))}
                                            </div>
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Sessions</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-white/60">Last Seen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedCustomers.map((customer, index) => {
                                        const badge = getBuyingIntentBadge(customer.buying_intent)
                                        const isTopRanked = index < 3 && sortBy === "engagement" && sortDirection === "desc"

                                        return (
                                            <tr
                                                key={index}
                                                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isTopRanked ? "bg-[#d4af37]/5" : ""
                                                    }`}
                                            >
                                                <td className="py-4 px-2">
                                                    <span
                                                        className={`text-lg font-serif font-light ${index === 0 && isTopRanked
                                                                ? "text-[#d4af37]"
                                                                : index === 1 && isTopRanked
                                                                    ? "text-gray-400"
                                                                    : index === 2 && isTopRanked
                                                                        ? "text-amber-700"
                                                                        : "text-white/60"
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="text-white font-medium truncate max-w-[200px]">{customer.metadata_value}</p>
                                                        <p className="text-xs text-white/50">{customer.metadata_type}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 w-fit ${badge.color}`}>
                                                        {badge.icon}
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-serif font-light text-[#d4af37]">{customer.engagement_score}</span>
                                                        <div className="flex-1 min-w-[60px]">
                                                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-600 rounded-full"
                                                                    style={{ width: `${customer.engagement_score}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-white font-medium">{customer.total_views}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-medium">{customer.ar_success_rate}%</span>
                                                        <span className="text-xs text-white/50">({customer.successful_ar_views})</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-white">{customer.unique_sessions}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-sm text-white/60">
                                                        {new Date(customer.last_viewed).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Additional Metadata Analysis */}
            {analytics.additional_metadata_analysis.length > 0 && (
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-serif font-light text-white flex items-center gap-2">
                            <FileText className="h-5 w-5 text-[#d4af37]" />
                            Additional Parameters Analysis
                        </CardTitle>
                        <CardDescription className="text-white/60">Query parameter tracking and breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {analytics.additional_metadata_analysis.map((param, index) => (
                                <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                                    <div className="mb-4">
                                        <h4 className="text-lg font-medium text-white">{param.parameter_name}</h4>
                                        <div className="flex gap-6 mt-2">
                                            <p className="text-sm text-white/60">
                                                Unique Values: <span className="text-white">{param.unique_values_count}</span>
                                            </p>
                                            <p className="text-sm text-white/60">
                                                Total Occurrences: <span className="text-white">{param.total_occurrences}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {Object.entries(param.values_breakdown).map(([value, stats]) => (
                                            <div
                                                key={value}
                                                className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10"
                                            >
                                                <p className="text-white font-mono text-sm flex-1 truncate">{value}</p>
                                                <div className="flex gap-4 text-sm flex-shrink-0">
                                                    <span className="text-white/60">
                                                        Count: <span className="text-white">{stats.count}</span>
                                                    </span>
                                                    <span className="text-white/60">
                                                        AR Views: <span className="text-[#d4af37]">{stats.successful_ar_views}</span>
                                                    </span>
                                                    <span className="text-white/60">
                                                        Rate:{" "}
                                                        <span className="text-green-400">
                                                            {stats.count > 0 ? Math.round((stats.successful_ar_views / stats.count) * 100) : 0}%
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Performance Insights - REMOVED DUE TO DUPLICATION WITH PERFORMANCE CHARTS */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-serif font-light text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#d4af37]" />
              Conversion Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/60">AR Success Rate</span>
                  <span className="text-sm font-medium text-[#d4af37]">
                    {analytics.summary.total_views > 0
                      ? Math.round((analytics.summary.successful_ar_views / analytics.summary.total_views) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-600 rounded-full transition-all"
                    style={{
                      width: `${
                        analytics.summary.total_views > 0
                          ? (analytics.summary.successful_ar_views / analytics.summary.total_views) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/60">Device Compatibility</span>
                  <span className="text-sm font-medium text-green-400">
                    {analytics.summary.total_views > 0
                      ? Math.round((analytics.summary.ar_compatible_devices / analytics.summary.total_views) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all"
                    style={{
                      width: `${
                        analytics.summary.total_views > 0
                          ? (analytics.summary.ar_compatible_devices / analytics.summary.total_views) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/60">Customer Tracking</span>
                  <span className="text-sm font-medium text-blue-400">
                    {analytics.summary.total_views > 0
                      ? Math.round(
                          (analytics.summary.views_with_customer_metadata / analytics.summary.total_views) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full transition-all"
                    style={{
                      width: `${
                        analytics.summary.total_views > 0
                          ? (analytics.summary.views_with_customer_metadata / analytics.summary.total_views) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-serif font-light text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#d4af37]" />
              Quality Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white/60">Error Rate</p>
                <p className="text-2xl font-serif font-light text-white mt-1">
                  {analytics.summary.total_views > 0
                    ? ((analytics.summary.errors / analytics.summary.total_views) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  analytics.summary.errors === 0
                    ? "bg-green-500/20"
                    : analytics.summary.errors / analytics.summary.total_views < 0.05
                    ? "bg-yellow-500/20"
                    : "bg-red-500/20"
                }`}
              >
                <AlertCircle
                  className={`h-5 w-5 ${
                    analytics.summary.errors === 0
                      ? "text-green-500"
                      : analytics.summary.errors / analytics.summary.total_views < 0.05
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white/60">Avg Views per Customer</p>
                <p className="text-2xl font-serif font-light text-white mt-1">
                  {analytics.summary.unique_customers > 0
                    ? (analytics.summary.views_with_customer_metadata / analytics.summary.unique_customers).toFixed(1)
                    : 0}
                </p>
              </div>
              <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white/60">QR Code Engagement</p>
                <p className="text-2xl font-serif font-light text-white mt-1">
                  {analytics.summary.total_views > 0
                    ? Math.round((analytics.summary.qr_code_shown / analytics.summary.total_views) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-serif font-light text-white flex items-center gap-2">
              <Download className="h-5 w-5 text-[#d4af37]" />
              Data Export
            </CardTitle>
            <CardDescription className="text-white/60">Download analytics reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={onDownloadCSV}
              className="w-full bg-[#d4af37] hover:bg-[#c9a532] text-black font-medium rounded-lg"
            >
              <FileText className="mr-2 h-4 w-4" />
              Download Full Report
            </Button>
            <div className="pt-2 space-y-2 text-sm text-white/60">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />
                Summary metrics
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />
                Customer breakdown
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />
                Buying intent scores
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />
                Activity logs
              </p>
            </div>
          </CardContent>
        </Card>
      </div> */}

            {/* Activity Log */}
            {analytics.logs && analytics.logs.length > 0 && (
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-serif font-light text-white flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-[#d4af37]" />
                                    Activity Log
                                </CardTitle>
                                <CardDescription className="text-white/60">Recent campaign activity and interactions</CardDescription>
                            </div>
                            <span className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                {analytics.logs.length} entries
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {analytics.logs.slice(0, 20).map((log: any, index: number) => {
                                const isSuccess = log.success && log.action === "redirect_to_ar"
                                const isError = !log.success || log.error_message
                                const isQRCode = log.action === "show_qr_code"

                                return (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        <div
                                            className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${isSuccess ? "bg-green-500/20" : isError ? "bg-red-500/20" : "bg-blue-500/20"
                                                }`}
                                        >
                                            {isSuccess ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : isError ? (
                                                <AlertCircle className="h-5 w-5 text-red-500" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-blue-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-white font-medium">
                                                    {isSuccess
                                                        ? "Successful AR View"
                                                        : isError
                                                            ? "Error Encountered"
                                                            : isQRCode
                                                                ? "QR Code Shown"
                                                                : "Page View"}
                                                </p>
                                                <span className="text-xs text-white/60 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {log.customer_metadata && (
                                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                                                        Customer: {log.customer_metadata.metadata_value}
                                                    </span>
                                                )}
                                                {log.is_ar_compatible !== undefined && (
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded border ${log.is_ar_compatible
                                                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                                                : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                                                            }`}
                                                    >
                                                        {log.is_ar_compatible ? "AR Compatible" : "Non-AR Device"}
                                                    </span>
                                                )}
                                                {log.action === "show_qr_code" && (
                                                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                                                        QR Code Shown
                                                    </span>
                                                )}
                                                {log.error_message && (
                                                    <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded border border-red-500/30 max-w-xs truncate">
                                                        Error: {log.error_message}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            {analytics.logs.length > 20 && (
                                <div className="text-center py-4">
                                    <p className="text-sm text-white/60">
                                        Showing 20 of {analytics.logs.length} entries. Download CSV for complete data.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
