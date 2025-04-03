"use client"

import type React from "react"

import "../appointment-styles.css"
import { useState } from "react"
import { API_URL } from "../variables"
import Image from "next/image";

interface ConfigItem {
    name: string
    label: string
    preview_image: string
    section: string
}

interface ConfigData {
    exterior: ConfigItem[]
    interior: ConfigItem[]
    verification_code: string
    manufacturer: string
    model_name: string
    dealership: string
    customer: CustomerData
    previous_configurations: string[]
}

interface CustomerData {
    first_name: string
    last_name: string
    email: string
    phone: string
}

const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default function ConfigurationForm() {
    const [code, setCode] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [configData, setConfigData] = useState<ConfigData | null>(null)
    const [activeTab, setActiveTab] = useState<"exterior" | "interior">("exterior")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (code.length !== 4) {
            setError("Please enter a valid 4-digit code")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_URL}/consumer-configurations?verification_code=${code}`)

            if (!response.ok) {
                throw new Error("Failed to fetch configuration data")
            }

            const data = await response.json()
            setConfigData(data)
        } catch (err) {
            setError("Error while fetch the configuration data. Please recheck your code and try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }


    if (!configData) {
        return (
            <div className="card">
                <div className="card-header">
                    <h2 className="card-title-center">Vehicle Configuration Verification</h2>
                    <p className="card-description-center">Enter your 4-digit verification code to view your configuration</p>
                </div>
                <div className="card-content">
                    <form onSubmit={handleSubmit} className="verification-form">
                        <div className="form-group-centered">
                            <input
                                type="text"
                                placeholder="Enter 4-digit code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                                className="code-input"
                                maxLength={4}
                            />

                            {error && <p className="error-message">{error}</p>}

                            <button type="submit" className="button button-primary button-full" disabled={isLoading || code.length !== 4}>
                                {isLoading ? "Loading..." : "View Configuration"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title-center">{configData.manufacturer} {configData.model_name}</h2>
            </div>

            <div className="card-content">
                <div className="customer-details-section">
                    <div className="details-container">
                        <div className="details-column">
                            <h3 className="details-title">Customer Information</h3>
                            <div className="details-content">
                                <p className="details-name">
                                    {configData.customer.first_name} {configData.customer.last_name}
                                </p>
                                <p className="details-contact">{configData.customer.email}</p>
                                <p className="details-contact">{configData.customer.phone}</p>
                            </div>
                        </div>
                        <div className="details-column">
                            <h3 className="details-title">Dealership</h3>
                            <div className="details-content">
                                <p className="details-dealership">{configData.dealership}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tabs-header">
                    <button
                        className={`tab-button ${activeTab === "exterior" ? "active" : ""}`}
                        onClick={() => setActiveTab("exterior")}
                    >
                        Exterior
                    </button>
                    <button
                        className={`tab-button ${activeTab === "interior" ? "active" : ""}`}
                        onClick={() => setActiveTab("interior")}
                    >
                        Interior
                    </button>
                </div>

                <div className="tabs-content">
                    {activeTab === "exterior" && (
                        <div className="tab-panel">
                            {configData.exterior.map((item, index) => (
                                <ConfigurationItem key={index} item={item} />
                            ))}
                        </div>
                    )}

                    {activeTab === "interior" && (
                        <div className="tab-panel">
                            {configData.interior.map((item, index) => (
                                <ConfigurationItem key={index} item={item} />
                            ))}
                        </div>
                    )}

                    {configData.previous_configurations && configData.previous_configurations.length > 0 && (
                        <div className="history-section">
                            <h3 className="history-title">Configuration History</h3>
                            <div className="history-list">
                                {configData.previous_configurations.map((dateString, index) => (
                                    <div key={index} className="history-item">
                                        <div className="history-date">{formatDate(dateString)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ConfigurationItem({ item }: { item: ConfigItem }) {
    return (
        <div className="config-item">
            <div className="config-item-image">
                <Image
                    alt="Configuration Preview"
                    src={`${API_URL}/config_images/${item.preview_image}`}
                    width={0}
                    height={0}
                    layout='responsive'
                    className="preview-image"
                />
            </div>
            <div className="config-item-content">
                <div className="config-item-info">
                    <h3 className="config-item-name">{item.name}</h3>
                </div>
                <div className="config-item-value">
                    <span>{item.label}</span>
                    {item.section && <div>{item.section}</div>}
                </div>
            </div>
        </div>
    )
}

