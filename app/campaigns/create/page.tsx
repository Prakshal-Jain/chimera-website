"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertCircle } from "lucide-react"
import { API_URL } from "@/app/variables"

interface CampaignResponse {
  success: boolean
  message: string
  campaign?: {
    campaign_id: string
    campaign_name: string
    dealership: string
    manufacturer: string
    car_model: string
    campaign_url: string
    qr_code_url: string
    created_at: string
  }
}

export default function CreateCampaignPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [dealerships, setDealerships] = useState<string[]>([])
  const [manufacturers, setManufacturers] = useState<string[]>([])
  const [carModels, setCarModels] = useState<string[]>([])

  const [formData, setFormData] = useState({
    campaign_name: "",
    campaign_code: "",
    dealership: "",
    manufacturer: "",
    car_model: "",
    generate_code: true,
  })

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDealershipFromUrl, setIsDealershipFromUrl] = useState(false)

  // Fetch dealerships on mount and handle URL parameter
  useEffect(() => {
    fetchDealerships()
  }, [searchParams])

  // Fetch manufacturers when dealership changes
  useEffect(() => {
    if (formData.dealership) {
      fetchManufacturers(formData.dealership)
    } else {
      setManufacturers([])
      setCarModels([])
      setFormData((prev) => ({ ...prev, manufacturer: "", car_model: "" }))
    }
  }, [formData.dealership])

  // Fetch car models when manufacturer changes
  useEffect(() => {
    if (formData.dealership && formData.manufacturer) {
      fetchCarModels(formData.dealership, formData.manufacturer)
    } else {
      setCarModels([])
      setFormData((prev) => ({ ...prev, car_model: "" }))
    }
  }, [formData.manufacturer])

  const fetchDealerships = async () => {
    try {
      setLoadingData(true)
      const response = await fetch(`${API_URL}/dealerships`)
      if (!response.ok) throw new Error("Failed to fetch dealerships")
      const data = await response.json()
      setDealerships(data)

      // Check if dealership is provided in URL and is valid
      const urlDealership = searchParams.get("dealership")
      if (urlDealership && data.includes(urlDealership)) {
        setFormData((prev) => ({ ...prev, dealership: urlDealership }))
        setIsDealershipFromUrl(true)
      }
    } catch (err) {
      setError("Failed to load dealerships. Please refresh the page.")
      console.error("Error fetching dealerships:", err)
    } finally {
      setLoadingData(false)
    }
  }

  const fetchManufacturers = async (dealership: string) => {
    try {
      const response = await fetch(`${API_URL}/car_manufacturers?dealership=${encodeURIComponent(dealership)}`)
      if (!response.ok) throw new Error("Failed to fetch manufacturers")
      const data = await response.json()
      setManufacturers(data)
    } catch (err) {
      setError("Failed to load manufacturers for selected dealership.")
      console.error("Error fetching manufacturers:", err)
    }
  }

  const fetchCarModels = async (dealership: string, manufacturer: string) => {
    try {
      const response = await fetch(
        `${API_URL}/car_models?dealership=${encodeURIComponent(dealership)}&manufacturer=${encodeURIComponent(manufacturer)}`,
      )
      if (!response.ok) throw new Error("Failed to fetch car models")
      const data = await response.json()
      setCarModels(data)
    } catch (err) {
      setError("Failed to load car models for selected manufacturer.")
      console.error("Error fetching car models:", err)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateForm = (): string | null => {
    if (!formData.campaign_name.trim()) {
      return "Campaign name is required"
    }
    if (!formData.dealership) {
      return "Please select a dealership"
    }
    if (!formData.manufacturer) {
      return "Please select a manufacturer"
    }
    if (!formData.car_model) {
      return "Please select a car model"
    }
    if (!formData.generate_code && !formData.campaign_code.trim()) {
      return "Please enter a campaign code or enable auto-generation"
    }
    if (!formData.generate_code && !/^[A-Z0-9]{4,12}$/i.test(formData.campaign_code.trim())) {
      return "Campaign code must be 4-12 alphanumeric characters"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data: CampaignResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create campaign")
      }

      // Redirect to campaign dashboard immediately
      if (data.campaign?.campaign_id) {
        router.push(`/campaigns/dashboard?id=${data.campaign.campaign_id}`)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the campaign")
      console.error("Error creating campaign:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif font-light text-white mb-3 tracking-tight">Create AR Campaign</h1>
          <p className="text-white/70 text-lg">Set up a new augmented reality campaign for your dealership</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-serif font-light text-white">Campaign Details</CardTitle>
            <CardDescription className="text-white/60">
              Fill in the information below to create a new AR campaign. A unique link and QR code will be generated for
              customer access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Name */}
              <div className="space-y-2">
                <Label htmlFor="campaign_name" className="text-white/90 font-light">
                  Campaign Name *
                </Label>
                <Input
                  id="campaign_name"
                  placeholder="e.g., Summer 2024 Ferrari Promotion"
                  value={formData.campaign_name}
                  onChange={(e) => handleInputChange("campaign_name", e.target.value)}
                  disabled={loading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#d4af37] rounded-lg"
                />
              </div>

              {/* Dealership Selection */}
              <div className="space-y-2">
                <Label htmlFor="dealership" className="text-white/90 font-light">
                  Dealership *
                </Label>
                <Select
                  value={formData.dealership}
                  onValueChange={(value) => handleInputChange("dealership", value)}
                  disabled={loading || isDealershipFromUrl}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#d4af37] rounded-lg">
                    <SelectValue placeholder="Select dealership" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    {dealerships.map((dealership) => (
                      <SelectItem key={dealership} value={dealership} className="focus:bg-white/10 focus:text-white">
                        {dealership}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Manufacturer Selection */}
              <div className="space-y-2">
                <Label htmlFor="manufacturer" className="text-white/90 font-light">
                  Manufacturer *
                </Label>
                <Select
                  value={formData.manufacturer}
                  onValueChange={(value) => handleInputChange("manufacturer", value)}
                  disabled={loading || !formData.dealership || manufacturers.length === 0}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#d4af37] rounded-lg disabled:opacity-50">
                    <SelectValue
                      placeholder={
                        !formData.dealership
                          ? "Select dealership first"
                          : manufacturers.length === 0
                            ? "Loading manufacturers..."
                            : "Select manufacturer"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    {manufacturers.map((manufacturer) => (
                      <SelectItem
                        key={manufacturer}
                        value={manufacturer}
                        className="focus:bg-white/10 focus:text-white"
                      >
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Car Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="car_model" className="text-white/90 font-light">
                  Car Model *
                </Label>
                <Select
                  value={formData.car_model}
                  onValueChange={(value) => handleInputChange("car_model", value)}
                  disabled={loading || !formData.manufacturer || carModels.length === 0}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-[#d4af37] rounded-lg disabled:opacity-50">
                    <SelectValue
                      placeholder={
                        !formData.manufacturer
                          ? "Select manufacturer first"
                          : carModels.length === 0
                            ? "Loading models..."
                            : "Select car model"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    {carModels.map((model) => (
                      <SelectItem key={model} value={model} className="focus:bg-white/10 focus:text-white">
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Campaign Code */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="generate_code"
                    checked={formData.generate_code}
                    onCheckedChange={(checked) => handleInputChange("generate_code", checked as boolean)}
                    disabled={loading}
                    className="border-white/30 data-[state=checked]:bg-[#d4af37] data-[state=checked]:border-[#d4af37]"
                  />
                  <Label htmlFor="generate_code" className="cursor-pointer text-white/90 font-light">
                    Auto-generate campaign code
                  </Label>
                </div>

                {!formData.generate_code && (
                  <div className="space-y-2">
                    <Label htmlFor="campaign_code" className="text-white/90 font-light">
                      Custom Campaign Code
                    </Label>
                    <Input
                      id="campaign_code"
                      placeholder="e.g., FERRARI2024"
                      value={formData.campaign_code}
                      onChange={(e) => handleInputChange("campaign_code", e.target.value.toUpperCase())}
                      disabled={loading}
                      maxLength={12}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#d4af37] rounded-lg"
                    />
                    <p className="text-sm text-white/50">4-12 alphanumeric characters only</p>
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 backdrop-blur-lg">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-transparent border-2 border-[#d4af37] text-white hover:bg-[#d4af37]/15 px-6 py-6 rounded-xl font-medium transition-all text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Campaign...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
