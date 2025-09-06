"use client"

import { Suspense, useState } from "react"
import AppointmentForm from "./appointment-form"
import VisionAssessment from "./vision-assessment"
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle"
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

interface VisionData {
  wears_glasses: boolean
  wears_contacts: boolean
  glasses_type?: "prescription" | "non_prescription"
  contact_type?: "soft" | "hard"
  has_monovision?: boolean
  has_cosmetic_features?: boolean
  prescription_strength?: {
    left_eye: number
    right_eye: number
  }
  recommendation: string
  needs_optical_inserts: boolean
}

type BookingStep = "appointment_details" | "vision_assessment" | "confirmation"

export default function AppointmentPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>("appointment_details")
  const [appointmentData, setAppointmentData] = useState<AppointmentFormData | null>(null)
  const [visionData, setVisionData] = useState<VisionData | null>(null)
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleAppointmentNext = (data: AppointmentFormData) => {
    setAppointmentData(data)
    setCurrentStep("vision_assessment")
  }

  const handleDirectSubmit = async (data: AppointmentFormData) => {
    setAppointmentData(data)
    // Create default vision data when skipping assessment
    const defaultVisionData: VisionData = {
      wears_glasses: false,
      wears_contacts: false,
      recommendation: "Vision assessment was skipped. Standard setup will be used.",
      needs_optical_inserts: false,
    }
    setVisionData(defaultVisionData)
    await submitAppointment(defaultVisionData)
  }

  const handleVisionBack = () => {
    setCurrentStep("appointment_details")
  }

  const handleVisionComplete = async (vision: VisionData) => {
    setVisionData(vision)
    await submitAppointment(vision)
  }

  const handleVisionSkip = async () => {
    // Create default vision data for skipped assessment
    const defaultVisionData: VisionData = {
      wears_glasses: false,
      wears_contacts: false,
      recommendation: "Vision assessment was skipped. Standard setup will be used.",
      needs_optical_inserts: false,
    }
    setVisionData(defaultVisionData)
    await submitAppointment(defaultVisionData)
  }

  const submitAppointment = async (vision: VisionData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const completeData = {
        ...appointmentData,
        vision_assessment: vision,
      }

      const response = await fetch(`${API_URL}/register_appointment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      })

      const result = await response.json()

      if (result.success) {
        setVerificationCode(result.verification_code)
        setCurrentStep("confirmation")
      } else {
        setSubmitError("Failed to register appointment. Please try again.")
      }
    } catch (err) {
      setSubmitError("An error occurred. Please try again later.")
      console.error("Error submitting form:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetBooking = () => {
    setCurrentStep("appointment_details")
    setAppointmentData(null)
    setVisionData(null)
    setVerificationCode(null)
    setSubmitError(null)
  }

  const renderCurrentStep = () => {
    if (isSubmitting) {
      return (
        <div className="card">
          <div className="card-content">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Finalizing your appointment...</p>
            </div>
          </div>
        </div>
      )
    }

    switch (currentStep) {
      case "appointment_details":
        return <AppointmentForm onNext={handleAppointmentNext} onDirectSubmit={handleDirectSubmit} />

      case "vision_assessment":
        // Only render vision assessment if feature flag is enabled
        if (ENABLE_VISION_ASSESSMENT) {
          return (
            <VisionAssessment onBack={handleVisionBack} onComplete={handleVisionComplete} onSkip={handleVisionSkip} />
          )
        }
        // If vision assessment is disabled, this case should not occur
        return null

      case "confirmation":
        return (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Appointment Confirmed!</h2>
              <p className="card-description">Your immersive configuration experience is scheduled</p>
            </div>
            <div className="card-content">
              <div className="success-container">
                <div className="success-icon">✓</div>
                <p className="success-message">Your verification code is:</p>
                <div className="verification-code">{verificationCode}</div>

                {appointmentData && (
                  <div className="appointment-summary">
                    <h4>Appointment Details:</h4>
                    <p>
                      <strong>Name:</strong> {appointmentData.first_name} {appointmentData.last_name}
                    </p>
                    <p>
                      <strong>Dealership:</strong> {appointmentData.dealership}
                    </p>
                    <p>
                      <strong>Vehicle:</strong> {appointmentData.car_manufacturer} {appointmentData.car_model}
                    </p>
                    <p>
                      <strong>Date & Time:</strong> {appointmentData.appointment_date} at{" "}
                      {appointmentData.appointment_time}
                    </p>
                  </div>
                )}

                {visionData && (
                  <div className="vision-summary">
                    <h4>Vision Setup:</h4>
                    <p>{visionData.recommendation}</p>
                    {visionData.needs_optical_inserts && (
                      <p className="vision-note">
                        <strong>Note:</strong> Custom optical inserts will be prepared for your appointment.
                      </p>
                    )}
                  </div>
                )}

                <p className="success-note">
                  Please keep this code for your records. You'll need it when you arrive at the dealership.
                </p>

                <button onClick={resetBooking} className="button button-primary mt-6" type="button">
                  Book Another Appointment
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (submitError) {
    return (
      <div className="container">
        <HeaderBackButtonTitle title="Book Appointment" />
        <div className="card">
          <div className="card-content">
            <div className="error-container">
              <p className="error-message">{submitError}</p>
              <button onClick={() => setSubmitError(null)} className="button button-primary">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <HeaderBackButtonTitle title="Book Appointment" />
      <Suspense fallback={<div className="loading-indicator">Loading...</div>}>{renderCurrentStep()}</Suspense>
    </div>
  )
}
