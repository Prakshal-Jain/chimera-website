"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus, Save, X, Trash2, Building2, Phone, Mail, MapPin, Clock, Car, Edit2, Check, AlertCircle, Search } from "lucide-react"
import { API_URL } from "@/app/variables"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Dealership {
    _id: string
    name: string
    address: string
    phone: string
    email: string
    hours: any[]
    cars: Record<string, string[]>
    createdAt?: string
    updatedAt?: string
}

// Initialize hours array with 7 days
const initializeHours = (): any[] => {
    return Array(7).fill(null).map(() => ({ open: null, close: null }))
}

export default function DealershipsPage() {
    const [dealerships, setDealerships] = useState<Dealership[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editedDealership, setEditedDealership] = useState<Dealership | null>(null)
    const [isNewDealershipOpen, setIsNewDealershipOpen] = useState(false)
    const [newDealership, setNewDealership] = useState<Partial<Dealership>>({
        name: "",
        address: "",
        phone: "",
        email: "",
        hours: initializeHours(),
        cars: {}
    })
    const [saving, setSaving] = useState(false)
    const [availableCars, setAvailableCars] = useState<Array<{ manufacturer: string; models: string[] }>>([])
    const [newManufacturerName, setNewManufacturerName] = useState("")
    const [newModelNames, setNewModelNames] = useState<Record<string, string>>({})
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchDealerships()
        fetchAvailableCars()
    }, [])

    const fetchDealerships = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch(`${API_URL}/dealerships/all`)
            if (!response.ok) throw new Error("Failed to fetch dealerships")
            const data = await response.json()
            setDealerships(data)
        } catch (err: any) {
            setError(err.message || "Failed to load dealerships")
            console.error("Error fetching dealerships:", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchAvailableCars = async () => {
        try {
            const response = await fetch(`${API_URL}/available_cars`)
            if (response.ok) {
                const data = await response.json()
                const uniqueCars = new Map<string, Set<string>>()
                data.forEach((car: any) => {
                    if (!uniqueCars.has(car.manufacturer)) {
                        uniqueCars.set(car.manufacturer, new Set())
                    }
                    uniqueCars.get(car.manufacturer)?.add(car.model)
                })
                const carsArray = Array.from(uniqueCars.entries()).map(([manufacturer, models]) => ({
                    manufacturer,
                    models: Array.from(models)
                }))
                setAvailableCars(carsArray)
            }
        } catch (err) {
            console.error("Error fetching available cars:", err)
        }
    }

    const handleEdit = (dealership: Dealership) => {
        setEditingId(dealership._id)
        setEditedDealership({ ...dealership })
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditedDealership(null)
        setNewManufacturerName("")
        setNewModelNames({})
    }

    const handleSave = async () => {
        if (!editedDealership) return

        // Check for duplicate dealership name (case-insensitive, excluding current dealership)
        const trimmedName = editedDealership.name.trim()
        const duplicateDealership = dealerships.find(
            (d) => d._id !== editedDealership._id && d.name.toLowerCase() === trimmedName.toLowerCase()
        )
        if (duplicateDealership) {
            setError(`Dealership with the name "${duplicateDealership.name}" already exists`)
            return
        }

        try {
            setSaving(true)
            setError(null)
            const response = await fetch(`${API_URL}/dealerships/${editedDealership._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedDealership),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to update dealership")
            }

            setSuccess("Dealership updated successfully")
            setEditingId(null)
            setEditedDealership(null)
            setNewManufacturerName("")
            setNewModelNames({})
            fetchDealerships()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err: any) {
            setError(err.message || "Failed to update dealership")
            console.error("Error updating dealership:", err)
        } finally {
            setSaving(false)
        }
    }

    const handleCreate = async () => {
        if (!newDealership.name || !newDealership.address || !newDealership.phone || !newDealership.email) {
            setError("Please fill in all required fields")
            return
        }

        // Check for duplicate dealership name (case-insensitive)
        const trimmedName = newDealership.name.trim()
        const duplicateDealership = dealerships.find(
            (d) => d.name.toLowerCase() === trimmedName.toLowerCase()
        )
        if (duplicateDealership) {
            setError(`Dealership with the name "${duplicateDealership.name}" already exists`)
            return
        }

        try {
            setSaving(true)
            setError(null)
            const response = await fetch(`${API_URL}/dealerships`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newDealership),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to create dealership")
            }

            setSuccess("Dealership created successfully")
            setIsNewDealershipOpen(false)
            setNewDealership({
                name: "",
                address: "",
                phone: "",
                email: "",
                hours: initializeHours(),
                cars: {}
            })
            setNewManufacturerName("")
            setNewModelNames({})
            fetchDealerships()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err: any) {
            setError(err.message || "Failed to create dealership")
            console.error("Error creating dealership:", err)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this dealership?")) return

        try {
            setError(null)
            const response = await fetch(`${API_URL}/dealerships/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to delete dealership")
            }

            setSuccess("Dealership deleted successfully")
            fetchDealerships()
            setTimeout(() => setSuccess(null), 3000)
        } catch (err: any) {
            setError(err.message || "Failed to delete dealership")
            console.error("Error deleting dealership:", err)
        }
    }

    const updateField = (field: keyof Dealership, value: any) => {
        if (!editedDealership) return
        setEditedDealership({ ...editedDealership, [field]: value })
    }

    const updateNewField = (field: string, value: any) => {
        setNewDealership({ ...newDealership, [field]: value })
    }

    const addManufacturer = (dealership: Dealership | Partial<Dealership>, manufacturer: string) => {
        // Check if manufacturer already exists in availableCars (case-insensitive)
        const normalizedManufacturer = manufacturer.trim()
        const existingManufacturer = availableCars.find(
            (c) => c.manufacturer.toLowerCase() === normalizedManufacturer.toLowerCase()
        )
        
        // Use the existing manufacturer name if found (to maintain consistency)
        const manufacturerToUse = existingManufacturer ? existingManufacturer.manufacturer : normalizedManufacturer
        
        // Check if already added to this dealership
        const currentCars = dealership.cars || {}
        if (Object.keys(currentCars).some(
            (m) => m.toLowerCase() === manufacturerToUse.toLowerCase()
        )) {
            setError(`Manufacturer "${manufacturerToUse}" is already added`)
            setTimeout(() => setError(null), 3000)
            return
        }
        
        const cars = { ...currentCars }
        cars[manufacturerToUse] = []
        if (editingId && editedDealership) {
            updateField("cars", cars)
        } else {
            updateNewField("cars", cars)
        }
    }

    const removeManufacturer = (manufacturer: string) => {
        if (!editedDealership) return
        const cars = { ...editedDealership.cars }
        delete cars[manufacturer]
        updateField("cars", cars)
    }

    const addModel = (manufacturer: string, model: string) => {
        if (!editedDealership) return
        
        const normalizedModel = model.trim()
        
        // Find the actual manufacturer name (case-insensitive match)
        const actualManufacturer = Object.keys(editedDealership.cars || {}).find(
            (m) => m.toLowerCase() === manufacturer.toLowerCase()
        ) || manufacturer
        
        // Check if model already exists for this manufacturer in availableCars (case-insensitive)
        const manufacturerData = availableCars.find(
            (c) => c.manufacturer.toLowerCase() === actualManufacturer.toLowerCase()
        )
        const existingModel = manufacturerData?.models.find(
            (m) => m.toLowerCase() === normalizedModel.toLowerCase()
        )
        
        // Use the existing model name if found (to maintain consistency)
        const modelToUse = existingModel || normalizedModel
        
        // Check if already added to this manufacturer
        const existingModels = editedDealership.cars[actualManufacturer] || []
        if (existingModels.some((m) => m.toLowerCase() === modelToUse.toLowerCase())) {
            setError(`Model "${modelToUse}" is already added to ${actualManufacturer}`)
            setTimeout(() => setError(null), 3000)
            return
        }
        
        const cars = { ...editedDealership.cars }
        if (!cars[actualManufacturer]) {
            cars[actualManufacturer] = []
        }
        cars[actualManufacturer] = [...cars[actualManufacturer], modelToUse]
        updateField("cars", cars)
    }

    const removeModel = (manufacturer: string, model: string) => {
        if (!editedDealership) return
        const cars = { ...editedDealership.cars }
        if (cars[manufacturer]) {
            cars[manufacturer] = cars[manufacturer].filter((m) => m !== model)
            if (cars[manufacturer].length === 0) {
                delete cars[manufacturer]
            }
        }
        updateField("cars", cars)
    }

    const addNewManufacturer = (manufacturer: string) => {
        // Check if manufacturer already exists in availableCars (case-insensitive)
        const normalizedManufacturer = manufacturer.trim()
        const existingManufacturer = availableCars.find(
            (c) => c.manufacturer.toLowerCase() === normalizedManufacturer.toLowerCase()
        )
        
        // Use the existing manufacturer name if found (to maintain consistency)
        const manufacturerToUse = existingManufacturer ? existingManufacturer.manufacturer : normalizedManufacturer
        
        // Check if already added to this dealership
        if (Object.keys(newDealership.cars || {}).some(
            (m) => m.toLowerCase() === manufacturerToUse.toLowerCase()
        )) {
            setError(`Manufacturer "${manufacturerToUse}" is already added`)
            setTimeout(() => setError(null), 3000)
            return
        }
        
        const cars = { ...(newDealership.cars || {}) }
        cars[manufacturerToUse] = []
        updateNewField("cars", cars)
    }

    const removeNewManufacturer = (manufacturer: string) => {
        const cars = { ...(newDealership.cars || {}) }
        delete cars[manufacturer]
        updateNewField("cars", cars)
    }

    const addNewModel = (manufacturer: string, model: string) => {
        const normalizedModel = model.trim()
        const cars = { ...(newDealership.cars || {}) }
        
        // Find the actual manufacturer name (case-insensitive match)
        const actualManufacturer = Object.keys(cars).find(
            (m) => m.toLowerCase() === manufacturer.toLowerCase()
        ) || manufacturer
        
        // Check if model already exists for this manufacturer in availableCars (case-insensitive)
        const manufacturerData = availableCars.find(
            (c) => c.manufacturer.toLowerCase() === actualManufacturer.toLowerCase()
        )
        const existingModel = manufacturerData?.models.find(
            (m) => m.toLowerCase() === normalizedModel.toLowerCase()
        )
        
        // Use the existing model name if found (to maintain consistency)
        const modelToUse = existingModel || normalizedModel
        
        // Check if already added to this manufacturer
        const existingModels = cars[actualManufacturer] || []
        if (existingModels.some((m) => m.toLowerCase() === modelToUse.toLowerCase())) {
            setError(`Model "${modelToUse}" is already added to ${actualManufacturer}`)
            setTimeout(() => setError(null), 3000)
            return
        }
        
        if (!cars[actualManufacturer]) {
            cars[actualManufacturer] = []
        }
        cars[actualManufacturer] = [...cars[actualManufacturer], modelToUse]
        updateNewField("cars", cars)
    }

    const removeNewModel = (manufacturer: string, model: string) => {
        const cars = { ...(newDealership.cars || {}) }
        if (cars[manufacturer]) {
            cars[manufacturer] = cars[manufacturer].filter((m) => m !== model)
            if (cars[manufacturer].length === 0) {
                delete cars[manufacturer]
            }
        }
        updateNewField("cars", cars)
    }

    const formatHours = (hours: any[]) => {
        if (!hours || hours.length === 0) return "Not set"
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        return hours.map((h, i) => {
            if (!h || (h.open === null && h.close === null)) {
                return `${days[i]}: Closed`
            }
            const open = h.open !== null ? `${Math.floor(h.open / 100)}:${String(h.open % 100).padStart(2, "0")}` : "Closed"
            const close = h.close !== null ? `${Math.floor(h.close / 100)}:${String(h.close % 100).padStart(2, "0")}` : "Closed"
            return `${days[i]}: ${open} - ${close}`
        }).join(", ")
    }

    // Convert time from HHMM format to HH:MM format
    const formatTimeForInput = (time: number | null): string => {
        if (time === null || time === undefined) return ""
        const hours = Math.floor(time / 100)
        const minutes = time % 100
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
    }

    // Convert time from HH:MM format to HHMM format
    const parseTimeFromInput = (timeString: string): number | null => {
        if (!timeString || !timeString.trim()) return null
        const [hours, minutes] = timeString.split(":").map(Number)
        if (isNaN(hours) || isNaN(minutes)) return null
        return hours * 100 + minutes
    }

    // Update hours for a specific day
    const updateHours = (dayIndex: number, field: "open" | "close", value: string, isNew: boolean = false) => {
        if (isNew) {
            const hours = newDealership.hours && newDealership.hours.length > 0 
                ? [...newDealership.hours] 
                : initializeHours()
            hours[dayIndex] = { ...hours[dayIndex], [field]: parseTimeFromInput(value) }
            updateNewField("hours", hours)
        } else {
            if (!editedDealership) return
            const hours = editedDealership.hours && editedDealership.hours.length > 0 
                ? [...editedDealership.hours] 
                : initializeHours()
            hours[dayIndex] = { ...hours[dayIndex], [field]: parseTimeFromInput(value) }
            updateField("hours", hours)
        }
    }

    // Toggle closed for a day
    const toggleDayClosed = (dayIndex: number, isNew: boolean = false) => {
        if (isNew) {
            const hours = newDealership.hours && newDealership.hours.length > 0 
                ? [...newDealership.hours] 
                : initializeHours()
            if (hours[dayIndex] && hours[dayIndex].open !== null && hours[dayIndex].close !== null) {
                hours[dayIndex] = { open: null, close: null }
            } else {
                hours[dayIndex] = { open: 900, close: 1700 } // Default 9 AM - 5 PM
            }
            updateNewField("hours", hours)
        } else {
            if (!editedDealership) return
            const hours = editedDealership.hours && editedDealership.hours.length > 0 
                ? [...editedDealership.hours] 
                : initializeHours()
            if (hours[dayIndex] && hours[dayIndex].open !== null && hours[dayIndex].close !== null) {
                hours[dayIndex] = { open: null, close: null }
            } else {
                hours[dayIndex] = { open: 900, close: 1700 } // Default 9 AM - 5 PM
            }
            updateField("hours", hours)
        }
    }

    // Filter dealerships based on search query
    const filteredDealerships = dealerships.filter((dealership) => {
        if (!searchQuery.trim()) return true
        
        const query = searchQuery.toLowerCase()
        const nameMatch = dealership.name.toLowerCase().includes(query)
        const addressMatch = dealership.address.toLowerCase().includes(query)
        const phoneMatch = dealership.phone.toLowerCase().includes(query)
        const emailMatch = dealership.email.toLowerCase().includes(query)
        
        // Check manufacturers
        const manufacturers = Object.keys(dealership.cars || {})
        const manufacturerMatch = manufacturers.some((m) => m.toLowerCase().includes(query))
        
        // Check models
        const modelsMatch = Object.values(dealership.cars || {}).some((models) =>
            models.some((model) => model.toLowerCase().includes(query))
        )
        
        return nameMatch || addressMatch || phoneMatch || emailMatch || manufacturerMatch || modelsMatch
    })

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]">
                <Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-serif font-light text-white mb-2 tracking-tight">Dealerships</h1>
                        <p className="text-white/70 text-lg">Manage onboarded dealerships and their details</p>
                    </div>
                    <Dialog open={isNewDealershipOpen} onOpenChange={(open) => {
                        setIsNewDealershipOpen(open)
                        if (!open) {
                            setNewDealership({
                                name: "",
                                address: "",
                                phone: "",
                                email: "",
                                hours: initializeHours(),
                                cars: {}
                            })
                            setNewManufacturerName("")
                            setNewModelNames({})
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button className="mt-4 md:mt-0 bg-transparent border-2 border-[#d4af37] text-white hover:bg-[#d4af37]/15 px-6 py-3 rounded-xl font-medium transition-all [&>svg]:text-white">
                                <Plus className="mr-2 h-4 w-4" />
                                Onboard New Dealership
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-serif font-light text-white">Onboard New Dealership</DialogTitle>
                                <DialogDescription className="text-white/60">Fill in the details for the new dealership</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-white/80 mb-2 block">Name *</Label>
                                        <Input
                                            value={newDealership.name || ""}
                                            onChange={(e) => updateNewField("name", e.target.value)}
                                            className="bg-white/5 border-white/10 text-white"
                                            placeholder="Dealership Name"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/80 mb-2 block">Email *</Label>
                                        <Input
                                            type="email"
                                            value={newDealership.email || ""}
                                            onChange={(e) => updateNewField("email", e.target.value)}
                                            className="bg-white/5 border-white/10 text-white"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/80 mb-2 block">Phone *</Label>
                                        <Input
                                            value={newDealership.phone || ""}
                                            onChange={(e) => updateNewField("phone", e.target.value)}
                                            className="bg-white/5 border-white/10 text-white"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white/80 mb-2 block">Address *</Label>
                                        <Input
                                            value={newDealership.address || ""}
                                            onChange={(e) => updateNewField("address", e.target.value)}
                                            className="bg-white/5 border-white/10 text-white"
                                            placeholder="123 Main St, City, State ZIP"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-white/80 mb-2 block flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Business Hours
                                    </Label>
                                    <div className="space-y-2 bg-white/5 border border-white/10 rounded-lg p-4">
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
                                            const hours = newDealership.hours && newDealership.hours.length > index ? newDealership.hours[index] : null
                                            const isClosed = !hours || (hours.open === null && hours.close === null)
                                            return (
                                                <div key={day} className="flex items-center gap-3">
                                                    <div className="w-24 text-sm text-white/80">{day}</div>
                                                    {isClosed ? (
                                                        <div className="flex-1 flex items-center gap-2">
                                                            <span className="text-white/60 text-sm">Closed</span>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => toggleDayClosed(index, true)}
                                                                className="bg-transparent border-white/20 text-white hover:bg-white/5 text-xs h-7"
                                                            >
                                                                Set Hours
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex-1 flex items-center gap-2">
                                                            <Input
                                                                type="time"
                                                                value={formatTimeForInput(hours?.open || null)}
                                                                onChange={(e) => updateHours(index, "open", e.target.value, true)}
                                                                className="bg-white/5 border-white/10 text-white text-sm h-8"
                                                            />
                                                            <span className="text-white/60">-</span>
                                                            <Input
                                                                type="time"
                                                                value={formatTimeForInput(hours?.close || null)}
                                                                onChange={(e) => updateHours(index, "close", e.target.value, true)}
                                                                className="bg-white/5 border-white/10 text-white text-sm h-8"
                                                            />
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => toggleDayClosed(index, true)}
                                                                className="text-red-400 hover:text-red-300 text-xs h-7"
                                                            >
                                                                Close
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-white/80 mb-2 block">Manufacturers & Models</Label>
                                    <div className="space-y-4">
                                        {Object.entries(newDealership.cars || {}).map(([manufacturer, models]) => (
                                            <Card key={manufacturer} className="bg-white/5 border-white/10">
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-lg text-white">{manufacturer}</CardTitle>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeNewManufacturer(manufacturer)}
                                                            className="text-red-400 hover:text-red-300 [&>svg]:text-red-400 [&>svg]:hover:text-red-300"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="flex flex-wrap gap-2">
                                                        {models.map((model) => (
                                                            <span
                                                                key={model}
                                                                className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 rounded-lg text-sm text-white"
                                                            >
                                                                {model}
                                                                <button
                                                                    onClick={() => removeNewModel(manufacturer, model)}
                                                                    className="hover:text-red-400"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="mt-3 space-y-2">
                                                        <select
                                                            onChange={(e) => {
                                                                if (e.target.value) {
                                                                    addNewModel(manufacturer, e.target.value)
                                                                    e.target.value = ""
                                                                }
                                                            }}
                                                            className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm w-full"
                                                        >
                                                            <option value="">Add existing model...</option>
                                                            {availableCars
                                                                .find((c) => c.manufacturer === manufacturer)
                                                                ?.models.filter((m) => !models.includes(m))
                                                                .map((model) => (
                                                                    <option key={model} value={model}>
                                                                        {model}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={newModelNames[manufacturer] || ""}
                                                                onChange={(e) => setNewModelNames({ ...newModelNames, [manufacturer]: e.target.value })}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter" && newModelNames[manufacturer]?.trim()) {
                                                                        e.preventDefault()
                                                                        addNewModel(manufacturer, newModelNames[manufacturer].trim())
                                                                        setNewModelNames({ ...newModelNames, [manufacturer]: "" })
                                                                    }
                                                                }}
                                                                placeholder="Or type new model name..."
                                                                className="bg-white/5 border-white/10 text-white text-sm"
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (newModelNames[manufacturer]?.trim()) {
                                                                        addNewModel(manufacturer, newModelNames[manufacturer].trim())
                                                                        setNewModelNames({ ...newModelNames, [manufacturer]: "" })
                                                                    }
                                                                }}
                                                                size="sm"
                                                                className="bg-[#d4af37] text-black hover:bg-[#d4af37]/90"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                        <div className="space-y-2">
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        addNewManufacturer(e.target.value)
                                                        e.target.value = ""
                                                    }
                                                }}
                                                className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm w-full"
                                            >
                                                <option value="">Add existing manufacturer...</option>
                                                {availableCars
                                                    .map((c) => c.manufacturer)
                                                    .filter((m, i, arr) => arr.indexOf(m) === i)
                                                    .filter((m) => !Object.keys(newDealership.cars || {}).includes(m))
                                                    .map((manufacturer) => (
                                                        <option key={manufacturer} value={manufacturer}>
                                                            {manufacturer}
                                                        </option>
                                                    ))}
                                            </select>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={newManufacturerName}
                                                    onChange={(e) => setNewManufacturerName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && newManufacturerName.trim()) {
                                                            e.preventDefault()
                                                            addNewManufacturer(newManufacturerName.trim())
                                                            setNewManufacturerName("")
                                                        }
                                                    }}
                                                    placeholder="Or type new manufacturer name..."
                                                    className="bg-white/5 border-white/10 text-white text-sm"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        if (newManufacturerName.trim()) {
                                                            addNewManufacturer(newManufacturerName.trim())
                                                            setNewManufacturerName("")
                                                        }
                                                    }}
                                                    size="sm"
                                                    className="bg-[#d4af37] text-black hover:bg-[#d4af37]/90 [&>svg]:text-black"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsNewDealershipOpen(false)}
                                        className="bg-transparent border-white/20 text-white hover:bg-white/5 [&>svg]:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreate}
                                        disabled={saving}
                                        className="bg-[#d4af37] text-black hover:bg-[#d4af37]/90 [&>svg]:text-black"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create Dealership
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input
                            placeholder="Search dealerships by name, address, phone, email, manufacturer, or model..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#d4af37] rounded-lg"
                        />
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <Alert className="mb-6 bg-green-500/10 border-green-500/30 text-green-400 [&>svg]:text-green-400">
                        <Check className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}
                {error && (
                    <Alert className="mb-6 bg-red-500/10 border-red-500/30 text-red-400">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Dealerships List */}
                {filteredDealerships.length === 0 && dealerships.length > 0 ? (
                    <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                        <CardContent className="pt-12 pb-12 text-center">
                            <div className="flex flex-col items-center">
                                <Search className="h-16 w-16 text-white/30 mb-4" />
                                <h3 className="text-xl font-serif font-light text-white mb-2">No dealerships found</h3>
                                <p className="text-white/60 mb-6">Try adjusting your search criteria</p>
                                <Button
                                    onClick={() => setSearchQuery("")}
                                    variant="outline"
                                    className="bg-transparent border-white/20 text-white hover:bg-white/5"
                                >
                                    Clear Search
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : dealerships.length === 0 ? (
                    <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl">
                        <CardContent className="pt-12 pb-12 text-center">
                            <div className="flex flex-col items-center">
                                <Building2 className="h-16 w-16 text-white/30 mb-4" />
                                <h3 className="text-xl font-serif font-light text-white mb-2">No dealerships yet</h3>
                                <p className="text-white/60 mb-6">Onboard your first dealership to get started</p>
                                <Button
                                    onClick={() => setIsNewDealershipOpen(true)}
                                    className="bg-transparent border-2 border-[#d4af37] text-white hover:bg-[#d4af37]/15 px-6 py-3 rounded-xl [&>svg]:text-white"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Onboard First Dealership
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {filteredDealerships.map((dealership) => (
                            <Card
                                key={dealership._id}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl"
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {editingId === dealership._id ? (
                                                <Input
                                                    value={editedDealership?.name || ""}
                                                    onChange={(e) => updateField("name", e.target.value)}
                                                    className="text-2xl font-serif font-light bg-white/5 border-white/10 text-white mb-2"
                                                />
                                            ) : (
                                                <CardTitle className="text-2xl font-serif font-light text-white mb-2">
                                                    {dealership.name}
                                                </CardTitle>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {editingId === dealership._id ? (
                                                <>
                                                    <Button
                                                        onClick={handleSave}
                                                        disabled={saving}
                                                        size="sm"
                                                        className="bg-[#d4af37] text-black hover:bg-[#d4af37]/90 [&>svg]:text-black"
                                                    >
                                                        {saving ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Save className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        onClick={handleCancelEdit}
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-transparent border-white/20 text-white hover:bg-white/5 [&>svg]:text-white"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        onClick={() => handleEdit(dealership)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-transparent border-white/20 text-white hover:bg-white/5 [&>svg]:text-white"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(dealership._id)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 [&>svg]:text-red-400"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Basic Info */}
                                        <div className="space-y-4">
                                            <div>
                                                <Label className="text-white/60 text-sm mb-1 block flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-[#d4af37]" />
                                                    Address
                                                </Label>
                                                {editingId === dealership._id ? (
                                                    <Textarea
                                                        value={editedDealership?.address || ""}
                                                        onChange={(e) => updateField("address", e.target.value)}
                                                        className="bg-white/5 border-white/10 text-white"
                                                        rows={2}
                                                    />
                                                ) : (
                                                    <p className="text-white">{dealership.address}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label className="text-white/60 text-sm mb-1 block flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-[#d4af37]" />
                                                    Phone
                                                </Label>
                                                {editingId === dealership._id ? (
                                                    <Input
                                                        value={editedDealership?.phone || ""}
                                                        onChange={(e) => updateField("phone", e.target.value)}
                                                        className="bg-white/5 border-white/10 text-white"
                                                    />
                                                ) : (
                                                    <p className="text-white">{dealership.phone}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label className="text-white/60 text-sm mb-1 block flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-[#d4af37]" />
                                                    Email
                                                </Label>
                                                {editingId === dealership._id ? (
                                                    <Input
                                                        type="email"
                                                        value={editedDealership?.email || ""}
                                                        onChange={(e) => updateField("email", e.target.value)}
                                                        className="bg-white/5 border-white/10 text-white"
                                                    />
                                                ) : (
                                                    <p className="text-white">{dealership.email}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label className="text-white/60 text-sm mb-1 block flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-[#d4af37]" />
                                                    Hours
                                                </Label>
                                                {editingId === dealership._id ? (
                                                    <div className="space-y-2 bg-white/5 border border-white/10 rounded-lg p-3">
                                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
                                                            const hours = editedDealership?.hours && editedDealership.hours.length > index ? editedDealership.hours[index] : null
                                                            const isClosed = !hours || (hours.open === null && hours.close === null)
                                                            return (
                                                                <div key={day} className="flex items-center gap-2">
                                                                    <div className="w-20 text-xs text-white/80">{day}</div>
                                                                    {isClosed ? (
                                                                        <div className="flex-1 flex items-center gap-2">
                                                                            <span className="text-white/60 text-xs">Closed</span>
                                                                            <Button
                                                                                type="button"
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => toggleDayClosed(index, false)}
                                                                                className="bg-transparent border-white/20 text-white hover:bg-white/5 text-xs h-6 px-2"
                                                                            >
                                                                                Set
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex-1 flex items-center gap-2">
                                                                            <Input
                                                                                type="time"
                                                                                value={formatTimeForInput(hours?.open || null)}
                                                                                onChange={(e) => updateHours(index, "open", e.target.value, false)}
                                                                                className="bg-white/5 border-white/10 text-white text-xs h-7"
                                                                            />
                                                                            <span className="text-white/60 text-xs">-</span>
                                                                            <Input
                                                                                type="time"
                                                                                value={formatTimeForInput(hours?.close || null)}
                                                                                onChange={(e) => updateHours(index, "close", e.target.value, false)}
                                                                                className="bg-white/5 border-white/10 text-white text-xs h-7"
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                onClick={() => toggleDayClosed(index, false)}
                                                                                className="text-red-400 hover:text-red-300 text-xs h-6 px-2"
                                                                            >
                                                                                Close
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-white text-sm">{formatHours(dealership.hours)}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Manufacturers & Models */}
                                        <div>
                                            <Label className="text-white/60 text-sm mb-3 block flex items-center gap-2">
                                                <Car className="h-4 w-4 text-[#d4af37]" />
                                                Manufacturers & Models
                                            </Label>
                                            <div className="space-y-3">
                                                {Object.keys(dealership.cars || {}).length === 0 ? (
                                                    <p className="text-white/60 text-sm">No manufacturers assigned</p>
                                                ) : (
                                                    Object.entries(dealership.cars || {}).map(([manufacturer, models]) => (
                                                        <Card key={manufacturer} className="bg-white/5 border-white/10">
                                                            <CardHeader className="pb-2">
                                                                <div className="flex items-center justify-between">
                                                                    <CardTitle className="text-base text-white">{manufacturer}</CardTitle>
                                                                    {editingId === dealership._id && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => removeManufacturer(manufacturer)}
                                                                            className="text-red-400 hover:text-red-300 h-6 w-6 p-0 [&>svg]:text-red-400 [&>svg]:hover:text-red-300"
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent className="pt-0">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {models.map((model) => (
                                                                        <span
                                                                            key={model}
                                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs text-white"
                                                                        >
                                                                            {model}
                                                                            {editingId === dealership._id && (
                                                                                <button
                                                                                    onClick={() => removeModel(manufacturer, model)}
                                                                                    className="hover:text-red-400"
                                                                                >
                                                                                    <X className="h-3 w-3" />
                                                                                </button>
                                                                            )}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                {editingId === dealership._id && (
                                                                    <div className="mt-2 space-y-2">
                                                                        <select
                                                                            onChange={(e) => {
                                                                                if (e.target.value) {
                                                                                    addModel(manufacturer, e.target.value)
                                                                                    e.target.value = ""
                                                                                }
                                                                            }}
                                                                            className="bg-white/5 border border-white/10 text-white rounded px-2 py-1 text-xs w-full"
                                                                        >
                                                                            <option value="">Add existing model...</option>
                                                                            {availableCars
                                                                                .find((c) => c.manufacturer === manufacturer)
                                                                                ?.models.filter((m) => !models.includes(m))
                                                                                .map((model) => (
                                                                                    <option key={model} value={model}>
                                                                                        {model}
                                                                                    </option>
                                                                                ))}
                                                                        </select>
                                                                        <div className="flex gap-2">
                                                                            <Input
                                                                                value={newModelNames[manufacturer] || ""}
                                                                                onChange={(e) => setNewModelNames({ ...newModelNames, [manufacturer]: e.target.value })}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === "Enter" && newModelNames[manufacturer]?.trim()) {
                                                                                        e.preventDefault()
                                                                                        addModel(manufacturer, newModelNames[manufacturer].trim())
                                                                                        setNewModelNames({ ...newModelNames, [manufacturer]: "" })
                                                                                    }
                                                                                }}
                                                                                placeholder="Or type new model name..."
                                                                                className="bg-white/5 border-white/10 text-white text-xs h-8"
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    if (newModelNames[manufacturer]?.trim()) {
                                                                                        addModel(manufacturer, newModelNames[manufacturer].trim())
                                                                                        setNewModelNames({ ...newModelNames, [manufacturer]: "" })
                                                                                    }
                                                                                }}
                                                                                size="sm"
                                                                                className="bg-[#d4af37] text-black hover:bg-[#d4af37]/90 h-8 px-2"
                                                                            >
                                                                                <Plus className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    ))
                                                )}
                                                {editingId === dealership._id && (
                                                    <div className="mt-3 space-y-2">
                                                        <select
                                                            onChange={(e) => {
                                                                if (e.target.value) {
                                                                    addManufacturer(editedDealership!, e.target.value)
                                                                    e.target.value = ""
                                                                }
                                                            }}
                                                            className="bg-white/5 border border-white/10 text-white rounded px-3 py-2 text-sm w-full"
                                                        >
                                                            <option value="">Add existing manufacturer...</option>
                                                            {availableCars
                                                                .map((c) => c.manufacturer)
                                                                .filter((m, i, arr) => arr.indexOf(m) === i)
                                                                .filter((m) => !Object.keys(editedDealership?.cars || {}).includes(m))
                                                                .map((manufacturer) => (
                                                                    <option key={manufacturer} value={manufacturer}>
                                                                        {manufacturer}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={newManufacturerName}
                                                                onChange={(e) => setNewManufacturerName(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter" && newManufacturerName.trim()) {
                                                                        e.preventDefault()
                                                                        addManufacturer(editedDealership!, newManufacturerName.trim())
                                                                        setNewManufacturerName("")
                                                                    }
                                                                }}
                                                                placeholder="Or type new manufacturer name..."
                                                                className="bg-white/5 border-white/10 text-white text-sm"
                                                            />
                                                            <Button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (newManufacturerName.trim()) {
                                                                        addManufacturer(editedDealership!, newManufacturerName.trim())
                                                                        setNewManufacturerName("")
                                                                    }
                                                                }}
                                                                size="sm"
                                                                className="bg-[#d4af37] text-black hover:bg-[#d4af37]/90 [&>svg]:text-black"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

