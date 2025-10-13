"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Download, Smartphone, AlertTriangle, Play, Loader2 } from "lucide-react"
import HeaderBackButtonTitle from "../../components/HeaderBackButtonTitle"
import styles from "../ar-view.module.css"

export default function LamborghiniRevueltoARView() {
    const [isIOS, setIsIOS] = useState<boolean | null>(null)
    const [isARCapable, setIsARCapable] = useState<boolean | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Detect iOS device
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
        const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
        setIsIOS(isIOSDevice)

        // Check AR capability (iOS 11+ with A9 chip or newer)
        if (isIOSDevice) {
            // Simple AR capability check - in production, you'd want more sophisticated detection
            const isModernIOS = /OS (1[1-9]|[2-9][0-9])_/.test(userAgent)
            setIsARCapable(isModernIOS)
        } else {
            setIsARCapable(false)
        }
        
        setLoading(false)
    }, [])

    const handleDownloadAR = async () => {
        if (!isIOS) {
            setError("We currently do not support AR View on Android devices. Please use an iOS device (iPhone or iPad) to experience AR.")
            return
        }

        try {
            // Create a link to the API endpoint
            const link = document.createElement("a")
            link.href = "/api/lamborghini_revuelto"
            link.download = "lamborghini_revuelto.3d_model_source.usdz"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            setError("Failed to download AR model. Please try again.")
        }
    }

    // Show loading state
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <HeaderBackButtonTitle title="Lamborghini Revuelto AR" />
                    <main className={styles.main}>
                        <div className={styles.loadingContainer}>
                            <Loader2 className={styles.loadingIcon} />
                            <p>Loading your AR experience...</p>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <HeaderBackButtonTitle title="Lamborghini Revuelto AR" />
                <main className={styles.main}>
                    {/* Hero Section */}
                    <section className={styles.heroSection}>
                        <h1 className={styles.heroTitle}>
                            Lamborghini Revuelto
                        </h1>
                        <p className={styles.heroSubtitle}>In your world. At full scale.</p>

                        {/* Non-iOS Device Warning */}
                        {isIOS === false && (
                            <div className={styles.warningCard}>
                                <AlertTriangle className={styles.warningIcon} />
                                <div className={styles.warningContent}>
                                    <h3>Android Device Detected</h3>
                                    <p>
                                        We currently do not support AR View on Android devices. Please use an iOS device (iPhone or iPad) to experience AR.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* AR Capability Warning for iOS */}
                        {isIOS === true && isARCapable === false && (
                            <div className={styles.warningCard}>
                                <AlertTriangle className={styles.warningIcon} />
                                <div className={styles.warningContent}>
                                    <h3>Device Not AR Compatible</h3>
                                    <p>
                                        Your device may not support AR features. For the best experience, use an iPhone 6s or newer, or iPad
                                        (5th generation) or newer.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className={styles.warningCard}>
                                <AlertTriangle className={styles.warningIcon} />
                                <div className={styles.warningContent}>
                                    <h3>Error</h3>
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Download Button */}
                        <div className={styles.downloadSection}>
                            <button 
                                onClick={handleDownloadAR} 
                                className={styles.downloadButton}
                                disabled={isIOS === false}
                            >
                                <Download className={styles.downloadIcon} />
                                {isIOS === false ? "Not Available on Android" : "View in AR"}
                            </button>
                            <p className={styles.downloadNote}>
                                {isIOS ? "Tap to open in AR Quick Look" : "AR experience requires an iOS device"}
                            </p>
                        </div>
                    </section>

                    {/* AR Demo Section */}
                    <section className={styles.demoSection}>
                        <div className={styles.demoContainer}>
                            <a href="https://youtu.be/PZ_SiIFtEWY?si=hBTHJ_pheIgvMVW9" target="_blank">
                                <div className={styles.demoImageContainer}>
                                    <Image
                                        src="/ar-car-demo.png"
                                        alt="Lamborghini Revuelto in AR view on iPhone"
                                        width={400}
                                        height={600}
                                        className={styles.demoImage}
                                    />
                                    <div className={styles.playOverlay}>
                                        <div className={styles.playButton}>
                                            <Play className={styles.playIcon} />
                                        </div>
                                        <p className={styles.playText}>Watch AR Demo</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </section>

                    {/* AR Locations Section */}
                    <section className={styles.locationsSection}>
                        <h2 className={styles.sectionTitle}>Perfect places to view your Lamborghini Revuelto</h2>
                        <div className={styles.locationsList}>
                            <div className={styles.locationItem}>
                                <span className={styles.locationEmoji}>🏠</span>
                                <span className={styles.locationText}>Your home garage</span>
                            </div>
                            <div className={styles.locationDivider}>•</div>
                            <div className={styles.locationItem}>
                                <span className={styles.locationEmoji}>🛣️</span>
                                <span className={styles.locationText}>Nearby street</span>
                            </div>
                            <div className={styles.locationDivider}>•</div>
                            <div className={styles.locationItem}>
                                <span className={styles.locationEmoji}>🏢</span>
                                <span className={styles.locationText}>Office parking lot</span>
                            </div>
                            <div className={styles.locationDivider}>•</div>
                            <div className={styles.locationItem}>
                                <span className={styles.locationEmoji}>🌳</span>
                                <span className={styles.locationText}>Your driveway</span>
                            </div>
                        </div>
                    </section>

                    {/* Steps Section */}
                    <section className={styles.stepsSection}>
                        <h2 className={styles.sectionTitle}>Steps to view in AR</h2>
                        <div className={styles.stepsList}>
                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>1</div>
                                <div className={styles.stepContent}>
                                    <h3>Download the AR file</h3>
                                    <p>Click the "View in AR" button above to download the file</p>
                                </div>
                            </div>
                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>2</div>
                                <div className={styles.stepContent}>
                                    <h3>Open on your iOS device</h3>
                                    <p>Open the file on your iPhone or iPad</p>
                                </div>
                            </div>
                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>3</div>
                                <div className={styles.stepContent}>
                                    <h3>Launch AR Quick Look</h3>
                                    <p>AR Quick Look launches automatically</p>
                                </div>
                            </div>
                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>4</div>
                                <div className={styles.stepContent}>
                                    <h3>Select AR Mode</h3>
                                    <p>Select AR Mode to place your Lamborghini Revuelto in your real environment</p>
                                </div>
                            </div>
                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>5</div>
                                <div className={styles.stepContent}>
                                    <h3>Experience your car</h3>
                                    <p>Experience your Lamborghini Revuelto in full scale!</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Additional Info Section */}
                    <section className={styles.infoSection}>
                        <div className={styles.infoCard}>
                            <Smartphone className={styles.infoIcon} />
                            <div className={styles.infoContent}>
                                <h3>System Requirements</h3>
                                <p>
                                    AR Quick Look requires iOS 11 or later on iPhone 6s/6s Plus or newer, iPad (5th generation) or newer,
                                    iPad Air 2 or newer, or iPad Pro.
                                </p>
                                <a
                                    href="https://www.apple.com/augmented-reality/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.infoLink}
                                >
                                    Learn more about AR on Apple devices →
                                </a>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
