"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import "../appointment-styles.css"
import { API_URL, ENABLE_VISION_ASSESSMENT } from "../variables"

interface AppointmentFormData {
  first_name: string
  last_name: string
  email: string
  dealership: string
  phone: string
  car_manufacturer: string
  car_model: string
  appointment_date: string
  appointment_time: string
}

interface ApiData {
  dealerships: string[]
  carManufacturers: string[]
  carModels: string[]
  timeSlots: string[]
}

interface AppointmentFormProps {
  onNext: (data: AppointmentFormData) => void
  onDirectSubmit?: (data: AppointmentFormData) => void
}

export default function AppointmentForm({ onNext, onDirectSubmit }: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    first_name: "",
    last_name: "",
    email: "",
    dealership: "",
    phone: "",
    car_manufacturer: "",
    car_model: "",
    appointment_date: "",
    appointment_time: "",
  })

  const [apiData, setApiData] = useState<ApiData>({
    dealerships: [],
    carManufacturers: [],
    carModels: [],
    timeSlots: [],
  })

  const [isLoading, setIsLoading] = useState({
    dealerships: false,
    manufacturers: false,
    models: false,
    timeSlots: false,
  })

  const [errors, setErrors] = useState({
    dealerships: "",
    manufacturers: "",
    models: "",
    timeSlots: "",
  })

  const [isDealershipFromUrl, setIsDealershipFromUrl] = useState(false)

  const searchParams = useSearchParams()

  // Fetch dealerships on component mount and handle URL parameter
  useEffect(() => {
    const fetchDealerships = async () => {
      try {
        // Fetch dealerships
        setIsLoading((prev) => ({ ...prev, dealerships: true }))
        const dealershipsResponse = await fetch(`${API_URL}/dealerships`)
        if (!dealershipsResponse.ok) {
          throw new Error("Failed to fetch dealerships")
        }
        const dealershipsData = await dealershipsResponse.json()
        setApiData((prev) => ({ ...prev, dealerships: dealershipsData }))

        // Check if dealership is provided in URL and is valid
        const urlDealership = searchParams.get("dealership")
        if (urlDealership && dealershipsData.includes(urlDealership)) {
          setFormData((prev) => ({ ...prev, dealership: urlDealership }))
          setIsDealershipFromUrl(true)
        }
      } catch (error) {
        console.error("Error fetching dealerships:", error)
        setErrors((prev) => ({ ...prev, dealerships: "Failed to load dealerships" }))
      } finally {
        setIsLoading((prev) => ({ ...prev, dealerships: false }))
      }
    }

    fetchDealerships()
  }, [searchParams])

  // Fetch car manufacturers when dealership changes
  useEffect(() => {
    const fetchCarManufacturers = async () => {
      if (!formData.dealership) {
        setApiData((prev) => ({ ...prev, carManufacturers: [] }))
        return
      }

      try {
        setIsLoading((prev) => ({ ...prev, manufacturers: true }))
        setErrors((prev) => ({ ...prev, manufacturers: "" }))

        const queryParams = new URLSearchParams({
          dealership: formData.dealership,
        })

        const response = await fetch(`${API_URL}/car_manufacturers?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch car manufacturers")
        }

        const data = await response.json()
        setApiData((prev) => ({ ...prev, carManufacturers: data }))
      } catch (error) {
        console.error("Error fetching car manufacturers:", error)
        setErrors((prev) => ({ ...prev, manufacturers: "Failed to load car manufacturers" }))
      } finally {
        setIsLoading((prev) => ({ ...prev, manufacturers: false }))
      }
    }

    fetchCarManufacturers()
  }, [formData.dealership])

  // Fetch car models when dealership or manufacturer changes
  useEffect(() => {
    const fetchCarModels = async () => {
      if (!formData.dealership || !formData.car_manufacturer) {
        setApiData((prev) => ({ ...prev, carModels: [] }))
        return
      }

      try {
        setIsLoading((prev) => ({ ...prev, models: true }))
        setErrors((prev) => ({ ...prev, models: "" }))

        const queryParams = new URLSearchParams({
          dealership: formData.dealership,
          manufacturer: formData.car_manufacturer,
        })

        const response = await fetch(`${API_URL}/car_models?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch car models")
        }

        const data = await response.json()
        setApiData((prev) => ({ ...prev, carModels: data }))
      } catch (error) {
        console.error("Error fetching car models:", error)
        setErrors((prev) => ({ ...prev, models: "Failed to load car models" }))
      } finally {
        setIsLoading((prev) => ({ ...prev, models: false }))
      }
    }

    fetchCarModels()
  }, [formData.dealership, formData.car_manufacturer])

  // Fetch time slots when dealership or appointment date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      // Only fetch time slots if both dealership and date are selected
      if (!formData.dealership || !formData.appointment_date) {
        setApiData((prev) => ({ ...prev, timeSlots: [] }))
        return
      }

      try {
        setIsLoading((prev) => ({ ...prev, timeSlots: true }))
        setErrors((prev) => ({ ...prev, timeSlots: "" }))

        const queryParams = new URLSearchParams({
          dealership: formData.dealership,
          appointment_date: formData.appointment_date,
        })

        const response = await fetch(`${API_URL}/time-slots?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch available time slots")
        }

        const data = await response.json()
        setApiData((prev) => ({ ...prev, timeSlots: data.available_slots || [] }))

        // Reset the selected time if it is no longer available
        if (formData.appointment_time && !data.available_slots.includes(formData.appointment_time)) {
          setFormData((prev) => ({ ...prev, appointment_time: "" }))
        }
      } catch (error) {
        console.error("Error fetching time slots:", error)
        setErrors((prev) => ({ ...prev, timeSlots: "Failed to load available time slots" }))
      } finally {
        setIsLoading((prev) => ({ ...prev, timeSlots: false }))
      }
    }

    fetchTimeSlots()
  }, [formData.dealership, formData.appointment_date, formData.appointment_time])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Prevent changing dealership if it's set from URL
    if (name === "dealership" && isDealershipFromUrl) {
      return
    }

    // Reset dependent fields when parent field changes
    if (name === "dealership") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        car_manufacturer: "", // Reset manufacturer when dealership changes
        car_model: "", // Reset model when dealership changes
        appointment_time: "", // Reset time when dealership changes
      }))
    }
    // Reset car_model when car_manufacturer changes
    else if (name === "car_manufacturer") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        car_model: "", // Reset car model when manufacturer changes
      }))
    }
    // Reset appointment_time when appointment_date changes
    else if (name === "appointment_date") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        appointment_time: "", // Reset time when date changes
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (ENABLE_VISION_ASSESSMENT) {
      onNext(formData)
    } else {
      onDirectSubmit?.(formData)
    }
  }

  const isFormValid = () => {
    return (
      formData.first_name &&
      formData.last_name &&
      formData.email &&
      formData.dealership &&
      formData.phone &&
      formData.car_manufacturer &&
      formData.car_model &&
      formData.appointment_date &&
      formData.appointment_time
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <p className="card-title">
          {ENABLE_VISION_ASSESSMENT ? "Step 1 of 2: Appointment Details" : "Appointment Details"}
        </p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row form-row-2">
            <div className="form-group">
              <label htmlFor="first_name" className="label">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                className="input"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="John"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name" className="label">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                className="input"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="label">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1234567890"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dealership" className="label">
              Dealership
            </label>
            <select
              id="dealership"
              name="dealership"
              className="select"
              value={formData.dealership}
              onChange={handleInputChange}
              required
              disabled={isLoading.dealerships || isDealershipFromUrl}
            >
              <option value="">Select dealership</option>
              {apiData.dealerships.map((dealership) => (
                <option key={dealership} value={dealership}>
                  {dealership}
                </option>
              ))}
            </select>
            {isLoading.dealerships && <div className="loading-indicator">Loading dealerships...</div>}
            {errors.dealerships && <div className="error-message">{errors.dealerships}</div>}
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label htmlFor="car_manufacturer" className="label">
                Car Manufacturer
              </label>
              <select
                id="car_manufacturer"
                name="car_manufacturer"
                className="select"
                value={formData.car_manufacturer}
                onChange={handleInputChange}
                required
                disabled={!formData.dealership || isLoading.manufacturers}
              >
                <option value="">Select manufacturer</option>
                {apiData.carManufacturers.map((manufacturer) => (
                  <option key={manufacturer} value={manufacturer}>
                    {manufacturer}
                  </option>
                ))}
              </select>
              {isLoading.manufacturers && <div className="loading-indicator">Loading manufacturers...</div>}
              {errors.manufacturers && <div className="error-message">{errors.manufacturers}</div>}
              {!formData.dealership && !isLoading.manufacturers && (
                <div className="info-message">Please select a dealership first</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="car_model" className="label">
                Car Model
              </label>
              <select
                id="car_model"
                name="car_model"
                className="select"
                value={formData.car_model}
                onChange={handleInputChange}
                required
                disabled={!formData.dealership || !formData.car_manufacturer || isLoading.models}
              >
                <option value="">Select model</option>
                {apiData.carModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              {isLoading.models && <div className="loading-indicator">Loading models...</div>}
              {errors.models && <div className="error-message">{errors.models}</div>}
              {(!formData.dealership || !formData.car_manufacturer) && !isLoading.models && (
                <div className="info-message">Please select dealership and manufacturer first</div>
              )}
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label htmlFor="appointment_date" className="label">
                Appointment Date
              </label>
              <input
                id="appointment_date"
                name="appointment_date"
                type="date"
                className="input"
                value={formData.appointment_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="appointment_time" className="label">
                Appointment Time
              </label>
              <select
                id="appointment_time"
                name="appointment_time"
                className="select"
                value={formData.appointment_time}
                onChange={handleInputChange}
                required
                disabled={!formData.dealership || !formData.appointment_date || isLoading.timeSlots}
              >
                <option value="">Select time</option>
                {apiData.timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {isLoading.timeSlots && <div className="loading-indicator">Loading available times...</div>}
              {errors.timeSlots && <div className="error-message">{errors.timeSlots}</div>}
              {(!formData.dealership || !formData.appointment_date) && !isLoading.timeSlots && (
                <div className="info-message">Please select dealership and date first</div>
              )}
              {formData.dealership &&
                formData.appointment_date &&
                apiData.timeSlots.length === 0 &&
                !isLoading.timeSlots &&
                !errors.timeSlots && <div className="info-message">No available time slots for this date</div>}
            </div>
          </div>

          <button type="submit" className="button button-primary button-full" disabled={!isFormValid()}>
            {ENABLE_VISION_ASSESSMENT ? "Continue to Vision Assessment" : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  )
}
