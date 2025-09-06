"use client"

import { useState } from "react"
import "../appointment-styles.css"

interface VisionAssessmentProps {
  onBack: () => void
  onComplete: (visionData: VisionData) => void
  onSkip: () => void
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

type FlowStep =
  | "glasses_question"
  | "contacts_question"
  | "glasses_type"
  | "contact_type"
  | "monovision_question"
  | "cosmetic_features"
  | "prescription_input"
  | "final_recommendation"

export default function VisionAssessment({ onBack, onComplete, onSkip }: VisionAssessmentProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("glasses_question")
  const [visionData, setVisionData] = useState<Partial<VisionData>>({})
  const [stepHistory, setStepHistory] = useState<FlowStep[]>([])
  const [showSkipWarning, setShowSkipWarning] = useState(false)

  const handleAnswer = (key: keyof VisionData, value: any) => {
    const newData = { ...visionData, [key]: value }
    setVisionData(newData)

    // Add current step to history before navigating
    setStepHistory((prev) => [...prev, currentStep])

    // Navigate to next step based on current step and answer
    navigateFlow(currentStep, value, newData)
  }

  const handleGoBack = () => {
    if (stepHistory.length > 0) {
      const previousStep = stepHistory[stepHistory.length - 1]
      setStepHistory((prev) => prev.slice(0, -1))
      setCurrentStep(previousStep)
    }
  }

  const handleSkipClick = () => {
    setShowSkipWarning(true)
  }

  const handleSkipConfirm = () => {
    onSkip()
  }

  const handleSkipCancel = () => {
    setShowSkipWarning(false)
  }

  const navigateFlow = (step: FlowStep, answer: any, data: Partial<VisionData>) => {
    switch (step) {
      case "glasses_question":
        if (answer) {
          setCurrentStep("glasses_type")
        } else {
          setCurrentStep("contacts_question")
        }
        break

      case "contacts_question":
        if (answer) {
          setCurrentStep("contact_type")
        } else {
          // No glasses, no contacts - perfect for Chimera
          const finalData: VisionData = {
            ...data,
            wears_glasses: false,
            wears_contacts: false,
            recommendation: "Perfect! You're all set for your Chimera experience. No additional accommodations needed.",
            needs_optical_inserts: false,
          } as VisionData
          setVisionData(finalData)
          setCurrentStep("final_recommendation")
        }
        break

      case "glasses_type":
        if (answer === "prescription") {
          setCurrentStep("prescription_input")
        } else {
          // Non-prescription glasses
          const finalData: VisionData = {
            ...data,
            glasses_type: answer,
            recommendation:
              "Great! Since you wear non-prescription glasses, you can simply remove them for your Chimera experience. The immersive display will provide crystal-clear visuals.",
            needs_optical_inserts: false,
          } as VisionData
          setVisionData(finalData)
          setCurrentStep("final_recommendation")
        }
        break

      case "contact_type":
        if (answer === "soft") {
          setCurrentStep("monovision_question")
        } else {
          // Hard contacts - not supported
          const finalData: VisionData = {
            ...data,
            contact_type: answer,
            recommendation:
              "Unfortunately, Chimera's immersive experience doesn't currently support hard contact lenses. We recommend wearing your prescription glasses instead, and we'll provide custom optical inserts for the perfect fit.",
            needs_optical_inserts: true,
          } as VisionData
          setVisionData(finalData)
          setCurrentStep("final_recommendation")
        }
        break

      case "monovision_question":
        if (answer) {
          // Monovision contacts
          const finalData: VisionData = {
            ...data,
            has_monovision: answer,
            recommendation:
              "We'll need to assess your monovision setup during your appointment. Our team will ensure your Chimera experience is optimized for your specific vision needs.",
            needs_optical_inserts: false,
          } as VisionData
          setVisionData(finalData)
          setCurrentStep("final_recommendation")
        } else {
          setCurrentStep("cosmetic_features")
        }
        break

      case "cosmetic_features":
        const finalData: VisionData = {
          ...data,
          has_cosmetic_features: answer,
          recommendation: answer
            ? "Perfect! Your soft contacts are compatible with Chimera. We'll ensure the immersive experience accounts for any cosmetic features of your lenses."
            : "Excellent! Your soft contacts are fully compatible with Chimera's immersive technology. You're all set for an incredible experience.",
          needs_optical_inserts: false,
        } as VisionData
        setVisionData(finalData)
        setCurrentStep("final_recommendation")
        break

      case "prescription_input":
        const prescriptionData: VisionData = {
          ...data,
          prescription_strength: answer,
          recommendation:
            "We'll prepare custom ZEISS optical inserts for your prescription. These will ensure perfect clarity during your immersive car configuration experience.",
          needs_optical_inserts: true,
        } as VisionData
        setVisionData(prescriptionData)
        setCurrentStep("final_recommendation")
        break
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "glasses_question":
        return (
          <div className="vision-step">
            <h3 className="vision-title">Do you wear glasses?</h3>
            <p className="vision-description">
              Understanding your vision needs helps us prepare the perfect Chimera experience for you.
            </p>
            <div className="vision-options">
              <button className="vision-option-button" onClick={() => handleAnswer("wears_glasses", true)}>
                <span className="vision-option-text">Yes</span>
              </button>
              <button className="vision-option-button" onClick={() => handleAnswer("wears_glasses", false)}>
                <span className="vision-option-text">No</span>
              </button>
            </div>
            <button className="vision-skip-button" onClick={handleSkipClick}>
              Skip Vision Assessment
            </button>
          </div>
        )

      case "contacts_question":
        return (
          <div className="vision-step">
            <h3 className="vision-title">Do you wear contact lenses?</h3>
            <p className="vision-description">Contact lenses can affect how you experience our immersive technology.</p>
            <div className="vision-options">
              <button className="vision-option-button" onClick={() => handleAnswer("wears_contacts", true)}>
                <span className="vision-option-text">Yes</span>
              </button>
              <button className="vision-option-button" onClick={() => handleAnswer("wears_contacts", false)}>
                <span className="vision-option-text">No</span>
              </button>
            </div>
            {stepHistory.length > 0 && (
              <button className="vision-back-button" onClick={handleGoBack}>
                ← Back
              </button>
            )}
          </div>
        )

      case "glasses_type":
        return (
          <div className="vision-step">
            <h3 className="vision-title">What kind of glasses do you wear?</h3>
            <p className="vision-description">
              This helps us determine if you need custom optical inserts for your Chimera experience.
            </p>
            <div className="vision-options">
              <button className="vision-option-button" onClick={() => handleAnswer("glasses_type", "prescription")}>
                <span className="vision-option-text">Prescription</span>
                <span className="vision-option-description">For vision correction</span>
              </button>
              <button className="vision-option-button" onClick={() => handleAnswer("glasses_type", "non_prescription")}>
                <span className="vision-option-text">Non-prescription</span>
                <span className="vision-option-description">Reading glasses, blue light, etc.</span>
              </button>
            </div>
            <button className="vision-back-button" onClick={handleGoBack}>
              ← Back
            </button>
          </div>
        )

      case "contact_type":
        return (
          <div className="vision-step">
            <h3 className="vision-title">What kind of contact lenses do you wear?</h3>
            <p className="vision-description">
              Different contact types have varying compatibility with our immersive technology.
            </p>
            <div className="vision-options">
              <button className="vision-option-button" onClick={() => handleAnswer("contact_type", "soft")}>
                <span className="vision-option-text">Soft</span>
                <span className="vision-option-description">Most common type</span>
              </button>
              <button className="vision-option-button" onClick={() => handleAnswer("contact_type", "hard")}>
                <span className="vision-option-text">Hard/RGP</span>
                <span className="vision-option-description">Rigid gas permeable</span>
              </button>
            </div>
            <button className="vision-back-button" onClick={handleGoBack}>
              ← Back
            </button>
          </div>
        )

      case "monovision_question":
        return (
          <div className="vision-step">
            <h3 className="vision-title">Do you have monovision contacts?</h3>
            <p className="vision-description">
              Monovision contacts correct one eye for distance and the other for close-up vision.
            </p>
            <div className="vision-options">
              <button className="vision-option-button" onClick={() => handleAnswer("has_monovision", true)}>
                <span className="vision-option-text">Yes</span>
              </button>
              <button className="vision-option-button" onClick={() => handleAnswer("has_monovision", false)}>
                <span className="vision-option-text">No</span>
              </button>
            </div>
            <button className="vision-back-button" onClick={handleGoBack}>
              ← Back
            </button>
          </div>
        )

      case "cosmetic_features":
        return (
          <div className="vision-step">
            <h3 className="vision-title">Do your contacts have any cosmetic features?</h3>
            <p className="vision-description">
              Cosmetic features include color tints or patterns that change your eye appearance.
            </p>
            <div className="vision-options">
              <button className="vision-option-button" onClick={() => handleAnswer("has_cosmetic_features", true)}>
                <span className="vision-option-text">Yes</span>
                <span className="vision-option-description">Color or pattern changes</span>
              </button>
              <button className="vision-option-button" onClick={() => handleAnswer("has_cosmetic_features", false)}>
                <span className="vision-option-text">No</span>
                <span className="vision-option-description">Clear/standard contacts</span>
              </button>
            </div>
            <button className="vision-back-button" onClick={handleGoBack}>
              ← Back
            </button>
          </div>
        )

      case "prescription_input":
        return (
          <div className="vision-step">
            <h3 className="vision-title">What's your prescription strength?</h3>
            <p className="vision-description">
              We'll use this to prepare custom optical inserts for your Chimera experience.
            </p>
            <div className="prescription-inputs">
              <div className="prescription-row">
                <label className="prescription-label">Left Eye (OD)</label>
                <input
                  type="number"
                  step="0.25"
                  min="-20"
                  max="20"
                  className="prescription-input"
                  placeholder="-2.50"
                  onChange={(e) => {
                    const currentPrescription = visionData.prescription_strength || { left_eye: 0, right_eye: 0 }
                    const newPrescription = { ...currentPrescription, left_eye: Number.parseFloat(e.target.value) || 0 }
                    setVisionData({ ...visionData, prescription_strength: newPrescription })
                  }}
                />
              </div>
              <div className="prescription-row">
                <label className="prescription-label">Right Eye (OS)</label>
                <input
                  type="number"
                  step="0.25"
                  min="-20"
                  max="20"
                  className="prescription-input"
                  placeholder="-2.75"
                  onChange={(e) => {
                    const currentPrescription = visionData.prescription_strength || { left_eye: 0, right_eye: 0 }
                    const newPrescription = {
                      ...currentPrescription,
                      right_eye: Number.parseFloat(e.target.value) || 0,
                    }
                    setVisionData({ ...visionData, prescription_strength: newPrescription })
                  }}
                />
              </div>
              <button
                className="button button-primary"
                onClick={() => handleAnswer("prescription_strength", visionData.prescription_strength)}
                disabled={!visionData.prescription_strength?.left_eye && !visionData.prescription_strength?.right_eye}
              >
                Continue
              </button>
            </div>
            <button className="vision-back-button" onClick={handleGoBack}>
              ← Back
            </button>
          </div>
        )

      case "final_recommendation":
        return (
          <div className="vision-step vision-final">
            <div className="vision-final-icon">{visionData.needs_optical_inserts ? "👓" : "✨"}</div>
            <h3 className="vision-title">
              {visionData.needs_optical_inserts ? "Custom Setup Required" : "You're All Set!"}
            </h3>
            <p className="vision-recommendation">{visionData.recommendation}</p>
            {visionData.needs_optical_inserts && (
              <div className="vision-note">
                <p>
                  <strong>What to expect:</strong>
                </p>
                <ul>
                  <li>Custom ZEISS optical inserts will be prepared for your appointment</li>
                  <li>Perfect clarity for your immersive car configuration</li>
                  <li>Comfortable, secure fit during your entire experience</li>
                </ul>
              </div>
            )}
            <div className="vision-actions">
              <button className="button button-secondary" onClick={onBack}>
                Back to Details
              </button>
              <button className="button button-primary" onClick={() => onComplete(visionData as VisionData)}>
                Complete Booking
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (showSkipWarning) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Skip Vision Assessment?</h2>
          <p className="card-description">We highly recommend completing the assessment</p>
        </div>
        <div className="card-content">
          <div className="skip-warning">
            <div className="skip-warning-icon">⚠️</div>
            <p className="skip-warning-text">
              The vision assessment ensures you have the best possible experience with Chimera's immersive technology.
              Without it, we may not be able to optimize the display for your specific vision needs.
            </p>
            <p className="skip-warning-subtext">Are you sure you want to skip the vision assessment?</p>
            <div className="skip-warning-actions">
              <button className="button button-secondary" onClick={handleSkipCancel}>
                No, Continue Assessment
              </button>
              <button className="button button-danger" onClick={handleSkipConfirm}>
                Yes, Skip Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Vision Assessment</h2>
        <p className="card-description">Step 2 of 2: Optimize Your Chimera Experience</p>
      </div>
      <div className="card-content">{renderCurrentStep()}</div>
    </div>
  )
}
