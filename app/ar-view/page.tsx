"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Smartphone, AlertCircle } from "lucide-react"
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle"
import styles from "./ar-view.module.css"
import { API_URL } from "../variables"

interface ARFile {
  filename: string
  size: number
  url: string
  qrCodeUrl: string
  qrCodeFilename: string
  created: string
  lastModified: string
}

interface ARData {
  files: ARFile[]
  count: number
}

export default function ARExperiencePage() {
  const [isIOS, setIsIOS] = useState<boolean | null>(null)
  const [arData, setArData] = useState<ARData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) || // iPad on iOS 13+
      /Vision/.test(userAgent) // Apple Vision Pro
    setIsIOS(isIOSDevice)

    // Fetch AR data
    fetchARData()
  }, [])

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

  const getCarName = (filename: string) => {
    // Convert filename like "lamborghini_revuelto_base.usdz" to "Lamborghini Revuelto"
    return filename
      .replace(/_base\.usdz$/, "")
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <HeaderBackButtonTitle title="AR Experience" />
        <main>
          {/* Hero Section */}
          <section className={styles.heroSection}>
            <h1 className={styles.heroTitle}>Experience in your world. At full scale.</h1>

            {/* Loading State */}
            {isLoading && (
              <div className={styles.loadingCard}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading AR experiences...</p>
              </div>
            )}

            {/* Error State */}
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
                {arData.files.map((file) => (
                  <div key={file.filename} className={styles.modelCard}>
                    <h3 className={styles.modelName}>{getCarName(file.filename)}</h3>

                    {isIOS && (
                      <div className={styles.iosContent}>
                        <a href={file.url} rel="ar" className={styles.arButton}>
                          <Smartphone className={styles.buttonIcon} />
                          View in AR
                        </a>
                      </div>
                    )}

                    {!isIOS && (
                      <div className={styles.qrContent}>
                        <div className={styles.qrCodeContainer}>
                          <Image
                            src={file.qrCodeUrl || "/placeholder.svg"}
                            alt={`QR code for ${getCarName(file.filename)}`}
                            width={200}
                            height={200}
                            className={styles.qrCode}
                          />
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
              <p>
                This AR experience is currently only supported on iPhone, iPad, and Apple Vision Pro. Please scan the QR
                codes above with your iOS device.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
