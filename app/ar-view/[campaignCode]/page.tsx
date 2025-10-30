"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Smartphone, AlertCircle, MapPin, Wifi, Monitor, Check, Loader2 } from "lucide-react"
import styles from "../ar-view.module.css"
import { API_URL } from "../../variables"

interface CampaignData {
  campaign_id: string
  campaign_name: string
  dealership: string
  car_model: string
  model_url: string
  qr_code_url: string
}

interface UserMetadata {
  // Device information
  platform?: string
  device_type?: string
  is_ar_compatible: boolean
  user_agent?: string

  // Network information
  client_ip?: string

  // Geolocation
  latitude?: number
  longitude?: number
  location_accuracy?: number
  location_error?: string

  // Browser capabilities
  screen_width?: number
  screen_height?: number
  viewport_width?: number
  viewport_height?: number
  pixel_ratio?: number
  color_depth?: number

  // Session
  session_id: string
  time_on_page?: number

  // Outcome
  success: boolean
  action: "redirect_to_ar" | "show_qr_code" | "error"
  error_message?: string

  // Additional metadata
  additional_metadata?: any
}

export default function CampaignARViewPage() {
  const params = useParams()
  const router = useRouter()
  const campaignCode = (params.campaignCode as string)?.toUpperCase()

  const [isIOS, setIsIOS] = useState<boolean | null>(null)
  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<Partial<UserMetadata>>({})
  const [isCollectingMetadata, setIsCollectingMetadata] = useState(true)
  const [metadataSteps, setMetadataSteps] = useState({
    device: false,
    location: false,
    screen: false,
  })

  const sessionIdRef = useRef<string>(
    typeof window !== "undefined" ? `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : ""
  )
  const pageLoadTimeRef = useRef<number>(Date.now())
  const hasLoggedRef = useRef(false)
  const hasRedirectedRef = useRef(false)

  // Collect device information
  useEffect(() => {
    if (typeof window === "undefined") return

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) || // iPad on iOS 13+
      /Vision/.test(userAgent) // Apple Vision Pro

    setIsIOS(isIOSDevice)

    const deviceMetadata = {
      user_agent: userAgent,
      platform: navigator.platform,
      device_type: isIOSDevice ? "iOS" : "Other",
      is_ar_compatible: isIOSDevice,
      session_id: sessionIdRef.current,
    }

    setMetadata((prev) => ({ ...prev, ...deviceMetadata }))
    setMetadataSteps((prev) => ({ ...prev, device: true }))
  }, [])

  // Collect screen information
  useEffect(() => {
    if (typeof window === "undefined") return

    const screenMetadata = {
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      pixel_ratio: window.devicePixelRatio,
      color_depth: window.screen.colorDepth,
    }

    setMetadata((prev) => ({ ...prev, ...screenMetadata }))
    setMetadataSteps((prev) => ({ ...prev, screen: true }))
  }, [])

  // Collect geolocation
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setMetadataSteps((prev) => ({ ...prev, location: true }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationMetadata = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          location_accuracy: position.coords.accuracy,
        }
        setMetadata((prev) => ({ ...prev, ...locationMetadata }))
        setMetadataSteps((prev) => ({ ...prev, location: true }))
      },
      (error) => {
        console.warn("Geolocation error:", error.message)
        setMetadata((prev) => ({ ...prev, location_error: error.message }))
        setMetadataSteps((prev) => ({ ...prev, location: true }))
      },
      {
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }, [])

  // Fetch campaign data
  useEffect(() => {
    if (!campaignCode) {
      setError("Invalid campaign code")
      setIsLoading(false)
      return
    }

    fetchCampaignData()
  }, [campaignCode])

  // Wait for metadata collection to complete, then proceed
  useEffect(() => {
    const allStepsComplete = metadataSteps.device && metadataSteps.location && metadataSteps.screen

    if (allStepsComplete) {
      setIsCollectingMetadata(false)
    }
  }, [metadataSteps])

  // Once metadata is collected and campaign is loaded, decide what to do
  useEffect(() => {
    if (isCollectingMetadata || isLoading || !campaign || hasRedirectedRef.current || hasLoggedRef.current) {
      return
    }

    handleARViewDecision()
  }, [isCollectingMetadata, isLoading, campaign, isIOS])

  const fetchCampaignData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/campaign/${campaignCode}`)

      if (!response.ok) {
        throw new Error(`Campaign not found or inactive`)
      }

      const data = await response.json()
      setCampaign(data.campaign)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch campaign data"
      setError(errorMessage)
      console.error("Error fetching campaign data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleARViewDecision = async () => {
    if (hasRedirectedRef.current || hasLoggedRef.current || !campaign) return

    const timeOnPage = Date.now() - pageLoadTimeRef.current

    if (isIOS && campaign.model_url) {
      // Device supports AR - redirect to USDZ model
      hasRedirectedRef.current = true

      const successMetadata: UserMetadata = {
        ...metadata,
        is_ar_compatible: true,
        success: true,
        action: "redirect_to_ar",
        time_on_page: timeOnPage,
        session_id: sessionIdRef.current,
      }

      await logCampaignAccess(successMetadata)

      // Redirect to the AR model
      window.location.href = campaign.model_url
    } else {
      // Device doesn't support AR - show QR code
      const failureMetadata: UserMetadata = {
        ...metadata,
        is_ar_compatible: false,
        success: false,
        action: "show_qr_code",
        time_on_page: timeOnPage,
        session_id: sessionIdRef.current,
      }

      await logCampaignAccess(failureMetadata)
    }
  }

  const logCampaignAccess = async (metadataToLog: UserMetadata) => {
    if (hasLoggedRef.current) return
    hasLoggedRef.current = true

    try {
      await fetch(`${API_URL}/campaign/${campaignCode}/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadataToLog),
      })
      console.log("Campaign access logged successfully")
    } catch (err) {
      console.error("Error logging campaign access:", err)
    }
  }

  const getCarName = (filename: string) => {
    // Convert filename like "lamborghini_revuelto_base.usdz" to "Lamborghini Revuelto"
    return filename
      .replace(/_base\.(usdz|reality)$/, "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Loading state while collecting metadata
  if (isCollectingMetadata || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <main>
            <section className={styles.heroSection}>
              <h1 className={styles.heroTitle}>Preparing your AR experience...</h1>

              <div className={styles.loadingCard}>
                <Loader2 className={styles.loadingSpinner} />
                <div className={styles.metadataSteps}>
                  <div className={styles.metadataStep}>
                    {metadataSteps.device ? (
                      <Check className={styles.stepComplete} />
                    ) : (
                      <Loader2 className={styles.stepLoading} />
                    )}
                    <span>Detecting device</span>
                  </div>
                  <div className={styles.metadataStep}>
                    {metadataSteps.screen ? (
                      <Check className={styles.stepComplete} />
                    ) : (
                      <Loader2 className={styles.stepLoading} />
                    )}
                    <span>Reading display info</span>
                  </div>
                  <div className={styles.metadataStep}>
                    {metadataSteps.location ? (
                      <Check className={styles.stepComplete} />
                    ) : (
                      <Loader2 className={styles.stepLoading} />
                    )}
                    <span>Getting location</span>
                  </div>
                  {isLoading && (
                    <div className={styles.metadataStep}>
                      <Loader2 className={styles.stepLoading} />
                      <span>Loading campaign</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !campaign) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <main>
            <section className={styles.heroSection}>
              <h1 className={styles.heroTitle}>AR Experience</h1>

              <div className={styles.errorCard}>
                <AlertCircle className={styles.errorIcon} />
                <div className={styles.errorContent}>
                  <h3>Campaign Not Found</h3>
                  <p>{error || "The campaign you're looking for doesn't exist or is no longer active."}</p>
                  <button
                    onClick={() => router.push("/")}
                    className={styles.homeButton}
                    style={{
                      marginTop: "1rem",
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "#007aff",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                  >
                    Go Home
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    )
  }

  // If iOS device, it should have redirected already. Show message.
  if (isIOS) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <main>
            <section className={styles.heroSection}>
              <h1 className={styles.heroTitle}>{campaign.campaign_name}</h1>

              <div className={styles.loadingCard}>
                <Loader2 className={styles.loadingSpinner} />
                <p>Redirecting to AR experience...</p>
                <p style={{ fontSize: "0.875rem", marginTop: "1rem", color: "#666" }}>
                  If you are not redirected automatically,{" "}
                  <a href={campaign.model_url} rel="ar" style={{ color: "#007aff", textDecoration: "underline" }}>
                    click here
                  </a>
                  .
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    )
  }

  // Non-iOS device - show QR code
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <main>
          <section className={styles.heroSection}>
            <h1 className={styles.heroTitle}>{campaign.campaign_name}</h1>
            <p className={styles.heroSubtitle}>{campaign.dealership}</p>

            <div className={styles.showcaseImageContainer}>
              <Image
                src="/gallery/29.png"
                alt="AR View showcase - how to use AR experience"
                width={600}
                height={400}
                className={styles.showcaseImage}
                priority
              />
            </div>

            <div className={styles.modelsGrid}>
              <div className={styles.modelCard}>
                <h3 className={styles.modelName}>{getCarName(campaign.car_model)}</h3>

                <div className={styles.qrContent}>
                  <p style={{ marginBottom: "1rem", fontSize: "0.95rem", color: "#666" }}>
                    Scan this QR code with your iPhone, iPad, or Apple Vision Pro to view in AR
                  </p>
                  <div className={styles.qrCodeContainer}>
                    <Image
                      src={campaign.qr_code_url || "/placeholder.svg"}
                      alt={`QR code for ${getCarName(campaign.car_model)}`}
                      width={300}
                      height={300}
                      className={styles.qrCode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className={styles.warningCard}>
            <Smartphone className={styles.warningIcon} />
            <div className={styles.warningContent}>
              <h3>iOS Device Required</h3>
              <p>
                This AR experience is currently only supported on iPhone, iPad, and Apple Vision Pro. Please scan the
                QR code above with your iOS device to continue.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

