"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Loader2,
  ArrowLeft,
  Download,
  Copy,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Building2,
  Car,
  Hash,
  Trash2,
  Eye,
  Users,
  AlertCircle,
  Smartphone,
  TrendingUp,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Clock,
} from "lucide-react"
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

    // Customer Breakdown
    if (analytics.customer_breakdown.length > 0) {
      csvRows.push("CUSTOMER BREAKDOWN")
      csvRows.push("Customer ID,Type,Total Views,Successful AR Views,Last Viewed")
      analytics.customer_breakdown.forEach((customer) => {
        csvRows.push(
          `"${customer.metadata_value}",${customer.metadata_type},${customer.total_views},${customer.successful_ar_views},"${new Date(customer.last_viewed).toLocaleString()}"`
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

    // Activity Log
    if (analytics.logs && analytics.logs.length > 0) {
      csvRows.push("ACTIVITY LOG")
      csvRows.push("Timestamp,Status,Action,AR Compatible,Customer,Error")
      analytics.logs.forEach((log) => {
        const timestamp = log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"
        const status = log.success ? "Success" : "Failed"
        const action = log.action || "N/A"
        const arCompatible = log.is_ar_compatible !== undefined ? (log.is_ar_compatible ? "Yes" : "No") : "N/A"
        const customer = log.customer_metadata ? log.customer_metadata.metadata_value : "N/A"
        const error = log.error_message ? log.error_message : ""
        csvRows.push(`"${timestamp}","${status}","${action}","${arCompatible}","${customer}","${error}"`)
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

        {/* Analytics Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-serif font-light text-white tracking-tight">Campaign Analytics</h2>
              <p className="text-white/70 text-sm mt-1">Track views, engagement, and performance metrics</p>
            </div>
            <Button
              onClick={downloadAnalyticsCSV}
              disabled={!analytics || loadingAnalytics}
              className="bg-transparent border-2 border-[#d4af37] text-white hover:bg-[#d4af37]/15 hover:text-white rounded-lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>

          {loadingAnalytics ? (
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
              <CardContent className="pt-12 pb-12 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
              </CardContent>
            </Card>
          ) : analytics ? (
            <>
              {/* Summary Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60 font-light">Total Views</p>
                        <p className="text-3xl font-serif font-light text-white mt-1">
                          {analytics.summary.total_views}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                        <Eye className="h-6 w-6 text-[#d4af37]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60 font-light">AR Views</p>
                        <p className="text-3xl font-serif font-light text-white mt-1">
                          {analytics.summary.successful_ar_views}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60 font-light">Unique Customers</p>
                        <p className="text-3xl font-serif font-light text-white mt-1">
                          {analytics.summary.unique_customers}
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                        <Users className="h-6 w-6 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60 font-light">Errors</p>
                        <p className="text-3xl font-serif font-light text-white mt-1">{analytics.summary.errors}</p>
                      </div>
                      <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Device Compatibility & Engagement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif font-light text-white flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-[#d4af37]" />
                      Device Compatibility
                    </CardTitle>
                    <CardDescription className="text-white/60">AR capability breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="text-sm text-white/60 font-light">AR Compatible</p>
                        <p className="text-2xl font-serif font-light text-white mt-1">
                          {analytics.summary.ar_compatible_devices}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#d4af37] font-medium">
                          {analytics.summary.total_views > 0
                            ? Math.round((analytics.summary.ar_compatible_devices / analytics.summary.total_views) * 100)
                            : 0}
                          %
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="text-sm text-white/60 font-light">Non-AR Compatible</p>
                        <p className="text-2xl font-serif font-light text-white mt-1">
                          {analytics.summary.non_ar_compatible_devices}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/60 font-medium">
                          {analytics.summary.total_views > 0
                            ? Math.round(
                                (analytics.summary.non_ar_compatible_devices / analytics.summary.total_views) * 100
                              )
                            : 0}
                          %
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="text-sm text-white/60 font-light">QR Code Shown</p>
                        <p className="text-2xl font-serif font-light text-white mt-1">
                          {analytics.summary.qr_code_shown}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif font-light text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#d4af37]" />
                      Engagement Metrics
                    </CardTitle>
                    <CardDescription className="text-white/60">Customer interaction data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="text-sm text-white/60 font-light">With Customer Metadata</p>
                        <p className="text-2xl font-serif font-light text-white mt-1">
                          {analytics.summary.views_with_customer_metadata}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#d4af37] font-medium">
                          {analytics.summary.total_views > 0
                            ? Math.round(
                                (analytics.summary.views_with_customer_metadata / analytics.summary.total_views) * 100
                              )
                            : 0}
                          %
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="text-sm text-white/60 font-light">With Additional Metadata</p>
                        <p className="text-2xl font-serif font-light text-white mt-1">
                          {analytics.summary.views_with_additional_metadata}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/60 font-medium">
                          {analytics.summary.total_views > 0
                            ? Math.round(
                                (analytics.summary.views_with_additional_metadata / analytics.summary.total_views) * 100
                              )
                            : 0}
                          %
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <p className="text-sm text-white/60 font-light">Conversion Rate</p>
                        <p className="text-2xl font-serif font-light text-white mt-1">
                          {analytics.summary.total_views > 0
                            ? Math.round((analytics.summary.successful_ar_views / analytics.summary.total_views) * 100)
                            : 0}
                          %
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Insights */}
              <div className="mb-6">
                <h3 className="text-2xl font-serif font-light text-white mb-6 tracking-tight">Performance Insights</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Conversion Analysis */}
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
                              className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-600 rounded-full"
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
                                ? Math.round(
                                    (analytics.summary.ar_compatible_devices / analytics.summary.total_views) * 100
                                  )
                                : 0}
                              %
                            </span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
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
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"
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

                  {/* Quality Metrics */}
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
                              ? (
                                  analytics.summary.views_with_customer_metadata / analytics.summary.unique_customers
                                ).toFixed(1)
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

                  {/* Export & Download Options */}
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
                        onClick={downloadAnalyticsCSV}
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
                          Parameter analysis
                        </p>
                        <p className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />
                          Activity logs
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Customer Breakdown */}
              {analytics.customer_breakdown.length > 0 && (
                <Card className="mb-6 bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif font-light text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#d4af37]" />
                      Customer Breakdown
                    </CardTitle>
                    <CardDescription className="text-white/60">Individual customer engagement metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.customer_breakdown.map((customer, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="flex-1">
                            <p className="text-white font-medium">{customer.metadata_value}</p>
                            <p className="text-sm text-white/60 mt-1">
                              {customer.metadata_type} • Last viewed:{" "}
                              {new Date(customer.last_viewed).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-6 text-right">
                            <div>
                              <p className="text-sm text-white/60 font-light">Total Views</p>
                              <p className="text-xl font-serif font-light text-white mt-1">{customer.total_views}</p>
                            </div>
                            <div>
                              <p className="text-sm text-white/60 font-light">AR Views</p>
                              <p className="text-xl font-serif font-light text-[#d4af37] mt-1">
                                {customer.successful_ar_views}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Metadata Analysis */}
              {analytics.additional_metadata_analysis.length > 0 && (
                <Card className="mb-6 bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
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
                                <p className="text-white font-mono text-sm">{value}</p>
                                <div className="flex gap-4 text-sm">
                                  <span className="text-white/60">
                                    Count: <span className="text-white">{stats.count}</span>
                                  </span>
                                  <span className="text-white/60">
                                    AR Views: <span className="text-[#d4af37]">{stats.successful_ar_views}</span>
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
                        <CardDescription className="text-white/60">
                          Recent campaign activity and interactions
                        </CardDescription>
                      </div>
                      <span className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        {analytics.logs.length} entries
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {analytics.logs.slice(0, 20).map((log: any, index: number) => {
                        const isSuccess = log.success && log.action === 'redirect_to_ar'
                        const isError = !log.success || log.error_message
                        const isQRCode = log.action === 'show_qr_code'
                        
                        return (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                        >
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isSuccess
                                ? "bg-green-500/20"
                                : isError
                                ? "bg-red-500/20"
                                : "bg-blue-500/20"
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
                                  className={`text-xs px-2 py-1 rounded border ${
                                    log.is_ar_compatible
                                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                                      : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                                  }`}
                                >
                                  {log.is_ar_compatible ? "AR Compatible" : "Non-AR Device"}
                                </span>
                              )}
                              {log.action === 'show_qr_code' && (
                                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/30">
                                  QR Code Shown
                                </span>
                              )}
                              {log.error_message && (
                                <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded border border-red-500/30">
                                  Error: {log.error_message}
                                </span>
                              )}
                              {log.action && (
                                <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded border border-white/10">
                                  Action: {log.action}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      )}
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
            </>
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
