"use client"

import { useState, useCallback } from "react"
import ConfirmationDialog from "../components/confirmation-dialog"

interface UseConfirmationOptions {
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    variant?: "default" | "danger" | "warning"
}

interface ConfirmationState extends UseConfirmationOptions {
    isOpen: boolean
    isLoading: boolean
    onConfirm?: () => void | Promise<void>
}

export function useConfirmation() {
    const [state, setState] = useState<ConfirmationState>({
        isOpen: false,
        isLoading: false,
    })

    const confirm = useCallback((options: UseConfirmationOptions & { onConfirm: () => void | Promise<void> }) => {
        setState({
            isOpen: true,
            isLoading: false,
            title: options.title || "Confirm Action",
            message: options.message || "Are you sure you want to proceed?",
            confirmText: options.confirmText || "Confirm",
            cancelText: options.cancelText || "Cancel",
            variant: options.variant || "default",
            onConfirm: options.onConfirm,
        })
    }, [])

    const handleConfirm = useCallback(async () => {
        if (!state.onConfirm) return

        setState((prev) => ({ ...prev, isLoading: true }))

        try {
            await state.onConfirm()
            setState((prev) => ({ ...prev, isOpen: false, isLoading: false }))
        } catch (error) {
            console.error("Confirmation action failed:", error)
            setState((prev) => ({ ...prev, isLoading: false }))
        }
    }, [state.onConfirm])

    const handleClose = useCallback(() => {
        if (!state.isLoading) {
            setState((prev) => ({ ...prev, isOpen: false }))
        }
    }, [state.isLoading])

    const ConfirmationComponent = useCallback(
        () => (
            <ConfirmationDialog
                isOpen={state.isOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title={state.title}
                message={state.message}
                confirmText={state.confirmText}
                cancelText={state.cancelText}
                variant={state.variant}
                isLoading={state.isLoading}
            />
        ),
        [state, handleClose, handleConfirm],
    )

    return {
        confirm,
        ConfirmationDialog: ConfirmationComponent,
        isOpen: state.isOpen,
        isLoading: state.isLoading,
    }
}
