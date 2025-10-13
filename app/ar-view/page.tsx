"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Download, Smartphone, AlertTriangle, Play, Loader2 } from "lucide-react"
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle"
import styles from "./ar-view.module.css"
import { API_URL } from "../variables"

interface CustomerData {
    customer_first_name: string
    customer_last_name: string
    car_manufacturer: string
    car_model: string
    download_url: string
    verification_code: string
    reality_filename: string
}

interface ARViewData {
    firstName: string
    lastName: string
    carManufacturer: string
    carModel: string
    downloadUrl: string
    filename: string
}

function ARViewContent() {
    const searchParams = useSearchParams()
    const [isIOS, setIsIOS] = useState<boolean | null>(null)
    const [isARCapable, setIsARCapable] = useState<boolean | null>(null)
    const [customerData, setCustomerData] = useState<ARViewData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showCodeEntry, setShowCodeEntry] = useState(false)
    const [codeInput, setCodeInput] = useState("")
    const [codeSubmitting, setCodeSubmitting] = useState(false)
    const [codeError, setCodeError] = useState<string | null>(null)

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
    }, [])

    useEffect(() => {
        const fetchCustomerData = async () => {
            const verificationCode = searchParams.get('code')
            
            if (!verificationCode) {
                setShowCodeEntry(true)
                setLoading(false)
                return
            }

            try {
                const response = await fetch(`${API_URL}/ar-view-details?verification_code=${verificationCode}`)
                const result = await response.json()

                if (!response.ok) {
                    // If it's a "not found" or "invalid code" error, show code entry
                    if (response.status === 404 || result.message?.includes('not found') || result.message?.includes('Appointment not found')) {
                        setShowCodeEntry(true)
                        setCodeError('Invalid verification code. Please try again.')
                    } else {
                        setError(result.message || 'Failed to fetch customer data')
                    }
                    setLoading(false)
                    return
                }

                if (result.success && result.data) {
                    setCustomerData({
                        firstName: result.data.customer_first_name,
                        lastName: result.data.customer_last_name,
                        carManufacturer: result.data.car_manufacturer,
                        carModel: result.data.car_model,
                        downloadUrl: result.data.download_url,
                        filename: result.data.reality_filename
                    })
                    setShowCodeEntry(false)
                } else {
                    throw new Error('Invalid response format')
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchCustomerData()
    }, [searchParams])

    const handleDownloadAR = () => {
        if (!customerData) return
        
        const link = document.createElement("a")
        link.href = customerData.downloadUrl
        link.download = customerData.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (codeInput.length !== 4) return

        setCodeSubmitting(true)
        setCodeError(null)

        try {
            const response = await fetch(`${API_URL}/ar-view-details?verification_code=${codeInput}`)
            const result = await response.json()

            if (!response.ok) {
                if (response.status === 404 || result.message?.includes('not found') || result.message?.includes('Appointment not found')) {
                    setCodeError('Invalid verification code. Please try again.')
                } else {
                    setCodeError(result.message || 'Failed to fetch customer data')
                }
                return
            }

            if (result.success && result.data) {
                const newCustomerData = {
                    firstName: result.data.customer_first_name,
                    lastName: result.data.customer_last_name,
                    carManufacturer: result.data.car_manufacturer,
                    carModel: result.data.car_model,
                    downloadUrl: result.data.download_url,
                    filename: result.data.reality_filename
                }
                
                // Update customer data and hide code entry
                setCustomerData(newCustomerData)
                setShowCodeEntry(false)
                setCodeError(null)
                
                // Update URL to include the code
                window.history.replaceState({}, '', `${window.location.pathname}?code=${codeInput}`)
                
                // Automatically start downloading the file
                const link = document.createElement("a")
                link.href = newCustomerData.downloadUrl
                link.download = newCustomerData.filename
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                setCodeError('Invalid response format')
            }
        } catch (err) {
            setCodeError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setCodeSubmitting(false)
        }
    }

    // Show loading state
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <HeaderBackButtonTitle title="AR Experience" />
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

    // Show error state
    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <HeaderBackButtonTitle title="AR Experience" />
                    <main className={styles.main}>
                        <div className={styles.errorContainer}>
                            <AlertTriangle className={styles.errorIcon} />
                            <h2>Unable to Load AR Experience</h2>
                            <p>{error}</p>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    // Render code entry form component
    const renderCodeEntryForm = () => (
        <div className={styles.codeEntrySection}>
            <form onSubmit={handleCodeSubmit} className={styles.verificationForm}>
                <div className={styles.formGroupCentered}>
                    <input
                        type="text"
                        placeholder="Enter 4-digit code"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                        className={styles.codeInput}
                        maxLength={4}
                    />
                    
                    <button
                        type="submit"
                        className={styles.codeSubmitButton}
                        disabled={codeSubmitting || codeInput.length !== 4}
                    >
                        {codeSubmitting ? (
                            "Downloading..."
                        ) : (
                            <>
                                <Download className={styles.downloadIcon} />
                                View in AR
                            </>
                        )}
                    </button>
                    
                    {codeError && <p className={styles.codeErrorMessage}>{codeError}</p>}
                </div>
            </form>
        </div>
    )

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <HeaderBackButtonTitle title="AR Experience" />
                <main className={styles.main}>
                    {/* Hero Section */}
                    <section className={styles.heroSection}>
                        <h1 className={styles.heroTitle}>
                            {customerData ? `${customerData.firstName}'s ${customerData.carManufacturer} ${customerData.carModel}` : "Your Unique Car"}
                        </h1>
                        <p className={styles.heroSubtitle}>In your world. At full scale.</p>

                        {/* AR Capability Warning */}
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

                        {/* Download Button or Code Entry */}
                        <div className={styles.downloadSection}>
                            {showCodeEntry ? (
                                <div className={styles.codeEntryContainer}>
                                    <p className={styles.codePrompt}>Enter your 4-digit verification code to access your AR experience</p>
                                    {renderCodeEntryForm()}
                                </div>
                            ) : (
                                <>
                                    <button onClick={handleDownloadAR} className={styles.downloadButton}>
                                        <Download className={styles.downloadIcon} />
                                        View in AR
                                    </button>
                                    <p className={styles.downloadNote}>{isIOS ? "Tap to open in AR Quick Look" : "Download AR model file"}</p>
                                </>
                            )}
                        </div>
                    </section>

                    {/* AR Demo Section */}
                    <section className={styles.demoSection}>
                        <div className={styles.demoContainer}>
                            <a href="https://youtu.be/PZ_SiIFtEWY?si=hBTHJ_pheIgvMVW9" target="_blank">
                                <div className={styles.demoImageContainer}>
                                    <Image
                                        src="/ar-car-demo.png"
                                        alt="Lamborghini Huracán in AR view on iPhone"
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
                        
                        {/* Demo AR Experience Link */}
                        <div className={styles.demoLinkContainer} style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <p style={{ marginBottom: '1rem', color: '#666' }}>Try our demo AR experience:</p>
                            <a 
                                href="/ar-view/lamborghini_revuelto" 
                                className={styles.downloadButton}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                            >
                                <Download className={styles.downloadIcon} />
                                Lamborghini Revuelto AR Demo
                            </a>
                        </div>
                    </section>

                    {/* AR Locations Section */}
                    <section className={styles.locationsSection}>
                        <h2 className={styles.sectionTitle}>Perfect places to view your {customerData ? `${customerData.carManufacturer} ${customerData.carModel}` : "custom car"}</h2>
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
                                    <p>Select AR Mode to place your {customerData ? customerData.carModel : "custom car"} in your real environment</p>
                                </div>
                            </div>
                            <div className={styles.stepItem}>
                                <div className={styles.stepNumber}>5</div>
                                <div className={styles.stepContent}>
                                    <h3>Experience your car</h3>
                                    <p>Experience your {customerData ? customerData.carModel : "custom car"} in full scale!</p>
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

function ARViewFallback() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <HeaderBackButtonTitle title="AR Experience" />
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

export default function ARViewPage() {
    return (
        <Suspense fallback={<ARViewFallback />}>
            <ARViewContent />
        </Suspense>
    )
}
