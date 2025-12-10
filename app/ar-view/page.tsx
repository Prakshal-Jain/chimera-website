"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Smartphone, AlertCircle, Loader2, Check } from "lucide-react"
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle"
import styles from "./ar-view.module.css"
import { API_URL } from "../variables"
import QRCode from "qrcode"
import { getDealershipLogo } from "../utils/dealerships"

interface ARFile {
  filename: string
  size: number
  s3Url?: string // Direct S3 URL for frontend access (primary)
  directS3Url?: string // Alias for s3Url (primary)
  apiUrl?: string // API endpoint to get fresh presigned URL
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
  manufacturer?: string // Manufacturer from database
  model?: string // Model from database
  model_url: string // Backend redirect URL (deprecated - use direct_s3_url instead)
  direct_s3_url?: string // Direct S3 URL for frontend access (primary)
  s3_url_api?: string // API endpoint to get fresh presigned URL
  qr_code_url: string
  cta_title?: string | null // CTA button label
  cta_url?: string | null // CTA button URL
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
  action: "redirect_to_ar" | "show_qr_code" | "error" | "page_load"
  error_message?: string
  additional_metadata?: any
  metadata_code?: string
}

function ARExperienceContent() {
  const searchParams = useSearchParams()
  const campaignCode = searchParams.get("campaign_code")?.toUpperCase()
  const metadataCode = searchParams.get("metadata")?.toUpperCase()

  // Extract all additional query parameters (excluding campaign_code and metadata)
  const additionalQueryParams = useRef<Record<string, string>>({})
  if (typeof window !== "undefined") {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      if (key !== "campaign_code" && key !== "metadata") {
        params[key] = value
      }
    })
    additionalQueryParams.current = params
  }

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
  const [dynamicQRCode, setDynamicQRCode] = useState<string | null>(null)
  const [isQRCodeGenerating, setIsQRCodeGenerating] = useState(false)
  const [minLoadTimeElapsed, setMinLoadTimeElapsed] = useState(false)
  const [persistentUserId, setPersistentUserId] = useState<string | null>(null)
  const [hasEngagementEnded, setHasEngagementEnded] = useState(false)

  const sessionIdRef = useRef<string>(
    typeof window !== "undefined" ? `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : ""
  )
  const pageLoadTimeRef = useRef<number>(Date.now())
  const hasLoggedRef = useRef(false)
  const hasRedirectedRef = useRef(false)
  const arEngagementStartTimeRef = useRef<number | null>(null)
  const arEngagementEndLoggedRef = useRef(false)
  
  // Extract cross-device tracking parameters
  const originSessionId = searchParams.get("origin_session") || undefined
  const originDevice = searchParams.get("origin_device") || undefined
  const qrScanned = !!originSessionId

  // Initialize or retrieve persistent user ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      let userId = localStorage.getItem("chimera_user_id")
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem("chimera_user_id", userId)
      }
      setPersistentUserId(userId)
    }
  }, [])

  // Recover incomplete AR sessions from localStorage
  useEffect(() => {
    if (typeof window === "undefined" || !persistentUserId) return

    try {
      const keysToRemove: string[] = []
      
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("ar_session_")) {
          try {
            const sessionData = JSON.parse(localStorage.getItem(key) || "{}")
            const age = Date.now() - sessionData.start_time
            
            // If session is > 5 minutes old, recover it
            if (age > 300000) {
              const estimatedDuration = Math.min(Math.floor(age / 1000), 300) // Cap at 5 min
              
              // Send recovery request to backend
              fetch(`${API_URL}/campaign/${sessionData.campaign_code}/ar-engagement/recover`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  session_id: sessionData.session_id,
                  persistent_user_id: persistentUserId,
                  start_time: sessionData.start_time,
                  estimated_duration: estimatedDuration,
                }),
              }).catch((err) => console.error("Error recovering AR session:", err))
              
              keysToRemove.push(key)
            }
          } catch (e) {
            // Invalid session data, remove it
            keysToRemove.push(key)
          }
        }
      })
      
      // Clean up recovered sessions
      keysToRemove.forEach((key) => localStorage.removeItem(key))
      
      // Also clean up old sessions (> 7 days)
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("ar_session_")) {
          try {
            const sessionData = JSON.parse(localStorage.getItem(key) || "{}")
            const age = Date.now() - sessionData.start_time
            if (age > 7 * 24 * 60 * 60 * 1000) {
              localStorage.removeItem(key)
            }
          } catch (e) {
            localStorage.removeItem(key)
          }
        }
      })
    } catch (error) {
      console.error("Error during AR session recovery:", error)
    }
  }, [persistentUserId])

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

  // Ensure minimum loading time of 3 seconds (campaign mode only)
  useEffect(() => {
    if (!campaignCode) {
      setMinLoadTimeElapsed(true)
      return
    }

    const timer = setTimeout(() => {
      setMinLoadTimeElapsed(true)
    }, 2000)

    return () => clearTimeout(timer)
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

  // Log page load after metadata collection and campaign data is ready
  useEffect(() => {
    if (!campaignCode || isCollectingMetadata || isLoading || !campaign || hasLoggedRef.current) {
      return
    }

    logPageLoad()
  }, [isCollectingMetadata, isLoading, campaign, campaignCode])

  // Track previous visibility state to detect transitions
  const wasHiddenRef = useRef<boolean>(false)

  // Page Visibility API - Track AR Quick Look engagement
  useEffect(() => {
    if (!campaignCode || !persistentUserId) return

    // Initialize wasHiddenRef with current state
    wasHiddenRef.current = document.hidden

    const handleVisibilityChange = async () => {
      // Detect transition from hidden to visible (user returned from AR)
      const becameVisible = wasHiddenRef.current && !document.hidden
      wasHiddenRef.current = document.hidden

      if (becameVisible) {
        // User returned from AR Quick Look
        const sessionKey = `ar_session_${sessionIdRef.current}`
        const sessionData = localStorage.getItem(sessionKey)
        
        // Use localStorage start_time or fallback to ref
        let startTime: number | null = null
        if (sessionData) {
          try {
            const data = JSON.parse(sessionData)
            startTime = data.start_time
          } catch (e) {
            console.error("Error parsing session data:", e)
          }
        }
        
        // Fallback to ref if localStorage doesn't have it
        if (!startTime && arEngagementStartTimeRef.current) {
          startTime = arEngagementStartTimeRef.current
        }

        // If we have a start time, it means user engaged with AR
        if (startTime && !arEngagementEndLoggedRef.current) {
          try {
            const duration = Math.floor((Date.now() - startTime) / 1000)
            
            // Only log if duration is reasonable (at least 1 second, max 1 hour)
            if (duration >= 1 && duration <= 3600) {
              // Prevent duplicate logging
              arEngagementEndLoggedRef.current = true
              
              // Send AR engagement end
              await fetch(`${API_URL}/campaign/${campaignCode}/ar-engagement/end`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  session_id: sessionIdRef.current,
                  persistent_user_id: persistentUserId,
                  duration_seconds: duration,
                }),
              })
              
              console.log(`✓ AR engagement completed: ${duration}s`)
            } else {
              console.warn(`AR engagement duration out of range: ${duration}s`)
            }
          } catch (err) {
            console.error("Error logging AR engagement end:", err)
            // Reset flag on error so it can be retried
            arEngagementEndLoggedRef.current = false
          } finally {
            // Mark engagement as ended to show CTA button (even if logging failed)
            setHasEngagementEnded(true)
            
            // Clear localStorage and ref
            if (sessionData) {
              localStorage.removeItem(sessionKey)
            }
            arEngagementStartTimeRef.current = null
          }
        } else if (startTime) {
          // Engagement already logged, but still mark as ended
          setHasEngagementEnded(true)
        }
      }
    }

    // Also handle page focus as a backup (for iOS Safari)
    const handleFocus = async () => {
      // Small delay to ensure visibility state is updated
      setTimeout(() => {
        if (!document.hidden) {
          handleVisibilityChange()
        }
      }, 100)
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleFocus)
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleFocus)
    }
  }, [campaignCode, persistentUserId])

  // Generate dynamic QR code with all metadata for campaign mode
  useEffect(() => {
    if (!campaignCode || !campaign || isIOS === null) return

    const generateDynamicQR = async () => {
      setIsQRCodeGenerating(true)
      try {
        // Build URL with all query parameters
        let qrUrl = `https://chimeraauto.com/ar-view?campaign_code=${campaignCode}`
        
        // Add metadata code if present
        if (metadataCode) {
          qrUrl += `&metadata=${metadataCode}`
        }
        
        // Add cross-device tracking parameters
        qrUrl += `&origin_session=${sessionIdRef.current}`
        qrUrl += `&origin_device=desktop`
        
        // Add any additional query parameters
        if (Object.keys(additionalQueryParams.current).length > 0) {
          Object.entries(additionalQueryParams.current).forEach(([key, value]) => {
            qrUrl += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          })
        }

        // Generate QR code as data URL
        const qrDataUrl = await QRCode.toDataURL(qrUrl, {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 512,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })

        setDynamicQRCode(qrDataUrl)
      } catch (err) {
        console.error('Error generating dynamic QR code:', err)
        // Fallback to backend QR code if dynamic generation fails
        setDynamicQRCode(null)
      } finally {
        setIsQRCodeGenerating(false)
      }
    }

    generateDynamicQR()
  }, [campaignCode, campaign, isIOS, metadataCode])

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

  const logPageLoad = async () => {
    if (hasLoggedRef.current || !campaign) return

    const timeOnPage = Date.now() - pageLoadTimeRef.current

    // Prepare additional metadata from query parameters
    const additionalMetadata = Object.keys(additionalQueryParams.current).length > 0 
      ? additionalQueryParams.current 
      : undefined

    const pageLoadMetadata: UserMetadata = {
      ...metadata,
      is_ar_compatible: isIOS || false,
      success: true,
      action: "page_load",
      time_on_page: timeOnPage,
      session_id: sessionIdRef.current,
      metadata_code: metadataCode || undefined,
      additional_metadata: additionalMetadata,
    }

    await logCampaignAccess(pageLoadMetadata)
  }

  const handleARButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!campaign || !campaignCode) return

    // Capture start time immediately when button is clicked
    const startTime = Date.now()
    
    // Set ref immediately (before API call)
    arEngagementStartTimeRef.current = startTime
    
    // Store AR session in localStorage before opening AR Quick Look
    const arSessionData = {
      session_id: sessionIdRef.current,
      persistent_user_id: persistentUserId,
      campaign_code: campaignCode,
      metadata_code: metadataCode,
      start_time: startTime,
      origin_session_id: originSessionId,
    }
    localStorage.setItem(`ar_session_${sessionIdRef.current}`, JSON.stringify(arSessionData))
    
    // Log AR engagement start (use keepalive to ensure request completes even if page navigates)
    fetch(`${API_URL}/campaign/${campaignCode}/ar-engagement/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionIdRef.current,
        persistent_user_id: persistentUserId,
        metadata_code: metadataCode,
        origin_session_id: originSessionId,
        origin_device: originDevice,
        qr_scanned: qrScanned,
      }),
      keepalive: true, // Important: keeps request alive even if page navigates/unloads
    }).catch((err) => {
      console.error("Error logging AR engagement start:", err)
    })
  }

  const logCampaignAccess = async (metadataToLog: UserMetadata) => {
    if (!campaignCode) return
    
    // Only prevent duplicate logging for page_load action
    // AR engagement start/end are tracked separately
    if (metadataToLog.action === "page_load" && hasLoggedRef.current) {
      return
    }
    
    if (metadataToLog.action === "page_load") {
      hasLoggedRef.current = true
    }

    try {
      await fetch(`${API_URL}/campaign/${campaignCode}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...metadataToLog,
          persistent_user_id: persistentUserId,
          origin_session_id: originSessionId,
          origin_device: originDevice,
          qr_scanned: qrScanned,
        }),
      })
    } catch (err) {
      console.error("Error logging campaign access:", err)
    }
  }

  const handleCTAClick = async () => {
    if (!campaignCode || !campaign || !campaign.cta_url) return

    try {
      await fetch(`${API_URL}/campaign/${campaignCode}/cta-click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          persistent_user_id: persistentUserId,
          cta_url: campaign.cta_url,
          cta_title: campaign.cta_title,
          timestamp: new Date().toISOString(),
        }),
        keepalive: true, // Keep request alive even if page navigates
      })
      console.log("✓ CTA click logged")
    } catch (err) {
      console.error("Error logging CTA click:", err)
    }
  }

  const getCarName = (filename: string) => {
    return filename
      .replace(/_base\.(usdz|reality)$/, "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Extract manufacturer and model from car_model or use database values
  const getManufacturerAndModel = (campaign: CampaignData) => {
    // If database has manufacturer and model, use them directly
    if (campaign.manufacturer && campaign.model) {
      return {
        manufacturer: campaign.manufacturer,
        model: campaign.model
      }
    }
    
    // Fallback: try to extract from car_model filename
    const carModel = campaign.car_model
    const manufacturer = campaign.manufacturer
    
    // If manufacturer is provided, use it
    if (manufacturer) {
      const cleanModel = carModel
        .replace(/_base\.(usdz|reality)$/, "")
        .replace(manufacturer.toLowerCase(), "")
        .replace(manufacturer, "")
        .trim()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      return { manufacturer, model: cleanModel || carModel }
    }
    
    // Try to extract from car_model (common patterns: "Lamborghini_Revuelto" or "Revuelto")
    const cleanModel = carModel.replace(/_base\.(usdz|reality)$/, "")
    const parts = cleanModel.split("_")
    
    // Common manufacturers to check
    const manufacturers = ["Lamborghini", "Ferrari", "Porsche", "McLaren", "Aston Martin", "Bentley", "Rolls Royce", "Mercedes", "BMW", "Audi"]
    
    // Check if first part is a manufacturer
    const firstPart = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
    if (manufacturers.includes(firstPart)) {
      return {
        manufacturer: firstPart,
        model: parts.slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
      }
    }
    
    // Fallback: return as model only
    return {
      manufacturer: "Luxury Vehicle",
      model: parts.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    }
  }


  // Campaign mode: Loading campaign data only (not blocking for metadata)
  if (campaignCode && (isLoading || !minLoadTimeElapsed)) {
    return (
      <div className={styles.loadingContainer}>
        <Link href="/" className={styles.chimeraLogoLink}>
          <Image 
            src="/chimera-logo.png" 
            alt="Chimera" 
            width={200} 
            height={67} 
            className={styles.chimeraLogo}
            priority
          />
        </Link>
        <div className={styles.loadingContent}>
          <div className={styles.loadingImageWrapper}>
            <Image 
              src="/ar-car-demo.png" 
              alt="AR Experience Preview" 
              width={800} 
              height={600} 
              className={styles.loadingDemoImage}
              priority
            />
            <div className={styles.imageOverlay} />
          </div>
          <div className={styles.loadingTextContainer}>
            <Loader2 className={styles.loadingSpinnerLuxury} />
            <h2 className={styles.loadingTitle}>Preparing Your AR Experience</h2>
            <p className={styles.loadingSubtitle}>Get ready to view your vehicle in augmented reality</p>
          </div>
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

  // Campaign mode: iOS AR button view
  if (campaignCode && campaign && isIOS) {
    const { manufacturer, model } = getManufacturerAndModel(campaign)
    
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Small logo on top */}
          <div className={styles.logoSection}>
            <Link href="/" className={styles.chimeraLogoLinkSmall}>
              <Image 
                src="/chimera-logo.png" 
                alt="Chimera" 
                width={120} 
                height={40} 
                className={styles.chimeraLogoSmall}
                priority
              />
            </Link>
            <h1 className={styles.viewInSpaceText}>
              View {manufacturer} {model} in your space
            </h1>
          </div>
          
          <main className={styles.mainContent}>
            <div className={styles.arExperienceLayout}>
              {/* Desktop: Image on left, Content on right */}
              {/* Mobile: Content first, Image below */}
              <div className={styles.arContentSection}>
                {/* AR Button / CTA Button - Centerpiece */}
                <div className={styles.arButtonContainer}>
                  {hasEngagementEnded ? (
                    // Show CTA button if engagement ended and CTA is available
                    <>
                      {campaign.cta_title && campaign.cta_url ? (
                        <a 
                          href={campaign.cta_url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.arButtonLarge}
                          onClick={handleCTAClick}
                        >
                          {campaign.cta_title}
                        </a>
                      ) : null}
                      
                      {/* Secondary button to reload AR */}
                      <button
                        onClick={() => window.location.reload()}
                        className={styles.arButtonSecondary}
                      >
                        See "{manufacturer} {model}" again in AR
                      </button>
                    </>
                  ) : (
                    // Show AR button before engagement
                    <>
                      {campaign.direct_s3_url ? (
                        <a 
                          href={campaign.direct_s3_url} 
                          rel="ar"
                          className={styles.arButtonLarge}
                          onClick={handleARButtonClick}
                        >
                          <img 
                            src="/ar-car-demo.png" 
                            alt="AR Experience Preview" 
                            style={{ display: 'none' }}
                            width="1"
                            height="1"
                          />
                          <Smartphone className={styles.buttonIconLarge} />
                          Click to View
                        </a>
                      ) : (
                        <div className={styles.errorCard}>
                          <AlertCircle className={styles.errorIcon} />
                          <p>AR model URL not available</p>
                        </div>
                      )}
                      
                      {/* Muted text below button */}
                      <p className={styles.arInstructionText}>
                        Go to an open space, like your Garage or Driveway.
                      </p>
                    </>
                  )}
                </div>
                
                {/* Image Section - Mobile: Below button, Desktop: On left (via CSS) */}
                <div className={styles.arImageSection}>
                  <Image 
                    src="/ar-car-demo.png" 
                    alt="AR Experience Preview" 
                    width={500} 
                    height={500} 
                    className={styles.arPreviewImage} 
                    priority 
                  />
                </div>
                
                {/* Dealership and Model Info */}
                <div className={styles.campaignInfo}>
                  <div className={styles.dealershipInfo}>
                    <Image 
                      src={getDealershipLogo(campaign.dealership)} 
                      alt={`${campaign.dealership} logo`} 
                      width={32} 
                      height={32} 
                      className={styles.dealershipLogoSmall}
                    />
                    <span className={styles.dealershipName}>{campaign.dealership}</span>
                  </div>
                  
                  <div className={styles.carModelInfo}>
                    <span className={styles.carModelLabel}>Model:</span>
                    <span className={styles.carModelValue}>{manufacturer} {model}</span>
                  </div>
                  
                  {/* Founder info - placeholder for now */}
                  <div className={styles.founderInfo}>
                    <p className={styles.founderText}>
                      Questions? Contact PJ (founder) directly at{" "}
                      <a href="tel:+17167300312" className={styles.founderPhone}>
                        (716) 730-0312
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Desktop: Image on left */}
              <div className={styles.arImageSectionDesktop}>
                <Image 
                  src="/ar-car-demo.png" 
                  alt="AR Experience Preview" 
                  width={500} 
                  height={500} 
                  className={styles.arPreviewImage} 
                  priority 
                />
              </div>
            </div>
          </main>
          
          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <Link href="/" className={styles.footerLogoLink}>
                <Image 
                  src="/chimera-logo.png" 
                  alt="Chimera" 
                  width={100} 
                  height={33} 
                  className={styles.footerLogo}
                />
              </Link>
              <a href="#contact" className={styles.footerContact}>
                Contact us
              </a>
            </div>
          </footer>
        </div>
      </div>
    )
  }

  // Campaign mode: Show QR code
  if (campaignCode && campaign) {
    const { manufacturer, model } = getManufacturerAndModel(campaign)
    
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Small logo on top */}
          <div className={styles.logoSection}>
            <Link href="/" className={styles.chimeraLogoLinkSmall}>
              <Image 
                src="/chimera-logo.png" 
                alt="Chimera" 
                width={120} 
                height={40} 
                className={styles.chimeraLogoSmall}
                priority
              />
            </Link>
            <h1 className={styles.viewInSpaceText}>
              View {manufacturer} {model} in your space
            </h1>
          </div>
          
          <main className={styles.mainContent}>
            <div className={styles.arExperienceLayout}>
              {/* Desktop: Image on left, Content on right */}
              {/* Mobile: Content first, Image below */}
              <div className={styles.arContentSection}>
                {/* QR Code Section */}
                <div className={styles.qrCodeSection}>
                  <h4 className={styles.qrCodeTitle}>
                    Scan this QR code with your iPhone, iPad, or Apple Vision Pro to view in AR
                  </h4>
                  <div className={styles.qrCodeContainer}>
                    {isQRCodeGenerating || isCollectingMetadata ? (
                      <div className={styles.qrLoading}>
                        <Loader2 className={styles.loadingSpinner} style={{ width: '48px', height: '48px', color: '#d4af37' }} />
                        <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '1rem' }}>
                          {isCollectingMetadata ? 'Preparing personalized QR code...' : 'Generating QR code...'}
                        </p>
                      </div>
                    ) : dynamicQRCode ? (
                      <Image src={dynamicQRCode} alt={`QR code for ${manufacturer} ${model}`} width={280} height={280} className={styles.qrCode} />
                    ) : (
                      <Image src={campaign.qr_code_url} alt={`QR code for ${manufacturer} ${model}`} width={280} height={280} className={styles.qrCode} />
                    )}
                  </div>
                  
                  {/* Muted text below QR code */}
                  <p className={styles.arInstructionText}>
                    Go to an open space, like your Garage or Driveway.
                  </p>
                </div>
                
                {/* iOS Device Warning - Right below QR code */}
                <div className={styles.warningCard}>
                  <Smartphone className={styles.warningIcon} />
                  <div className={styles.warningContent}>
                    <h3>iOS Device Required</h3>
                    <p>This AR experience is currently only supported on iPhone, iPad, and Apple Vision Pro.</p>
                  </div>
                </div>
                
                {/* Image Section - Mobile: Below warning, Desktop: On left (via CSS) */}
                <div className={styles.arImageSection}>
                  <Image 
                    src="/ar-car-demo.png" 
                    alt="AR Experience Preview" 
                    width={500} 
                    height={500} 
                    className={styles.arPreviewImage} 
                    priority 
                  />
                </div>
                
                {/* Dealership and Model Info */}
                <div className={styles.campaignInfo}>
                  <div className={styles.dealershipInfo}>
                    <Image 
                      src={getDealershipLogo(campaign.dealership)} 
                      alt={`${campaign.dealership} logo`} 
                      width={32} 
                      height={32} 
                      className={styles.dealershipLogoSmall}
                    />
                    <span className={styles.dealershipName}>{campaign.dealership}</span>
                  </div>
                  
                  <div className={styles.carModelInfo}>
                    <span className={styles.carModelLabel}>Model:</span>
                    <span className={styles.carModelValue}>{manufacturer} {model}</span>
                  </div>
                  
                  {/* Founder info - placeholder for now */}
                  <div className={styles.founderInfo}>
                    <p className={styles.founderText}>
                      Questions? Contact PJ (our founder) directly at{" "}
                      <a href="tel:+7167300312" className={styles.founderPhone}>
                        (716) 730-0312
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Desktop: Image on left */}
              <div className={styles.arImageSectionDesktop}>
                <Image 
                  src="/ar-car-demo.png" 
                  alt="AR Experience Preview" 
                  width={500} 
                  height={500} 
                  className={styles.arPreviewImage} 
                  priority 
                />
              </div>
            </div>
          </main>
          
          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <Link href="/" className={styles.footerLogoLink}>
                <Image 
                  src="/chimera-logo.png" 
                  alt="Chimera" 
                  width={100} 
                  height={33} 
                  className={styles.footerLogo}
                />
              </Link>
              <a href="#contact" className={styles.footerContact}>
                Contact us
              </a>
            </div>
          </footer>
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
                        {/* Use S3 URL directly from S3 bucket */}
                        {(file.s3Url || file.directS3Url) ? (
                          <a href={file.s3Url || file.directS3Url} rel="ar" className={styles.arButton}>
                            <Smartphone className={styles.buttonIcon} />
                            View in AR
                          </a>
                        ) : (
                          <div className={styles.errorCard}>
                            <AlertCircle className={styles.errorIcon} />
                            <p>AR model URL not available</p>
                          </div>
                        )}
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

