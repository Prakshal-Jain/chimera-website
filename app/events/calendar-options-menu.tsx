"use client"

import { useEffect, useRef } from "react"
import { CalendarPlus } from "lucide-react"
import styles from "./events.module.css"

interface EventTime {
    start: string
    end: string
}

interface Event {
    id?: string
    title: string
    date: string
    time: EventTime
    description: string
    venue: string
    address?: string
    link?: string
}

interface CalendarOptionsMenuProps {
    event: Event
    isOpen: boolean
    onClose: () => void
    onToggle: () => void
}

export default function CalendarOptionsMenu({ event, isOpen, onClose, onToggle }: CalendarOptionsMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Generate iCalendar file and trigger download
    const addToCalendar = (event: Event) => {
        // Format dates for iCalendar (YYYYMMDDTHHMMSSZ)
        const formatICSDate = (dateTimeStr: string) => {
            const date = new Date(dateTimeStr)
            return date.toISOString().replace(/-|:|\.\d+/g, "")
        }

        const startDate = formatICSDate(event.time.start)
        const endDate = formatICSDate(event.time.end)

        // Create location string
        const location = event.address ? `${event.venue}, ${event.address}` : event.venue

        // Create iCalendar content
        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            "BEGIN:VEVENT",
            `SUMMARY:${event.title}`,
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            `LOCATION:${location}`,
            `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
            "STATUS:CONFIRMED",
            `ORGANIZER;CN=Chimera:mailto:chimera.autos@gmail.com`,
            "END:VEVENT",
            "END:VCALENDAR",
        ].join("\r\n")

        // Create a Blob with the iCalendar content
        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })

        // Create a download link and trigger it
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `${event.title.replace(/\s+/g, "_")}.ics`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Alternative: Open Google Calendar with event details
    const openGoogleCalendar = (event: Event) => {
        const startTime = new Date(event.time.start)
        const endTime = new Date(event.time.end)

        // Format dates for Google Calendar URL
        const formatGoogleDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d+/g, "")
        }

        const startDate = formatGoogleDate(startTime)
        const endDate = formatGoogleDate(endTime)

        // Create location string
        const location = event.address ? `${event.venue}, ${event.address}` : event.venue

        // Build Google Calendar URL
        const googleCalendarUrl = new URL("https://calendar.google.com/calendar/render")
        googleCalendarUrl.searchParams.append("action", "TEMPLATE")
        googleCalendarUrl.searchParams.append("text", event.title)
        googleCalendarUrl.searchParams.append("dates", `${startDate}/${endDate}`)
        googleCalendarUrl.searchParams.append("details", event.description)
        googleCalendarUrl.searchParams.append("location", location)

        // Open Google Calendar in a new tab
        window.open(googleCalendarUrl.toString(), "_blank")
    }

    // Handle clicks outside the menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Check if the click is outside both the menu and the toggle button
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                onClose()
            }
        }

        // Add event listener if menu is open
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        // Clean up event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    return (
        <div className={styles.calendarContainer}>
            <button ref={buttonRef} className={styles.attendButton} onClick={onToggle}>
                <CalendarPlus size={16} className={styles.attendIcon} />
                Add to Calendar
            </button>

            {isOpen && (
                <div ref={menuRef} className={styles.calendarOptions}>
                    <button className={styles.calendarOption} onClick={() => addToCalendar(event)}>
                        Download .ics File
                    </button>
                    <button className={styles.calendarOption} onClick={() => openGoogleCalendar(event)}>
                        Add to Google Calendar
                    </button>
                </div>
            )}
        </div>
    )
}
