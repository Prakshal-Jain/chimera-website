"use client"

import { useState, useEffect } from "react"
import { Plus, Users, QrCode, BarChart3, Download, Trash2, Upload, X } from "lucide-react"
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle"
import styles from "./campaign-manager.module.css"
import { API_URL } from "../variables"

interface Campaign {
  campaign_id: string
  campaign_name: string
  dealership: string
  car_model: string
  active: boolean
  created_at: string
}

interface CustomerMetadata {
  metadata_code: string
  metadata_type: string
  metadata_value: string
  campaign_url: string
  created_at: string
  last_accessed_at: string | null
  access_count: number
}

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [customers, setCustomers] = useState<CustomerMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [showCampaignForm, setShowCampaignForm] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)

  // Campaign form data
  const [campaignForm, setCampaignForm] = useState({
    campaign_id: "",
    campaign_name: "",
    dealership: "",
    car_model: "",
  })

  // Customer form data
  const [customerForm, setCustomerForm] = useState({
    metadata_value: "",
    metadata_type: "email",
  })

  // Bulk import data
  const [bulkCustomers, setBulkCustomers] = useState("")

  useEffect(() => {
    fetchCampaigns()
  }, [])

  useEffect(() => {
    if (selectedCampaign) {
      fetchCustomers(selectedCampaign)
    }
  }, [selectedCampaign])

  const fetchCampaigns = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/campaigns`)
      if (!response.ok) throw new Error("Failed to fetch campaigns")
      const data = await response.json()
      setCampaigns(data.campaigns || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch campaigns")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCustomers = async (campaignCode: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/campaign/${campaignCode}/metadata`)
      if (!response.ok) throw new Error("Failed to fetch customers")
      const data = await response.json()
      setCustomers(data.metadata || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch customers")
      setCustomers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${API_URL}/campaigns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignForm),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create campaign")
      }

      const data = await response.json()
      setSuccess(`Campaign "${campaignForm.campaign_name}" created successfully!`)
      setCampaignForm({ campaign_id: "", campaign_name: "", dealership: "", car_model: "" })
      setShowCampaignForm(false)
      fetchCampaigns()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCampaign) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${API_URL}/campaign/${selectedCampaign}/metadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerForm),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add customer")
      }

      const data = await response.json()
      setSuccess(`Customer added! Code: ${data.metadata_code}`)
      setCustomerForm({ metadata_value: "", metadata_type: "email" })
      setShowCustomerForm(false)
      fetchCustomers(selectedCampaign)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add customer")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCampaign) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Parse CSV/text input
      const lines = bulkCustomers.split("\n").filter((line) => line.trim())
      const customersData = lines.map((line) => {
        const parts = line.split(",").map((p) => p.trim())
        return {
          metadata_value: parts[0],
          metadata_type: parts[1] || "email",
        }
      })

      const response = await fetch(`${API_URL}/campaign/${selectedCampaign}/metadata/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customers: customersData }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to import customers")
      }

      const data = await response.json()
      const successCount = data.results.filter((r: any) => r.success).length
      setSuccess(`Imported ${successCount}/${lines.length} customers successfully!`)
      setBulkCustomers("")
      setShowBulkImport(false)
      fetchCustomers(selectedCampaign)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import customers")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportCSV = () => {
    if (customers.length === 0) return

    const csv = [
      "Metadata Value,Type,Code,Campaign URL,Created,Last Accessed,Access Count",
      ...customers.map((c) =>
        [
          c.metadata_value,
          c.metadata_type,
          c.metadata_code,
          c.campaign_url,
          new Date(c.created_at).toLocaleDateString(),
          c.last_accessed_at ? new Date(c.last_accessed_at).toLocaleDateString() : "Never",
          c.access_count,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedCampaign}_customers.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadQR = async (metadataCode: string, customerValue: string) => {
    try {
      const response = await fetch(`${API_URL}/campaign/${selectedCampaign}/qr?metadata=${metadataCode}`)
      if (!response.ok) throw new Error("Failed to download QR code")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `QR_${selectedCampaign}_${metadataCode}.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError("Failed to download QR code")
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <HeaderBackButtonTitle title="Campaign Manager" />

        <main className={styles.main}>
          {/* Notifications */}
          {error && (
            <div className={styles.notification} data-type="error">
              {error}
              <button onClick={() => setError(null)} className={styles.closeBtn}>
                <X size={16} />
              </button>
            </div>
          )}
          {success && (
            <div className={styles.notification} data-type="success">
              {success}
              <button onClick={() => setSuccess(null)} className={styles.closeBtn}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* Campaign Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Campaigns</h2>
              <button onClick={() => setShowCampaignForm(!showCampaignForm)} className={styles.primaryBtn}>
                <Plus size={18} />
                New Campaign
              </button>
            </div>

            {showCampaignForm && (
              <form onSubmit={handleCreateCampaign} className={styles.form}>
                <h3>Create New Campaign</h3>
                <div className={styles.formGroup}>
                  <label htmlFor="campaign_id">Campaign Code *</label>
                  <input
                    type="text"
                    id="campaign_id"
                    value={campaignForm.campaign_id}
                    onChange={(e) => setCampaignForm({ ...campaignForm, campaign_id: e.target.value.toUpperCase() })}
                    placeholder="e.g., FRM110725"
                    required
                  />
                  <small>Unique identifier (e.g., FRM110725)</small>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="campaign_name">Campaign Name *</label>
                  <input
                    type="text"
                    id="campaign_name"
                    value={campaignForm.campaign_name}
                    onChange={(e) => setCampaignForm({ ...campaignForm, campaign_name: e.target.value })}
                    placeholder="e.g., Ferrari Amalfi Launch"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="dealership">Dealership *</label>
                  <input
                    type="text"
                    id="dealership"
                    value={campaignForm.dealership}
                    onChange={(e) => setCampaignForm({ ...campaignForm, dealership: e.target.value })}
                    placeholder="e.g., Ferrari Beverly Hills"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="car_model">Car Model File *</label>
                  <input
                    type="text"
                    id="car_model"
                    value={campaignForm.car_model}
                    onChange={(e) => setCampaignForm({ ...campaignForm, car_model: e.target.value })}
                    placeholder="e.g., ferrari_amalfi.usdz"
                    required
                  />
                  <small>3D model filename from assets folder</small>
                </div>

                <div className={styles.formActions}>
                  <button type="button" onClick={() => setShowCampaignForm(false)} className={styles.secondaryBtn}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isLoading} className={styles.primaryBtn}>
                    {isLoading ? "Creating..." : "Create Campaign"}
                  </button>
                </div>
              </form>
            )}

            <div className={styles.campaignGrid}>
              {campaigns.map((campaign) => (
                <div
                  key={campaign.campaign_id}
                  className={`${styles.campaignCard} ${selectedCampaign === campaign.campaign_id ? styles.selected : ""}`}
                  onClick={() => setSelectedCampaign(campaign.campaign_id)}
                >
                  <div className={styles.campaignHeader}>
                    <h3>{campaign.campaign_name}</h3>
                    <span className={`${styles.badge} ${campaign.active ? styles.active : styles.inactive}`}>
                      {campaign.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className={styles.campaignCode}>{campaign.campaign_id}</p>
                  <p className={styles.campaignDetail}>{campaign.dealership}</p>
                  <p className={styles.campaignDetail}>{campaign.car_model}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Customer Management Section */}
          {selectedCampaign && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>
                  <Users size={24} />
                  Customer Metadata - {selectedCampaign}
                </h2>
                <div className={styles.actionGroup}>
                  <button onClick={() => setShowCustomerForm(!showCustomerForm)} className={styles.primaryBtn}>
                    <Plus size={18} />
                    Add Customer
                  </button>
                  <button onClick={() => setShowBulkImport(!showBulkImport)} className={styles.secondaryBtn}>
                    <Upload size={18} />
                    Bulk Import
                  </button>
                  <button onClick={handleExportCSV} className={styles.secondaryBtn} disabled={customers.length === 0}>
                    <Download size={18} />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Add Single Customer Form */}
              {showCustomerForm && (
                <form onSubmit={handleAddCustomer} className={styles.form}>
                  <h3>Add Customer</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="metadata_value">Customer Information *</label>
                      <input
                        type="text"
                        id="metadata_value"
                        value={customerForm.metadata_value}
                        onChange={(e) => setCustomerForm({ ...customerForm, metadata_value: e.target.value })}
                        placeholder="e.g., john@example.com or +1234567890"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="metadata_type">Type *</label>
                      <select
                        id="metadata_type"
                        value={customerForm.metadata_type}
                        onChange={(e) => setCustomerForm({ ...customerForm, metadata_type: e.target.value })}
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="customer_id">Customer ID</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button type="button" onClick={() => setShowCustomerForm(false)} className={styles.secondaryBtn}>
                      Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className={styles.primaryBtn}>
                      {isLoading ? "Adding..." : "Add Customer"}
                    </button>
                  </div>
                </form>
              )}

              {/* Bulk Import Form */}
              {showBulkImport && (
                <form onSubmit={handleBulkImport} className={styles.form}>
                  <h3>Bulk Import Customers</h3>
                  <div className={styles.formGroup}>
                    <label htmlFor="bulk_customers">Customer Data</label>
                    <textarea
                      id="bulk_customers"
                      value={bulkCustomers}
                      onChange={(e) => setBulkCustomers(e.target.value)}
                      placeholder="Enter one customer per line:&#10;john@example.com,email&#10;jane@example.com,email&#10;+1234567890,phone"
                      rows={10}
                      required
                    />
                    <small>Format: value,type (one per line). Type is optional, defaults to email.</small>
                  </div>

                  <div className={styles.formActions}>
                    <button type="button" onClick={() => setShowBulkImport(false)} className={styles.secondaryBtn}>
                      Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className={styles.primaryBtn}>
                      {isLoading ? "Importing..." : "Import Customers"}
                    </button>
                  </div>
                </form>
              )}

              {/* Customer List */}
              <div className={styles.customerList}>
                <div className={styles.listHeader}>
                  <span>Customer Info</span>
                  <span>Type</span>
                  <span>Code</span>
                  <span>Accessed</span>
                  <span>Actions</span>
                </div>

                {customers.length === 0 ? (
                  <div className={styles.emptyState}>
                    <Users size={48} />
                    <p>No customers added yet</p>
                    <p className={styles.emptyHint}>Add customers to generate personalized campaign URLs</p>
                  </div>
                ) : (
                  customers.map((customer) => (
                    <div key={customer.metadata_code} className={styles.customerRow}>
                      <span className={styles.customerValue}>{customer.metadata_value}</span>
                      <span className={styles.badge}>{customer.metadata_type}</span>
                      <span className={styles.code}>{customer.metadata_code}</span>
                      <span className={styles.accessInfo}>
                        {customer.access_count}x
                        {customer.last_accessed_at && (
                          <small> ({new Date(customer.last_accessed_at).toLocaleDateString()})</small>
                        )}
                      </span>
                      <div className={styles.customerActions}>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(customer.campaign_url)
                            setSuccess("URL copied to clipboard!")
                          }}
                          className={styles.iconBtn}
                          title="Copy URL"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleDownloadQR(customer.metadata_code, customer.metadata_value)}
                          className={styles.iconBtn}
                          title="Download QR Code"
                        >
                          <QrCode size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}


