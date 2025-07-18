"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { Send } from "lucide-react"
import styles from "./car-details.module.css"

interface CarDetailsData {
    overview: {
        model_name: string
        description: string
        manufacturer: string
        artwork?: string
        usdz_model_source?: string
        trailer_video_source?: string
    }
    engine: {
        engine_overview: string
        max_power_kw_cv: string
        max_torque: string
        electric_engines?: string
        weight_to_power_ratio?: string
        transmission?: string
        generator?: string
        compression_ratio?: string
    }
    performance: {
        top_speed: string
        acceleration: number
    }
    design: {
        frame?: string
        body?: string
        length: number
        width: number
        height: number
        front_track?: number
        rear_track?: number
        wheelbase?: number
        brakes?: string
    }
    dynamics: {
        aerodynamics?: string
        dry_weight: number
        weight_distribution?: string
    }
}

interface CarDetailsTabProps {
    carDetailsData: CarDetailsData | null
    isLoading: boolean
    error: string | null
    searchQuery: string
    setSearchQuery: (query: string) => void
    aiResponse: string
    isSearching: boolean
    onSearch: () => void
}

export default function CarDetailsTab({
    carDetailsData,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    aiResponse,
    isSearching,
    onSearch,
}: CarDetailsTabProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    
    const sampleQuestions = [
        "What's the horsepower of this car?",
        "Is this car hybrid? How does the hybrid system work?",
        `How does it compare to the other "${carDetailsData?.overview.manufacturer || ""}" cars in the same category?`,
    ]

    // Utility function to auto-resize textarea
    const resizeTextarea = (textarea: HTMLTextAreaElement) => {
        textarea.style.height = "auto"
        textarea.style.height = textarea.scrollHeight + "px"
    }

    // Auto-resize when searchQuery changes programmatically (e.g., when clicking sample questions)
    useEffect(() => {
        if (textareaRef.current) {
            resizeTextarea(textareaRef.current)
        }
    }, [searchQuery])

    const handleQuestionClick = (question: string) => {
        setSearchQuery(question)
        // The useEffect will handle the auto-resize
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSearch()
        }
    }

    // Handle textarea changes and auto-resize
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSearchQuery(e.target.value)
        resizeTextarea(e.target)
    }

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingContent}>
                    <div className={styles.loadingSpinner}></div>
                    <h3 className={styles.loadingTitle}>Loading Car Details</h3>
                    <p className={styles.loadingText}>Fetching specifications and overview...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorContent}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h3 className={styles.errorTitle}>Unable to Load Car Details</h3>
                    <p className={styles.errorMessage}>{error}</p>
                    <p className={styles.errorHelp}>
                        Please try refreshing the page or contact us at{" "}
                        <a href="mailto:chimera.autos@gmail.com" className={styles.errorLink}>
                            chimera.autos@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        )
    }

    if (!carDetailsData) {
        return (
            <div className={styles.emptyContainer}>
                <div className={styles.emptyContent}>
                    <div className={styles.emptyIcon}>📋</div>
                    <h3 className={styles.emptyTitle}>No Car Details Available</h3>
                    <p className={styles.emptyText}>Car specifications and details are not available at this time.</p>
                </div>
            </div>
        )
    }

    const { overview, engine, performance, design, dynamics } = carDetailsData

    return (
        <div className={styles.carDetailsContainer}>
            {/* Search Section */}
            <div className={styles.searchSection}>
                <div className={styles.searchInputContainer}>
                    <div className={styles.searchInput}>
                        <textarea
                            ref={textareaRef}
                            placeholder={`✨ Ask anything about ${overview.manufacturer} ${overview.model_name} here...`}
                            value={searchQuery}
                            onChange={handleTextareaChange}
                            onKeyPress={handleKeyPress}
                            className={styles.searchField}
                            rows={1}
                        />
                        <button onClick={onSearch} disabled={!searchQuery.trim() || isSearching} className={styles.sendButton}>
                            <Send className={styles.sendIcon} />
                        </button>
                    </div>
                </div>

                {/* AI Response - moved above sample questions */}
                {(aiResponse || isSearching) && (
                    <div className={styles.aiResponseContainer}>
                        {isSearching ? (
                            <div className={styles.searchingIndicator}>
                                <div className={styles.searchingSpinner}></div>
                                <span>Searching...</span>
                            </div>
                        ) : (
                            <div className={styles.aiResponse}>
                                {aiResponse || "AI generated response from the search bar goes here..."}
                            </div>
                        )}
                    </div>
                )}

                {/* Sample Questions */}
                <div className={styles.sampleQuestions}>
                    {sampleQuestions.map((question, index) => (
                        <button key={index} onClick={() => handleQuestionClick(question)} className={styles.questionButton}>
                            {question}
                        </button>
                    ))}
                </div>
            </div>

            {/* Specifications Section */}
            <div className={styles.specificationsSection}>
                <h3 className={styles.sectionTitle}>Specifications</h3>
                <div className={styles.specsGrid}>
                    <div className={styles.specCard}>
                        <div className={styles.specValue}>{engine.engine_overview}</div>
                        <div className={styles.specLabel}>Engine</div>
                    </div>
                    <div className={styles.specCard}>
                        <div className={styles.specValue}>{engine.max_power_kw_cv}</div>
                        <div className={styles.specLabel}>Max Power KW/CV</div>
                    </div>
                    <div className={styles.specCard}>
                        <div className={styles.specValue}>{engine.max_torque}</div>
                        <div className={styles.specLabel}>Max Torque</div>
                    </div>
                    <div className={styles.specCard}>
                        <div className={styles.specValue}>{performance.top_speed}</div>
                        <div className={styles.specLabel}>Top Speed</div>
                    </div>
                    <div className={styles.specCard}>
                        <div className={styles.specValue}>{performance.acceleration}s</div>
                        <div className={styles.specLabel}>0-100 km/h</div>
                    </div>
                    <div className={styles.specCard}>
                        <div className={styles.specValue}>{dynamics.dry_weight} kg</div>
                        <div className={styles.specLabel}>Dry Weight</div>
                    </div>
                </div>
            </div>

            {/* Overview Section */}
            <div className={styles.overviewSection}>
                <h3 className={styles.sectionTitle}>Overview</h3>
                <div className={styles.overviewContent}>
                    <p className={styles.overviewText}>{overview.description}</p>
                </div>
            </div>
        </div>
    )
}
