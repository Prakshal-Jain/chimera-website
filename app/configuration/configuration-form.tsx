"use client"

import type React from "react"

import "../appointment-styles.css"
import { useState, useEffect, useRef } from "react"
import { API_URL } from "../variables"
import Image from "next/image"
import Link from "next/link"
import { Edit2, Save, X, Search, ChevronDown, AlertCircle } from "lucide-react"
import CarDetailsTab from "./car-details-tab"

// Update the interfaces to match the new data structure
interface ConfigurationOptions {
  label: string
  preview_image: string
  isSelected?: boolean
  isDefault?: boolean
  value?: any
}

interface ConfigurationSectionOptions {
  section_name?: string
  options: ConfigurationOptions[]
}

interface ConfigurationEntity {
  name: string
  description?: string
  section_options: ConfigurationSectionOptions[]
}

interface ConfigItem {
  exterior: ConfigurationEntity[]
  interior: ConfigurationEntity[]
}

interface ConfigData {
  configure: ConfigItem
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

interface EditState {
  categoryIndex: number
  entityIndex: number
  selectedSectionIndex: number
  selectedOptionIndex: number
}

interface SaveStatus {
  loading: boolean
  success: boolean | null
  error: string | null
}

const formatDate = (isoString: string) => {
  const date = new Date(isoString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function ConfigurationForm() {
  const [code, setCode] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [configData, setConfigData] = useState<ConfigData | null>(null)
  const [activeTab, setActiveTab] = useState<"exterior" | "interior" | "car-details">("exterior")
  const [editState, setEditState] = useState<EditState | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({
    loading: false,
    success: null,
    error: null,
  })

  const [carDetailsData, setCarDetailsData] = useState<any>(null)
  const [carDetailsLoading, setCarDetailsLoading] = useState<boolean>(false)
  const [carDetailsError, setCarDetailsError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Reset save status after 3 seconds
  useEffect(() => {
    if (saveStatus.success || saveStatus.error) {
      const timer = setTimeout(() => {
        setSaveStatus({
          loading: false,
          success: null,
          error: null,
        })
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [saveStatus.success, saveStatus.error])

  // Fetch car details data from API
  useEffect(() => {
    if (!configData) return

    const fetchCarDetails = async () => {
      setCarDetailsLoading(true)
      setCarDetailsError(null)

      try {
        const response = await fetch(`${API_URL}/car-overview-specs?verification_code=${code}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch car details: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setCarDetailsData(data)
      } catch (err) {
        console.error("Error fetching car details:", err)
        setCarDetailsError(err instanceof Error ? err.message : "Failed to load car details")
      } finally {
        setCarDetailsLoading(false)
      }
    }

    fetchCarDetails()
  }, [configData])

  const handleSearch = async () => {
    if (!searchQuery.trim() || !configData) return

    setIsSearching(true)

    try {
      const response = await fetch(`${API_URL}/query?verification_code=${configData.verification_code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to get AI response: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setAiResponse(data.answer || "Sorry, I couldn't generate a response. Please try again.")
    } catch (error) {
      console.error("Error calling AI query endpoint:", error)
      setAiResponse("Sorry, there was an error processing your question. Please try again later.")
    } finally {
      setIsSearching(false)
    }
  }

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

  const handleEdit = (categoryType: "exterior" | "interior", entityIndex: number) => {
    if (!configData) return

    const categoryIndex = categoryType === "exterior" ? 0 : 1
    const entity = configData.configure[categoryType][entityIndex]

    // Find the currently selected option
    let selectedSectionIndex = 0
    let selectedOptionIndex = 0

    entity.section_options.forEach((section, sIndex) => {
      section.options.forEach((option, oIndex) => {
        if (option.isSelected) {
          selectedSectionIndex = sIndex
          selectedOptionIndex = oIndex
        }
      })
    })

    setEditState({
      categoryIndex,
      entityIndex,
      selectedSectionIndex,
      selectedOptionIndex,
    })

    setSearchTerm("")

    // Reset save status when entering edit mode
    setSaveStatus({
      loading: false,
      success: null,
      error: null,
    })
  }

  const handleSave = async () => {
    if (!configData || !editState) return

    const categoryType = editState.categoryIndex === 0 ? "exterior" : "interior"

    // Set loading state
    setSaveStatus({
      loading: true,
      success: null,
      error: null,
    })

    try {
      // Prepare data for server
      const serverData = {
        verification_code: configData.verification_code,
        configuration_area: categoryType,
        configuration_type_index: editState.entityIndex,
        section_index: editState.selectedSectionIndex,
        option_index: editState.selectedOptionIndex,
      }

      // Make POST request to update configuration
      const response = await fetch(`${API_URL}/update-configuration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serverData),
      })

      if (!response.ok) {
        // Handle HTTP error responses
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Server returned ${response.status}: ${response.statusText}`)
      }

      // Update local state after successful server update
      const updatedConfig = { ...configData }

      // Reset all isSelected flags for this entity
      updatedConfig.configure[categoryType][editState.entityIndex].section_options.forEach((section) => {
        section.options.forEach((option) => {
          option.isSelected = false
        })
      })

      // Set the new selected option
      updatedConfig.configure[categoryType][editState.entityIndex].section_options[
        editState.selectedSectionIndex
      ].options[editState.selectedOptionIndex].isSelected = true

      // Update state with success
      setConfigData(updatedConfig)
      setSaveStatus({
        loading: false,
        success: true,
        error: null,
      })

      // Exit edit mode
      setEditState(null)
    } catch (err) {
      console.error("Error updating configuration:", err)

      // Set error state
      setSaveStatus({
        loading: false,
        success: false,
        error: err instanceof Error ? err.message : "Failed to update configuration",
      })
    }
  }

  const handleCancel = () => {
    setEditState(null)

    // Reset save status when canceling
    setSaveStatus({
      loading: false,
      success: null,
      error: null,
    })
  }

  const handleOptionSelect = (sectionIndex: number, optionIndex: number) => {
    if (!editState) return

    setEditState({
      ...editState,
      selectedSectionIndex: sectionIndex,
      selectedOptionIndex: optionIndex,
    })
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

              <button
                type="submit"
                className="button button-primary button-full"
                disabled={isLoading || code.length !== 4}
              >
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
        <h2 className="card-title-center">
          {configData.manufacturer} {configData.model_name}
        </h2>
      </div>

      <div className="card-content">
        {saveStatus.success && <div className="success-message-banner">Configuration updated successfully</div>}

        {saveStatus.error && (
          <div className="error-message-banner">
            <AlertCircle size={16} />
            <span>{saveStatus.error}</span>
          </div>
        )}

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
          <button
            className={`tab-button ${activeTab === "car-details" ? "active" : ""}`}
            onClick={() => setActiveTab("car-details")}
          >
            Car Details
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === "exterior" && (
            <div className="tab-panel">
              {configData.configure.exterior.map((item, index) => (
                <ConfigurationItem
                  key={index}
                  item={item}
                  index={index}
                  categoryType="exterior"
                  editState={editState}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onOptionSelect={handleOptionSelect}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  saveStatus={saveStatus}
                />
              ))}
            </div>
          )}

          {activeTab === "interior" && (
            <div className="tab-panel">
              {configData.configure.interior && configData.configure.interior.length > 0 ? (
                configData.configure.interior.map((item, index) => (
                  <ConfigurationItem
                    key={index}
                    item={item}
                    index={index}
                    categoryType="interior"
                    editState={editState}
                    onEdit={handleEdit}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onOptionSelect={handleOptionSelect}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    saveStatus={saveStatus}
                  />
                ))
              ) : (
                <div>
                  No interior configuration exist yet. Please contact us at{" "}
                  <b>
                    <Link href="mailto:founder@chimeraauto.com" className="link">
                      founder@chimeraauto.com
                    </Link>
                  </b>
                </div>
              )}
            </div>
          )}

          {activeTab === "car-details" && (
            <div className="tab-panel">
              <CarDetailsTab
                carDetailsData={carDetailsData}
                isLoading={carDetailsLoading}
                error={carDetailsError}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                aiResponse={aiResponse}
                isSearching={isSearching}
                onSearch={handleSearch}
              />
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

// Update the ConfigurationItem component to work with the new data structure
function ConfigurationItem({
  item,
  index,
  categoryType,
  editState,
  onEdit,
  onSave,
  onCancel,
  onOptionSelect,
  searchTerm,
  setSearchTerm,
  saveStatus,
}: {
  item: ConfigurationEntity
  index: number
  categoryType: "exterior" | "interior"
  editState: EditState | null
  onEdit: (categoryType: "exterior" | "interior", index: number) => void
  onSave: () => void
  onCancel: () => void
  onOptionSelect: (sectionIndex: number, optionIndex: number) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  saveStatus: SaveStatus
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Find the selected option or default to the first option
  const getSelectedOption = () => {
    for (const sectionIndex in item.section_options) {
      const sectionOption = item.section_options[sectionIndex]
      for (const optionIndex in sectionOption.options) {
        const option = sectionOption.options[optionIndex]
        if (option.isSelected) {
          return {
            option,
            section_name: sectionOption.section_name,
            sectionIndex: Number.parseInt(sectionIndex),
            optionIndex: Number.parseInt(optionIndex),
          }
        }
      }
    }

    // If no selected option is found, use the first option
    if (item.section_options.length > 0 && item.section_options[0].options.length > 0) {
      return {
        option: item.section_options[0].options[0],
        section_name: item.section_options[0].section_name,
        sectionIndex: 0,
        optionIndex: 0,
      }
    }

    return null
  }

  const selectedData = getSelectedOption()

  if (!selectedData) return null

  const { option, section_name, sectionIndex, optionIndex } = selectedData

  // Check if this item is being edited
  const isEditing =
    editState &&
    (categoryType === "exterior" ? editState.categoryIndex === 0 : editState.categoryIndex === 1) &&
    editState.entityIndex === index

  // If editing, get the currently selected option from edit state
  const editingOption = isEditing
    ? item.section_options[editState.selectedSectionIndex].options[editState.selectedOptionIndex]
    : null

  // Filter options based on search term
  const getFilteredOptions = () => {
    const result: { sectionIndex: number; optionIndex: number; option: ConfigurationOptions; section_name?: string }[] =
      []

    item.section_options.forEach((section, sIndex) => {
      section.options.forEach((option, oIndex) => {
        if (option.label.toLowerCase().includes(searchTerm.toLowerCase())) {
          result.push({
            sectionIndex: sIndex,
            optionIndex: oIndex,
            option,
            section_name: section.section_name,
          })
        }
      })
    })

    return result
  }

  const filteredOptions = getFilteredOptions()

  // Determine if we have multiple sections
  const hasMultipleSections = item.section_options.some((section) => section.section_name)

  return (
    <div className="config-item">
      <div className="config-item-image">
        <Image
          alt="Configuration Preview"
          src={`${API_URL}/config_images/${isEditing && editingOption ? editingOption.preview_image : option.preview_image}`}
          width={0}
          height={0}
          layout="responsive"
          className="preview-image"
        />
      </div>
      <div className="config-item-content">
        <div className="config-item-info">
          <h3 className="config-item-name">{item.name}</h3>
          {item.description && <p className="config-item-description">{item.description}</p>}
        </div>
        <div className="config-item-value">
          {isEditing ? (
            <div className="config-edit-container">
              <div className="dropdown-container" ref={dropdownRef}>
                <div className="dropdown-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <span>
                    {editingOption?.label}
                    {editingOption?.isDefault && <span className="default-badge">Default</span>}
                  </span>
                  {hasMultipleSections && item.section_options[editState.selectedSectionIndex].section_name && (
                    <span className="section-tag">
                      {item.section_options[editState.selectedSectionIndex].section_name}
                    </span>
                  )}
                  <ChevronDown className="dropdown-icon" />
                </div>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-search">
                      <Search className="search-icon" size={16} />
                      <input
                        type="text"
                        placeholder="Search options..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="dropdown-search-input"
                      />
                    </div>
                    <div className="dropdown-options">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((item, idx) => (
                          <div
                            key={idx}
                            className={`dropdown-option ${editState?.selectedSectionIndex === item.sectionIndex && editState?.selectedOptionIndex === item.optionIndex ? "selected" : ""}`}
                            onClick={() => {
                              onOptionSelect(item.sectionIndex, item.optionIndex)
                              setDropdownOpen(false)
                            }}
                          >
                            <div className="option-preview">
                              <Image
                                src={`${API_URL}/config_images/${item.option.preview_image}`}
                                alt={item.option.label}
                                width={50}
                                height={50}
                                className="option-thumbnail"
                              />
                            </div>
                            <div className="option-details">
                              <span className="option-label">
                                {item.option.label}
                                {item.option.isDefault && <span className="default-badge">Default</span>}
                              </span>
                              {item.section_name && hasMultipleSections && (
                                <span className="option-section">{item.section_name}</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-results">No options found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="edit-actions">
                <button className="edit-button save" onClick={onSave} disabled={saveStatus.loading}>
                  {saveStatus.loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save</span>
                    </>
                  )}
                </button>
                <button className="edit-button cancel" onClick={onCancel} disabled={saveStatus.loading}>
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="config-display">
              <div className="option-info">
                <span>
                  {option.label}
                  {option.isDefault && <span className="default-badge">Default</span>}
                </span>
                {section_name && <div className="section-name">{section_name}</div>}
              </div>
              <button className="edit-button" onClick={() => onEdit(categoryType, index)}>
                <Edit2 size={16} />
                <span>Edit</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
