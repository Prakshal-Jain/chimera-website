"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { API_URL } from "@/app/variables"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteCampaignButtonProps {
  campaignId: string
  campaignName: string
  onDeleteSuccess?: () => void
}

export function DeleteCampaignButton({ campaignId, campaignName, onDeleteSuccess }: DeleteCampaignButtonProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteCampaign = async () => {
    if (!campaignId) return

    try {
      setDeleting(true)
      const response = await fetch(`${API_URL}/campaigns/${campaignId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to delete campaign (${response.status})`)
      }

      // Call the success callback if provided
      if (onDeleteSuccess) {
        onDeleteSuccess()
      } else {
        // Default behavior: redirect to campaigns list after successful deletion
        router.push("/campaigns")
      }
    } catch (err: any) {
      console.error("Error deleting campaign:", err)
      alert(err.message || "Failed to delete campaign")
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setShowDeleteDialog(true)}
        variant="outline"
        className="bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 hover:text-white rounded-lg"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Campaign
      </Button>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#1a1a1a] border border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-2xl">Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70 text-base">
              Are you sure you want to permanently delete "{campaignName}"? This action cannot be undone and
              all campaign data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="bg-transparent border border-white/20 text-white hover:bg-white/5 hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCampaign}
              disabled={deleting}
              className="bg-red-500 text-white hover:bg-red-600 border-0"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Permanently
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

