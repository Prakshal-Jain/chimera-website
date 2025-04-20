"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import styles from "./events.module.css"
import { API_URL } from "../variables"
import CalendarOptionsMenu from "./calendar-options-menu"

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

interface EventsData {
  upcoming: Event[]
  past: Event[]
}

export default function EventsList() {
  const [eventsData, setEventsData] = useState<EventsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set())
  const [openCalendarMenu, setOpenCalendarMenu] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/events`)

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setEventsData(data)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError(err instanceof Error ? err.message : "Failed to load events")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Toggle description visibility
  const toggleDescription = (eventId: string) => {
    setExpandedEvents((prevExpanded) => {
      const newExpanded = new Set(prevExpanded)
      if (newExpanded.has(eventId)) {
        newExpanded.delete(eventId)
      } else {
        newExpanded.add(eventId)
      }
      return newExpanded
    })
  }

  // Toggle calendar menu
  const toggleCalendarMenu = (eventId: string) => {
    setOpenCalendarMenu((current) => (current === eventId ? null : eventId))
  }

  // Close calendar menu
  const closeCalendarMenu = () => {
    setOpenCalendarMenu(null)
  }

  // Format date: "Monday, January 1, 2023"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format time: "10:00 AM - 2:00 PM"
  const formatTimeRange = (startTimeString: string, endTimeString: string) => {
    const startTime = new Date(startTimeString)
    const endTime = new Date(endTimeString)

    return `${startTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })} - ${endTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`
  }

  // Group events by date
  const groupEventsByDate = (events: Event[]) => {
    const grouped: { [key: string]: Event[] } = {}

    events.forEach((event) => {
      const dateKey = event.date

      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }

      grouped[dateKey].push(event)
    })

    return grouped
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading events...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <p className={styles.errorHelp}>
          Please try again later or contact us at{" "}
          <Link href="mailto:chimera.autos@gmail.com" className={styles.link}>
            chimera.autos@gmail.com
          </Link>
        </p>
      </div>
    )
  }

  if (!eventsData) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyMessage}>No events data available.</p>
        <p className={styles.emptyHelp}>
          Please try again later or contact us at{" "}
          <Link href="mailto:chimera.autos@gmail.com" className={styles.link}>
            chimera.autos@gmail.com
          </Link>{" "}
          for more information.
        </p>
      </div>
    )
  }

  const events = activeTab === "upcoming" ? eventsData.upcoming : eventsData.past

  if (events.length === 0) {
    return (
      <div>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === "upcoming" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "past" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </button>
        </div>

        <div className={styles.emptyContainer}>
          <p className={styles.emptyMessage}>No {activeTab === "upcoming" ? "upcoming" : "past"} events available.</p>
          <p className={styles.emptyHelp}>
            {activeTab === "upcoming"
              ? "Check back soon for new events."
              : "Browse our upcoming events to see what's next."}
          </p>
        </div>
      </div>
    )
  }

  const groupedEvents = groupEventsByDate(events)
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => {
    // For upcoming events, sort dates in ascending order (nearest first)
    // For past events, sort dates in descending order (most recent first)
    return activeTab === "upcoming"
      ? new Date(a).getTime() - new Date(b).getTime()
      : new Date(b).getTime() - new Date(a).getTime()
  })

  return (
    <div>
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === "upcoming" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Events
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "past" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past Events
        </button>
      </div>

      <div className={styles.eventsContainer}>
        {sortedDates.map((dateKey) => {
          const eventsOnDate = groupedEvents[dateKey]
          const dateLabel = formatDate(dateKey)

          return (
            <div key={dateKey} className={styles.dateGroup}>
              <div className={styles.dateHeader}>
                <Calendar className={styles.dateIcon} />
                <h2 className={styles.dateTitle}>{dateLabel}</h2>
              </div>

              <div className={styles.eventsList}>
                {eventsOnDate.map((event, index) => {
                  const eventId = event.id || `${dateKey}-${index}`
                  const isExpanded = expandedEvents.has(eventId)
                  const isCalendarMenuOpen = openCalendarMenu === eventId
                  const timeRange = formatTimeRange(event.time.start, event.time.end)
                  const hasDescription = event.description && event.description.trim().length > 0

                  return (
                    <div key={eventId} className={styles.eventCard}>
                      <h3 className={styles.eventName}>{event.title}</h3>

                      <div className={styles.eventDetails}>
                        <div className={styles.eventDetail}>
                          <Clock className={styles.eventIcon} />
                          <span>{timeRange}</span>
                        </div>

                        <div className={styles.eventDetail}>
                          <MapPin className={styles.eventIcon} />
                          <span>{event.venue}</span>
                        </div>
                      </div>

                      {event.address && <p className={styles.eventAddress}>{event.address}</p>}

                      {hasDescription && (
                        <div className={styles.descriptionContainer}>
                          <button
                            className={styles.toggleButton}
                            onClick={() => toggleDescription(eventId)}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? "Show Less" : "Learn More"}
                            {isExpanded ? (
                              <ChevronUp className={styles.toggleIcon} />
                            ) : (
                              <ChevronDown className={styles.toggleIcon} />
                            )}
                          </button>

                          <div className={`${styles.eventDescription} ${isExpanded ? styles.expanded : ""}`}>
                            {event.description}
                          </div>
                        </div>
                      )}

                      <div className={styles.eventActions}>
                        {activeTab === "upcoming" && (
                          <CalendarOptionsMenu
                            event={event}
                            isOpen={isCalendarMenuOpen}
                            onClose={closeCalendarMenu}
                            onToggle={() => toggleCalendarMenu(eventId)}
                          />
                        )}

                        {event.link && (
                          <a href={event.link} target="_blank" rel="noopener noreferrer" className={styles.eventLink}>
                            More Information
                            <ExternalLink size={14} className={styles.linkIcon} />
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
