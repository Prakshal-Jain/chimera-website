"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Download, Copy, CheckCircle2, ExternalLink, Calendar, Building2, Car, Hash, Trash2, Eye, Users, AlertCircle, Smartphone, TrendingUp, FileText, BarChart3, PieChart, Activity, Clock } from 'lucide-react'
import { API_URL } from "@/app/variables"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AnalyticsSection } from "./analytics-section"


interface CampaignDetails {
  _id: string
  campaign_id: string
  campaign_name: string
  dealership: string
  manufacturer: string
  car_model: string
  campaign_url: string
  qr_code_url: string
  created_at: string
  active: boolean
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

function CampaignDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get("id")

  const [campaign, setCampaign] = useState<CampaignDetails | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails(campaignId)
      fetchAnalytics(campaignId)
    } else {
      setError("No campaign ID provided")
      setLoading(false)
    }
  }, [campaignId])

  const fetchCampaignDetails = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/campaign/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch campaign details")
      }

      const data = await response.json()
      
      // The /campaign/:code endpoint returns campaign data directly
      // We need to fetch full campaign details from campaigns list for additional info
      const campaignsResponse = await fetch(`${API_URL}/campaigns`)
      const campaignsData = await campaignsResponse.json()
      const fullCampaign = campaignsData.campaigns.find(
        (c: any) => c.campaign_id === id.toUpperCase()
      )

      if (fullCampaign) {
        // Combine data from both endpoints
        const baseUrl = `${window.location.protocol}//${window.location.host}`
        setCampaign({
          ...fullCampaign,
          campaign_url: data.campaign?.campaign_url || `https://chimeraauto.com/ar-view?campaign_code=${id}`,
          qr_code_url: data.campaign?.qr_code_url || `${baseUrl}/api/campaign/${id}/qr`,
        })
      } else {
        throw new Error("Campaign not found")
      }
    } catch (err: any) {
      setError(err.message || "Failed to load campaign")
      console.error("Error fetching campaign:", err)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQRCode = async (qrUrl: string, campaignCode: string) => {
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `campaign_${campaignCode}_qr.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Error downloading QR code:", err)
      alert("Failed to download QR code")
    }
  }

  const handleDeleteCampaign = async () => {
    if (!campaignId) return

    try {
      setDeleting(true)
      const response = await fetch(`${API_URL}/campaigns/${campaignId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to delete campaign (${response.status})`)
      }

      // Redirect to campaigns list after successful deletion
      router.push("/campaigns")
    } catch (err: any) {
      console.error("Error deleting campaign:", err)
      alert(err.message || "Failed to delete campaign")
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const fetchAnalytics = async (id: string) => {
    try {
      setLoadingAnalytics(true)
      const url = `${API_URL}/campaign/${id}/analytics`
      console.log('Fetching analytics from:', url)
      
      const response = await fetch(url)
      console.log('Analytics response status:', response.status)

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.status}`)
      }

      const data = await response.json()
      console.log('Analytics data received:', data)
      
      // Ensure the data has the expected structure
      const analyticsData = {
        summary: data.summary || {
          total_views: 0,
          successful_ar_views: 0,
          qr_code_shown: 0,
          errors: 0,
          ar_compatible_devices: 0,
          non_ar_compatible_devices: 0,
          views_with_customer_metadata: 0,
          unique_customers: 0,
          views_with_additional_metadata: 0
        },
        customer_breakdown: data.customer_breakdown || [],
        additional_metadata_analysis: data.additional_metadata_analysis || [],
        logs: data.logs || []
      }
      
      console.log('Processed analytics data:', analyticsData)
      setAnalytics(analyticsData)
    } catch (err: any) {
      console.error("Error fetching analytics:", err)
      console.error("Error details:", err.message)
      // Don't set error state for analytics, just log it
    } finally {
      setLoadingAnalytics(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const downloadAnalyticsCSV = () => {
    if (!analytics || !campaign) return

    // Prepare CSV data
    const csvRows = []

    // Header
    csvRows.push("Campaign Analytics Report")
    csvRows.push(`Campaign: ${campaign.campaign_name}`)
    csvRows.push(`Campaign ID: ${campaign.campaign_id}`)
    csvRows.push(`Generated: ${new Date().toLocaleString()}`)
    csvRows.push("")

    // Summary Section
    csvRows.push("SUMMARY")
    csvRows.push("Metric,Value")
    csvRows.push(`Total Views,${analytics.summary.total_views}`)
    csvRows.push(`Successful AR Views,${analytics.summary.successful_ar_views}`)
    csvRows.push(`QR Code Shown,${analytics.summary.qr_code_shown}`)
    csvRows.push(`Errors,${analytics.summary.errors}`)
    csvRows.push(`AR Compatible Devices,${analytics.summary.ar_compatible_devices}`)
    csvRows.push(`Non-AR Compatible Devices,${analytics.summary.non_ar_compatible_devices}`)
    csvRows.push(`Views with Customer Metadata,${analytics.summary.views_with_customer_metadata}`)
    csvRows.push(`Unique Customers,${analytics.summary.unique_customers}`)
    csvRows.push(`Views with Additional Metadata,${analytics.summary.views_with_additional_metadata}`)
    csvRows.push("")

    // Customer Breakdown with Engagement Metrics
    if (analytics.customer_breakdown.length > 0) {
      csvRows.push("CUSTOMER BREAKDOWN")
      csvRows.push("Customer ID,Type,Total Views,Successful AR Views,Last Viewed,Unique Sessions,AR Success Rate (%),Avg AR Engagement (s),Engagement Score,Buying Intent,Additional Metadata")
      analytics.customer_breakdown.forEach((customer) => {
        // Get customer logs to extract metadata
        const customerLogs = analytics.logs.filter(
          (log: any) => log.customer_metadata?.metadata_value === customer.metadata_value
        )
        
        // Calculate unique sessions
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
        const avgEngagementTime = logsWithEngagement.length > 0 ? Math.round(totalEngagementTime / logsWithEngagement.length) : 0
        
        // Calculate engagement score
        const viewScore = Math.min((customer.total_views / 10) * 40, 40)
        const arScore = (arSuccessRate / 100) * 30
        const sessionScore = Math.min((uniqueSessions / 5) * 30, 30)
        const engagementScore = Math.round(viewScore + arScore + sessionScore)
        
        // Determine buying intent
        let buyingIntent = "Low"
        if (engagementScore >= 70) buyingIntent = "High"
        else if (engagementScore >= 40) buyingIntent = "Medium"
        
        // Collect all additional metadata
        const allMetadata: Record<string, any> = {}
        customerLogs.forEach((log: any) => {
          if (log.additional_metadata) {
            Object.assign(allMetadata, log.additional_metadata)
          }
        })
        const metadataStr = Object.keys(allMetadata).length > 0 ? JSON.stringify(allMetadata).replace(/"/g, '""') : "N/A"
        
        csvRows.push(
          `"${customer.metadata_value}","${customer.metadata_type}",${customer.total_views},${customer.successful_ar_views},"${new Date(customer.last_viewed).toLocaleString()}",${uniqueSessions},${Math.round(arSuccessRate)},${avgEngagementTime},${engagementScore},"${buyingIntent}","${metadataStr}"`
        )
      })
      csvRows.push("")
    }

    // Additional Metadata Analysis
    if (analytics.additional_metadata_analysis.length > 0) {
      csvRows.push("ADDITIONAL METADATA ANALYSIS")
      analytics.additional_metadata_analysis.forEach((param) => {
        csvRows.push(`Parameter: ${param.parameter_name}`)
        csvRows.push(`Unique Values,${param.unique_values_count}`)
        csvRows.push(`Total Occurrences,${param.total_occurrences}`)
        csvRows.push("Value,Count,Successful AR Views")
        Object.entries(param.values_breakdown).forEach(([value, stats]) => {
          csvRows.push(`"${value}",${stats.count},${stats.successful_ar_views}`)
        })
        csvRows.push("")
      })
    }

    // Activity Log with Full Metadata
    if (analytics.logs && analytics.logs.length > 0) {
      csvRows.push("ACTIVITY LOG")
      csvRows.push("Timestamp,Status,Action,AR Compatible,Customer ID,Customer Type,Persistent User ID,Platform,Device Type,User Agent,Location (Lat),Location (Lon),Location Accuracy,Screen Width,Screen Height,Viewport Width,Viewport Height,Pixel Ratio,Session ID,Origin Session ID,QR Scanned,Time on Page (s),AR Quick Look Opened,AR Engagement Duration (s),AR Engagement Status,Additional Metadata,Error")
      analytics.logs.forEach((log) => {
        const timestamp = log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"
        const status = log.success ? "Success" : "Failed"
        const action = log.action || "N/A"
        const arCompatible = log.is_ar_compatible !== undefined ? (log.is_ar_compatible ? "Yes" : "No") : "N/A"
        const customerId = log.customer_metadata ? log.customer_metadata.metadata_value : "N/A"
        const customerType = log.customer_metadata ? log.customer_metadata.metadata_type : "N/A"
        const persistentUserId = log.persistent_user_id || "N/A"
        const platform = log.platform || "N/A"
        const deviceType = log.device_type || "N/A"
        const userAgent = log.user_agent ? log.user_agent.replace(/"/g, '""') : "N/A"
        const latitude = log.latitude || "N/A"
        const longitude = log.longitude || "N/A"
        const locationAccuracy = log.location_accuracy || "N/A"
        const screenWidth = log.screen_width || "N/A"
        const screenHeight = log.screen_height || "N/A"
        const viewportWidth = log.viewport_width || "N/A"
        const viewportHeight = log.viewport_height || "N/A"
        const pixelRatio = log.pixel_ratio || "N/A"
        const sessionId = log.session_id || "N/A"
        const originSessionId = log.origin_session_id || "N/A"
        const qrScanned = log.qr_scanned ? "Yes" : "No"
        const timeOnPage = log.time_on_page || "N/A"
        const arQuickLookOpened = log.ar_quick_look_opened ? "Yes" : "No"
        const arEngagementDuration = log.ar_engagement_duration_seconds || "N/A"
        const arEngagementStatus = log.ar_engagement_status || "N/A"
        const additionalMetadata = log.additional_metadata ? JSON.stringify(log.additional_metadata).replace(/"/g, '""') : "N/A"
        const error = log.error_message ? log.error_message.replace(/"/g, '""') : ""
        
        csvRows.push(`"${timestamp}","${status}","${action}","${arCompatible}","${customerId}","${customerType}","${persistentUserId}","${platform}","${deviceType}","${userAgent}","${latitude}","${longitude}","${locationAccuracy}","${screenWidth}","${screenHeight}","${viewportWidth}","${viewportHeight}","${pixelRatio}","${sessionId}","${originSessionId}","${qrScanned}","${timeOnPage}","${arQuickLookOpened}","${arEngagementDuration}","${arEngagementStatus}","${additionalMetadata}","${error}"`)
      })
    }

    // Create and download CSV
    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${campaign.campaign_id}_analytics_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-red-500/10 border border-red-500/30 backdrop-blur-lg rounded-2xl">
            <CardContent className="pt-6">
              <p className="text-red-400 text-center mb-4">{error || "Campaign not found"}</p>
              <div className="flex justify-center">
                <Button
                  onClick={() => router.push("/campaigns")}
                  variant="outline"
                  className="bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Campaigns
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/campaigns")}
            variant="outline"
            className="mb-6 bg-transparent border border-white/20 text-white hover:bg-white/5 hover:text-white rounded-lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-serif font-light text-white mb-3 tracking-tight">
                {campaign.campaign_name}
              </h1>
              <code className="text-sm bg-white/10 px-3 py-1 rounded-lg text-white/70 font-mono">
                {campaign.campaign_id}
              </code>
            </div>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="outline"
              className="bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 hover:text-white rounded-lg"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Campaign
            </Button>
          </div>
        </div>

        {/* Campaign URL Card */}
        <Card className="mb-6 bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-serif font-light text-white">Campaign URL</CardTitle>
            <CardDescription className="text-white/60">Share this link to access the campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                value={campaign.campaign_url}
                readOnly
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-mono text-sm focus:outline-none focus:border-[#d4af37]"
              />
              <Button
                onClick={() => copyToClipboard(campaign.campaign_url)}
                variant="outline"
                className="bg-transparent border border-white/20 text-white hover:bg-white/5 hover:text-white rounded-lg px-6"
              >
                {copied ? <CheckCircle2 className="h-5 w-5 text-[#d4af37]" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campaign Details Card */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-serif font-light text-white">Campaign Details</CardTitle>
              <CardDescription className="text-white/60">Overview of campaign information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-[#d4af37] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white/60 font-light">Dealership</p>
                    <p className="text-white text-lg font-light mt-1">{campaign.dealership}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-[#d4af37] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white/60 font-light">Vehicle</p>
                    <p className="text-white text-lg font-light mt-1">
                      {campaign.manufacturer} {campaign.car_model.replace("_base.usdz", "").replace(/_/g, " ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#d4af37] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white/60 font-light">Created</p>
                    <p className="text-white text-lg font-light mt-1">{formatDate(campaign.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hash className="h-5 w-5 text-[#d4af37] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white/60 font-light">Campaign ID</p>
                    <p className="text-white text-lg font-mono font-light mt-1">{campaign.campaign_id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Card */}
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-serif font-light text-white">QR Code</CardTitle>
              <CardDescription className="text-white/60">Share this QR code with customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center p-6 bg-white rounded-xl">
                <img src={campaign.qr_code_url || "/placeholder.svg"} alt="Campaign QR Code" className="w-64 h-64" />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => downloadQRCode(campaign.qr_code_url, campaign.campaign_id)}
                  className="w-full bg-transparent border-2 border-[#d4af37] text-white hover:bg-[#d4af37]/15 hover:text-white rounded-lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
                <Button
                  onClick={() => window.open(campaign.campaign_url, "_blank")}
                  variant="outline"
                  className="w-full bg-transparent border border-white/20 text-white hover:bg-white/5 hover:text-white rounded-lg"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          {analytics ? (
            <AnalyticsSection 
              analytics={analytics} 
              loading={loadingAnalytics} 
              onDownloadCSV={downloadAnalyticsCSV} 
            />
          ) : loadingAnalytics ? (
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
              <CardContent className="pt-12 pb-12 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
              <CardContent className="pt-12 pb-12 text-center">
                <AlertCircle className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-light text-white mb-2">No Analytics Available</h3>
                <p className="text-white/60">Analytics data will appear here once the campaign receives views.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#1a1a1a] border border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-2xl">Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70 text-base">
              Are you sure you want to permanently delete "{campaign.campaign_name}"? This action cannot be undone and
              all campaign data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="bg-transparent border border-white/20 text-white hover:bg-white/5 hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCampaign}
              disabled={deleting}
              className="bg-red-500 text-white hover:bg-red-600 border-0"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Permanently
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function CampaignDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
          <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
        </div>
      }
    >
      <CampaignDashboard />
    </Suspense>
  )
}
