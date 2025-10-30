"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { Smartphone, AlertCircle, Loader2, Check } from "lucide-react"
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle"
import styles from "./ar-view.module.css"
import { API_URL } from "../variables"

interface ARFile {
  filename: string
  size: number
  url: string
  qrCodeUrl: string
  qrCodeFilename: string
  campaignCode?: string | null
  created: string
  lastModified: string
}

interface ARData {
  files: ARFile[]
  count: number
}

interface CampaignData {
  campaign_id: string
  campaign_name: string
  dealership: string
  car_model: string
  model_url: string
  qr_code_url: string
}

interface UserMetadata {
  platform?: string
  device_type?: string
  is_ar_compatible: boolean
  user_agent?: string
  latitude?: number
  longitude?: number
  location_accuracy?: number
  city?: string
  region?: string
  country?: string
  postal?: string
  location_error?: string
  screen_width?: number
  screen_height?: number
  viewport_width?: number
  viewport_height?: number
  pixel_ratio?: number
  color_depth?: number
  session_id: string
  time_on_page?: number
  success: boolean
  action: "redirect_to_ar" | "show_qr_code" | "error"
  error_message?: string
  additional_metadata?: any
}

function ARExperienceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const campaignCode = searchParams.get("campaign_code")?.toUpperCase()

  const [isIOS, setIsIOS] = useState<boolean | null>(null)
  const [arData, setArData] = useState<ARData | null>(null)
  const [campaign, setCampaign] = useState<CampaignData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<Partial<UserMetadata>>({})
  const [isCollectingMetadata, setIsCollectingMetadata] = useState(!!campaignCode)
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

  // Detect iOS device
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
      /Vision/.test(userAgent)
    setIsIOS(isIOSDevice)

    if (campaignCode) {
      const deviceMetadata = {
        user_agent: userAgent,
        platform: navigator.platform,
        device_type: isIOSDevice ? "iOS" : "Other",
        is_ar_compatible: isIOSDevice,
        session_id: sessionIdRef.current,
      }
      setMetadata((prev) => ({ ...prev, ...deviceMetadata }))
      setMetadataSteps((prev) => ({ ...prev, device: true }))
    }
  }, [campaignCode])

  // Collect screen information (campaign mode only)
  useEffect(() => {
    if (!campaignCode) return

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
  }, [campaignCode])

  // Collect approximate geolocation via IP (campaign mode only)
  useEffect(() => {
    if (!campaignCode) return

    // Get approximate location from IP address - no user permission needed
    const fetchApproxLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        if (response.ok) {
          const data = await response.json()
          setMetadata((prev) => ({
            ...prev,
            latitude: data.latitude,
            longitude: data.longitude,
            location_accuracy: data.accuracy || 5000, // IP-based is typically 5-10km accuracy
            city: data.city,
            region: data.region,
            country: data.country_name,
            postal: data.postal,
          }))
        } else {
          setMetadata((prev) => ({ ...prev, location_error: 'IP geolocation service unavailable' }))
        }
      } catch (error) {
        setMetadata((prev) => ({ ...prev, location_error: 'Failed to get approximate location' }))
      } finally {
        setMetadataSteps((prev) => ({ ...prev, location: true }))
      }
    }

    fetchApproxLocation()
  }, [campaignCode])

  // Fetch data based on mode
  useEffect(() => {
    if (campaignCode) {
      fetchCampaignData()
    } else {
      fetchARData()
    }
  }, [campaignCode])

  // Wait for metadata collection (campaign mode only)
  useEffect(() => {
    if (!campaignCode) return

    const allStepsComplete = metadataSteps.device && metadataSteps.location && metadataSteps.screen
    if (allStepsComplete) {
      setIsCollectingMetadata(false)
    }
  }, [metadataSteps, campaignCode])

  // Handle campaign AR decision
  useEffect(() => {
    if (!campaignCode || isCollectingMetadata || isLoading || !campaign || hasRedirectedRef.current || hasLoggedRef.current) {
      return
    }

    handleARViewDecision()
  }, [isCollectingMetadata, isLoading, campaign, isIOS, campaignCode])

  const fetchARData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/ar-view/`)
      if (!response.ok) {
        throw new Error(`Failed to fetch AR data: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      setArData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch AR data"
      setError(errorMessage)
      console.error("Error fetching AR data:", err)
    } finally {
      setIsLoading(false)
    }
  }

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
      window.location.href = campaign.model_url
    } else {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadataToLog),
      })
    } catch (err) {
      console.error("Error logging campaign access:", err)
    }
  }

  const getCarName = (filename: string) => {
    return filename
      .replace(/_base\.(usdz|reality)$/, "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Campaign mode: Loading metadata
  if (campaignCode && (isCollectingMetadata || isLoading)) {
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
                    {metadataSteps.device ? <Check className={styles.stepComplete} /> : <Loader2 className={styles.stepLoading} />}
                    <span>Detecting device</span>
                  </div>
                  <div className={styles.metadataStep}>
                    {metadataSteps.screen ? <Check className={styles.stepComplete} /> : <Loader2 className={styles.stepLoading} />}
                    <span>Reading display info</span>
                  </div>
                  <div className={styles.metadataStep}>
                    {metadataSteps.location ? <Check className={styles.stepComplete} /> : <Loader2 className={styles.stepLoading} />}
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

  // Campaign mode: Error
  if (campaignCode && (error || !campaign)) {
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
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    )
  }

  // Campaign mode: iOS redirect message
  if (campaignCode && campaign && isIOS) {
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
                  If you are not redirected,{" "}
                  <a href={campaign.model_url} rel="ar" style={{ color: "#007aff", textDecoration: "underline" }}>
                    click here
                  </a>
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    )
  }

  // Campaign mode: Show QR code
  if (campaignCode && campaign) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <main>
            <section className={styles.heroSection}>
              <h1 className={styles.heroTitle}>{campaign.campaign_name}</h1>
              <p className={styles.heroSubtitle}>{campaign.dealership}</p>
              <div className={styles.showcaseImageContainer}>
                <Image src="/gallery/29.png" alt="AR View showcase" width={600} height={400} className={styles.showcaseImage} priority />
              </div>
              <div className={styles.modelsGrid}>
                <div className={styles.modelCard}>
                  <h3 className={styles.modelName}>{getCarName(campaign.car_model)}</h3>
                  <div className={styles.qrContent}>
                    <p style={{ marginBottom: "1rem", fontSize: "0.95rem", color: "#666" }}>
                      Scan this QR code with your iPhone, iPad, or Apple Vision Pro to view in AR
                    </p>
                    <div className={styles.qrCodeContainer}>
                      <Image src={campaign.qr_code_url} alt={`QR code for ${getCarName(campaign.car_model)}`} width={300} height={300} className={styles.qrCode} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className={styles.warningCard}>
              <Smartphone className={styles.warningIcon} />
              <div className={styles.warningContent}>
                <h3>iOS Device Required</h3>
                <p>This AR experience is currently only supported on iPhone, iPad, and Apple Vision Pro.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Regular AR view mode
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <HeaderBackButtonTitle title="AR Experience" />
        <main>
          <section className={styles.heroSection}>
            <h1 className={styles.heroTitle}>Experience in your world. At full scale.</h1>

            {isLoading && (
              <div className={styles.loadingCard}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading AR experiences...</p>
              </div>
            )}

            {error && (
              <div className={styles.errorCard}>
                <AlertCircle className={styles.errorIcon} />
                <div className={styles.errorContent}>
                  <h3>Unable to Load AR Data</h3>
                  <p>{error}</p>
                </div>
              </div>
            )}
          </section>

          {!isLoading && !error && arData && arData.files.length > 0 && (
            <section>
              <div className={styles.showcaseImageContainer}>
                <Image src="/gallery/29.png" alt="AR View showcase" width={600} height={400} className={styles.showcaseImage} priority />
              </div>

              <div className={styles.modelsGrid}>
                {arData.files.map((file) => (
                  <div key={file.filename} className={styles.modelCard}>
                    <h3 className={styles.modelName}>{getCarName(file.filename)}</h3>

                    {isIOS && (
                      <div className={styles.iosContent}>
                        {/* Use campaign URL if available, otherwise direct USDZ link */}
                        <a href={file.url} rel={file.campaignCode ? undefined : "ar"} className={styles.arButton}>
                          <Smartphone className={styles.buttonIcon} />
                          View in AR
                        </a>
                      </div>
                    )}

                    {!isIOS && (
                      <div className={styles.qrContent}>
                        <div className={styles.qrCodeContainer}>
                          <Image src={file.qrCodeUrl || "/placeholder.svg"} alt={`QR code for ${getCarName(file.filename)}`} width={200} height={200} className={styles.qrCode} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {!isLoading && !error && isIOS === false && (
          <div className={styles.warningCard}>
            <Smartphone className={styles.warningIcon} />
            <div className={styles.warningContent}>
              <h3>iOS Device Required</h3>
              <p>This AR experience is currently only supported on iPhone, iPad, and Apple Vision Pro. Please scan the QR codes above with your iOS device.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ARExperiencePage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.content}>
            <main>
              <section className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Loading...</h1>
                <div className={styles.loadingCard}>
                  <Loader2 className={styles.loadingSpinner} />
                </div>
              </section>
            </main>
          </div>
        </div>
      }
    >
      <ARExperienceContent />
    </Suspense>
  )
}
