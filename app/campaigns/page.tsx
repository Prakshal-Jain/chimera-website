"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Plus, Search, CheckCircle2, Calendar, Car, Building2, Eye } from "lucide-react"
import { API_URL } from "@/app/variables"

interface Campaign {
  _id: string
  campaign_id: string
  campaign_name: string
  dealership: string
  car_model: string
  created_at: string
  active: boolean
}

export default function CampaignsListPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchCampaigns()
  }, [])

  useEffect(() => {
    filterCampaigns()
  }, [searchQuery, campaigns])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/campaigns`)

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns")
      }

      const data = await response.json()
      setCampaigns(data.campaigns || [])
    } catch (err: any) {
      setError(err.message || "Failed to load campaigns")
      console.error("Error fetching campaigns:", err)
    } finally {
      setLoading(false)
    }
  }

  const filterCampaigns = () => {
    if (!searchQuery.trim()) {
      setFilteredCampaigns(campaigns)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = campaigns.filter(
      (campaign) =>
        campaign.campaign_name.toLowerCase().includes(query) ||
        campaign.campaign_id.toLowerCase().includes(query) ||
        campaign.dealership.toLowerCase().includes(query) ||
        campaign.car_model.toLowerCase().includes(query),
    )
    setFilteredCampaigns(filtered)
  }

  const handleViewCampaign = (campaignId: string) => {
    router.push(`/campaigns/dashboard?id=${campaignId}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-4xl font-serif font-light text-white mb-2 tracking-tight">AR Campaigns</h1>
            <p className="text-white/70 text-lg">Manage your augmented reality campaigns</p>
          </div>
          <Button
            onClick={() => router.push("/campaigns/create")}
            className="mt-4 md:mt-0 bg-transparent border-2 border-[#d4af37] text-white hover:bg-[#d4af37]/15 px-6 py-3 rounded-xl font-medium transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search campaigns by name, code, dealership, or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#d4af37] rounded-lg"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-lg">
            <CardContent className="pt-6">
              <p className="text-red-400">{error}</p>
              <Button
                onClick={fetchCampaigns}
                variant="outline"
                className="mt-4 border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Campaigns Grid */}
        {filteredCampaigns.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex flex-col items-center">
                <Search className="h-16 w-16 text-white/30 mb-4" />
                <h3 className="text-xl font-serif font-light text-white mb-2">
                  {searchQuery ? "No campaigns found" : "No campaigns yet"}
                </h3>
                <p className="text-white/60 mb-6">
                  {searchQuery ? "Try adjusting your search criteria" : "Create your first AR campaign to get started"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => router.push("/campaigns/create")}
                    className="bg-transparent border-2 border-[#d4af37] text-white hover:bg-[#d4af37]/15 px-6 py-3 rounded-xl"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8 max-w-md mx-auto">
              <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60 font-light">Active Campaigns</p>
                      <p className="text-3xl font-serif font-light text-white mt-1">{campaigns.length}</p>
                    </div>
                    <div className="h-14 w-14 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                      <CheckCircle2 className="h-6 w-6 text-white/60" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaigns List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <Card
                  key={campaign._id}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl hover:shadow-2xl hover:border-[#d4af37]/30 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-serif font-light text-white mb-3">
                          {campaign.campaign_name}
                        </CardTitle>
                        <code className="text-xs bg-white/10 px-2 py-1 rounded text-white/70 font-mono">
                          {campaign.campaign_id}
                        </code>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-white/70">
                        <Building2 className="h-4 w-4 mr-2 flex-shrink-0 text-[#d4af37]" />
                        <span className="truncate">{campaign.dealership}</span>
                      </div>
                      <div className="flex items-center text-sm text-white/70">
                        <Car className="h-4 w-4 mr-2 flex-shrink-0 text-[#d4af37]" />
                        <span className="truncate">
                          {campaign.car_model
                            .replace("_base.usdz", "")
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-white/70">
                        <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-[#d4af37]" />
                        <span>{formatDate(campaign.created_at)}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-[#d4af37]/50 hover:text-white rounded-lg"
                      onClick={() => handleViewCampaign(campaign.campaign_id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
