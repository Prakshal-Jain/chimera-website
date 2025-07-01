"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import "./confirmation-dialog.css"
import { AlertTriangle, X, CheckCircle, AlertCircle } from "lucide-react"

export interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "danger" | "warning" | "success"
  isLoading?: boolean
  children?: React.ReactNode
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
  children,
}: ConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isLoading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Lock body scroll when dialog is open
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = "hidden"

      return () => {
        document.removeEventListener("keydown", handleEscape)
        // Restore original overflow when dialog closes
        document.body.style.overflow = originalStyle
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, isLoading, onClose])

  // Handle click outside
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && !isLoading) {
      onClose()
    }
  }

  // Focus management
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const firstElement = focusableElements[0] as HTMLElement
      if (firstElement) {
        firstElement.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconColor: "text-red-500",
          confirmButton: "confirmation-button-danger",
          icon: AlertCircle,
        }
      case "warning":
        return {
          iconColor: "text-yellow-500",
          confirmButton: "confirmation-button-warning",
          icon: AlertTriangle,
        }
      case "success":
        return {
          iconColor: "text-blue-500",
          confirmButton: "confirmation-button-primary",
          icon: CheckCircle,
        }
      default:
        return {
          iconColor: "text-blue-500",
          confirmButton: "confirmation-button-primary",
          icon: AlertCircle,
        }
    }
  }

  const variantStyles = getVariantStyles()
  const IconComponent = variantStyles.icon

  return (
    <div className="confirmation-overlay" onClick={handleBackdropClick}>
      <div
        className="confirmation-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="confirmation-header">
          <div className="confirmation-title-section">
            <div className={`confirmation-icon ${variantStyles.iconColor}`}>
              <IconComponent size={24} />
            </div>
            <h2 id="dialog-title" className="confirmation-title">
              {title}
            </h2>
          </div>
          <button
            className="confirmation-close-button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="confirmation-content">
          {children ? children : <p className="confirmation-message">{message}</p>}
        </div>

        <div className="confirmation-actions">
          <button className="confirmation-button confirmation-button-secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </button>
          <button
            className={`confirmation-button ${variantStyles.confirmButton}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
