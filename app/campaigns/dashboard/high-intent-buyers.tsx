"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo, useState } from "react"
import { Trophy, MapPin, Clock, Activity, ExternalLink, ArrowUp, ArrowDown } from "lucide-react"

interface Log {
  persistent_user_id?: string
  additional_metadata?: Record<string, any>
  session_id: string
  timestamp: string
  ar_engagement_duration_seconds?: number
  success: boolean
  ar_engagement_status?: string
  qr_scanned?: boolean
  latitude?: number
  longitude?: number
  referer?: string
  x_forwarded_for?: string
  cta_clicked?: boolean
  cta_click_timestamp?: string
  cta_url?: string
  cta_title?: string
}

interface HighIntentBuyersProps {
  logs: Log[]
  onLocationClick?: (lat: number, lng: number) => void
}

interface BuyerData {
  id: string
  displayName: string
  intentScore: number
  city: string
  latitude?: number
  longitude?: number
  totalARTime: number
  sessionCount: number
  lastSeen: string
  engagementTimestamp: string
  userMetadata: Record<string, any>
  arSessionCount: number
  uniqueDaysEngaged: number
  hasQRtoAR: boolean
  ctaClickCount: number
}

export function HighIntentBuyers({ logs, onLocationClick }: HighIntentBuyersProps) {
  const [sortColumn, setSortColumn] = useState<keyof BuyerData>("intentScore")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Aggregate data per buyer
  const buyersData = useMemo(() => {
    const buyerMap = new Map<string, BuyerData>()

    logs.forEach((log) => {
      // Determine buyer ID using priority order: persistent_user_id > additional_metadata > session_id
      // This ensures consistent grouping - if persistent_user_id exists, use it; otherwise try metadata, then session_id
      let buyerId: string | null = null
      let displayName = "Anonymous"

      if (log.persistent_user_id) {
        // Priority 1: Use persistent_user_id if available
        buyerId = log.persistent_user_id
        displayName = log.persistent_user_id.substring(0, 20)
      } else if (log.additional_metadata && Object.keys(log.additional_metadata).length > 0) {
        // Priority 2: Try to find useful identifier in additional_metadata
        const metadata = log.additional_metadata
        if (metadata.email) {
          buyerId = metadata.email
          displayName = metadata.email
        } else if (metadata.name) {
          buyerId = metadata.name
          displayName = metadata.name
        } else if (metadata.u && metadata.u.trim() !== "") {
          // Only use metadata.u if it's not empty
          buyerId = metadata.u
          displayName = metadata.u || "User"
        } else {
          // Fallback to session_id if metadata exists but has no useful identifier
          buyerId = log.session_id
          displayName = `Session ${log.session_id.substring(0, 12)}`
        }
      } else {
        // Priority 3: Use session_id as fallback
        buyerId = log.session_id
        displayName = `Session ${log.session_id.substring(0, 12)}`
      }

      if (!buyerId) return

      // Get or create buyer data
      let buyer = buyerMap.get(buyerId)
      if (!buyer) {
        buyer = {
          id: buyerId,
          displayName,
          intentScore: 0,
          city: "Unknown",
          latitude: log.latitude,
          longitude: log.longitude,
          totalARTime: 0,
          sessionCount: 0,
          lastSeen: log.timestamp,
          engagementTimestamp: log.timestamp,
          userMetadata: log.additional_metadata || {},
          arSessionCount: 0,
          uniqueDaysEngaged: 0,
          hasQRtoAR: false,
          ctaClickCount: 0,
        }
        buyerMap.set(buyerId, buyer)
      }

      // Update buyer data
      // Note: sessionCount will be calculated later from unique sessions
      
      // Accumulate AR time
      if (log.ar_engagement_duration_seconds) {
        buyer.totalARTime += log.ar_engagement_duration_seconds
      }

      // Check for QR to AR conversion (scanned on computer then viewed on mobile)
      if (log.qr_scanned) {
        buyer.hasQRtoAR = true
      }

      // Track CTA clicks
      if (log.cta_clicked) {
        buyer.ctaClickCount += 1
      }

      // Update last seen and track first engagement timestamp
      if (new Date(log.timestamp) > new Date(buyer.lastSeen)) {
        buyer.lastSeen = log.timestamp
        // Update location to most recent
        if (log.latitude && log.longitude) {
          buyer.latitude = log.latitude
          buyer.longitude = log.longitude
        }
      }
      
      // Track first engagement timestamp (earliest timestamp)
      if (new Date(log.timestamp) < new Date(buyer.engagementTimestamp)) {
        buyer.engagementTimestamp = log.timestamp
      }
      
      // Update user metadata if we have more complete metadata
      if (log.additional_metadata && Object.keys(log.additional_metadata).length > 0) {
        buyer.userMetadata = { ...buyer.userMetadata, ...log.additional_metadata }
      }

      // Try to get city from location (simplified - you'd use reverse geocoding in production)
      if (log.latitude && log.longitude) {
        buyer.city = `${log.latitude.toFixed(4)}, ${log.longitude.toFixed(4)}`
      }
    })

    // Calculate unique days engaged, sessions, AR sessions, and intent score for each buyer
    // Filter logs that belong to this buyer using the same priority logic
    buyerMap.forEach((buyer) => {
      const buyerLogs = logs.filter((log) => {
        // Match logs that have the same identifier we used to create this buyer
        // Check in priority order to ensure we capture all related logs
        if (log.persistent_user_id && buyer.id === log.persistent_user_id) return true
        if (log.additional_metadata) {
          const metadata = log.additional_metadata
          if (metadata.email === buyer.id || metadata.name === buyer.id || (metadata.u && metadata.u === buyer.id)) return true
        }
        return log.session_id === buyer.id
      })

      // Calculate unique days
      const uniqueDays = new Set(buyerLogs.map((log) => new Date(log.timestamp).toLocaleDateString())).size
      buyer.uniqueDaysEngaged = uniqueDays

      // Calculate unique sessions (count distinct session_ids)
      const uniqueSessions = new Set(buyerLogs.map((log) => log.session_id)).size
      buyer.sessionCount = uniqueSessions

      // Calculate unique AR sessions (sessions where AR was engaged)
      // Count sessions with ar_engagement_duration_seconds > 0 OR
      // sessions with ar_engagement_status indicating engagement (active/completed/recovered) AND success: true
      const arSessionIds = new Set(
        buyerLogs
          .filter((log) => {
            // Count if there's engagement duration
            if (log.ar_engagement_duration_seconds && log.ar_engagement_duration_seconds > 0) {
              return true
            }
            // Or if status indicates engagement and it was successful
            if (
              log.ar_engagement_status &&
              (log.ar_engagement_status === "active" ||
                log.ar_engagement_status === "completed" ||
                log.ar_engagement_status === "recovered") &&
              log.success
            ) {
              return true
            }
            return false
          })
          .map((log) => log.session_id)
      )
      buyer.arSessionCount = arSessionIds.size

      // Calculate Intent Score (0-100)
      // Weights based on requirements:
      // - Total AR time (Σ ar_engagement_duration_seconds): primary weight
      // - Number of AR sessions: weighted
      // - Number of separate days engaged: weighted
      // - QR→AR bonus (scanned on computer): bonus
      // - CTA clicks: high weight (strong buying signal)
      // - Recency (more recent = higher): small weight
      //
      // Scoring breakdown:
      // - Total AR time: 40 points (1 point per 10 seconds, max 400 seconds = 40 points)
      // - # of AR sessions: 30 points (6 points per session, max 5 sessions = 30 points)
      // - # of separate days: 12 points (6 points per day, max 2 days = 12 points)
      // - QR to AR bonus: 5 points (if has AR engagement) or 2 points (QR-only, no engagement)
      // - CTA clicks: 35 points (35 points per click, max 1 click = 35 points) - VERY HIGH WEIGHT (post-engagement conversion)
      // - Recency: 5 points (decays over 30 days)
      // Total max: 127 points (122 max for QR-only users without engagement)

      const timeScore = Math.min(buyer.totalARTime / 10, 40)
      const sessionScore = Math.min(buyer.arSessionCount * 6, 30)
      const daysScore = Math.min(uniqueDays * 6, 12)
      // QR bonus: 5 points if buyer has AR engagement, 2 points if QR-only (signal but no action)
      // This ensures actual engagement always outranks QR-only users
      const qrBonus = buyer.hasQRtoAR ? (buyer.totalARTime > 0 ? 5 : 2) : 0
      
      // CTA click score: 35 points per click (very high weight - post-engagement conversion signal)
      // Max 1 click = 35 points to prevent gaming
      // This is weighted highly because CTA only appears AFTER AR experience, making it a strong buying intent signal
      const ctaScore = Math.min(buyer.ctaClickCount * 35, 35)

      // Recency score (5 points if within last day, decays linearly over 30 days)
      const daysSinceLastSeen = (Date.now() - new Date(buyer.lastSeen).getTime()) / (1000 * 60 * 60 * 24)
      const recencyScore = Math.max(0, 5 * (1 - daysSinceLastSeen / 30))

      buyer.intentScore = Math.round(timeScore + sessionScore + daysScore + qrBonus + ctaScore + recencyScore)
    })

    return Array.from(buyerMap.values())
  }, [logs])

  // Sort buyers
  const sortedBuyers = useMemo(() => {
    const sorted = [...buyersData]
    sorted.sort((a, b) => {
      let aValue = a[sortColumn]
      let bValue = b[sortColumn]

      // Handle string comparison for dates
      if (sortColumn === "lastSeen" || sortColumn === "engagementTimestamp") {
        const aDate = sortColumn === "lastSeen" ? a.lastSeen : a.engagementTimestamp
        const bDate = sortColumn === "lastSeen" ? b.lastSeen : b.engagementTimestamp
        aValue = new Date(aDate).getTime()
        bValue = new Date(bDate).getTime()
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "desc" ? bValue - aValue : aValue - bValue
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "desc" ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue)
      }
      return 0
    })
    return sorted
  }, [buyersData, sortColumn, sortDirection])

  // Calculate relative intent labels based on score distribution
  const intentLabelMap = useMemo(() => {
    if (buyersData.length === 0) return new Map<string, "High" | "Medium" | "Low">()
    
    const labelMap = new Map<string, "High" | "Medium" | "Low">()
    
    // Get all scores and calculate statistics
    const scores = buyersData.map(b => b.intentScore).sort((a, b) => a - b)
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length
    
    // Calculate standard deviation
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length
    const stdDev = Math.sqrt(variance)
    
    // Use quartiles for more logical distribution
    const q1Index = Math.floor(scores.length * 0.25)
    const q3Index = Math.floor(scores.length * 0.75)
    const q1 = scores[q1Index] || 0
    const q3 = scores[q3Index] || 0
    const median = scores[Math.floor(scores.length * 0.5)] || 0
    
    // Determine thresholds using a combination of quartiles and standard deviation
    // High: Above Q3 or above mean + 0.5*stdDev (whichever is more conservative)
    // Medium: Between Q1 and Q3, or within 0.5*stdDev of mean
    // Low: Below Q1 or below mean - 0.5*stdDev
    
    const highThreshold = Math.max(q3, mean + 0.5 * stdDev)
    const lowThreshold = Math.min(q1, mean - 0.5 * stdDev)
    
    // If all scores are very similar (low variance), use relative ranking
    // Otherwise use score-based thresholds
    const useScoreBased = stdDev > 5 || (q3 - q1) > 10
    
    buyersData.forEach((buyer) => {
      if (useScoreBased) {
        // Use score-based thresholds
        if (buyer.intentScore >= highThreshold) {
          labelMap.set(buyer.id, "High")
        } else if (buyer.intentScore >= lowThreshold) {
          labelMap.set(buyer.id, "Medium")
        } else {
          labelMap.set(buyer.id, "Low")
        }
      } else {
        // Fallback to relative ranking if scores are too similar
        // Sort by score to get relative position
        const sortedByScore = [...buyersData].sort((a, b) => b.intentScore - a.intentScore)
        const rank = sortedByScore.findIndex(b => b.id === buyer.id)
        const percentile = rank / sortedByScore.length
        
        if (percentile < 0.2) {
          labelMap.set(buyer.id, "High")
        } else if (percentile < 0.6) {
          labelMap.set(buyer.id, "Medium")
        } else {
          labelMap.set(buyer.id, "Low")
        }
      }
    })
    
    return labelMap
  }, [buyersData])

  const toggleSort = (column: keyof BuyerData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const getIntentBadgeColor = (label: "High" | "Medium" | "Low") => {
    if (label === "High") return "bg-red-500/20 text-red-300 border-red-500/30"
    if (label === "Medium") return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    return "bg-blue-500/20 text-blue-300 border-blue-500/30"
  }

  const getIntentLabel = (buyerId: string): "High" | "Medium" | "Low" => {
    return intentLabelMap.get(buyerId) || "Low"
  }

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "N/A"
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric",
      year: "numeric"
    })
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    })
    return `${dateStr} ${timeStr}`
  }

  const SortIcon = ({ column }: { column: keyof BuyerData }) => {
    if (sortColumn !== column) return null
    return sortDirection === "desc" ? (
      <ArrowDown className="h-3.5 w-3.5 ml-1 inline" />
    ) : (
      <ArrowUp className="h-3.5 w-3.5 ml-1 inline" />
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[#d4af37]" />
          <div>
            <CardTitle className="text-xl font-serif font-light text-white">High-Intent Buyers Leaderboard</CardTitle>
            <CardDescription className="text-white/60">
              Ranked by buying signals and engagement patterns
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto overflow-y-auto max-h-[350px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-white/80">Rank</th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-white/80 cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSort("displayName")}
                >
                  Buyer / ID <SortIcon column="displayName" />
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-white/80 cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSort("intentScore")}
                >
                  Intent Score <SortIcon column="intentScore" />
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-white/80 cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSort("city")}
                >
                  City <SortIcon column="city" />
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-white/80 cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSort("totalARTime")}
                >
                  Total AR Time <SortIcon column="totalARTime" />
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-white/80 cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSort("sessionCount")}
                >
                  Sessions <SortIcon column="sessionCount" />
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-white/80 cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSort("lastSeen")}
                >
                  Last Seen <SortIcon column="lastSeen" />
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-white/80 cursor-pointer hover:text-white transition-colors"
                  onClick={() => toggleSort("engagementTimestamp")}
                >
                  Link opened timestamp <SortIcon column="engagementTimestamp" />
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-white/80">
                  User Metadata
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBuyers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-white/60">
                    No buyer data available
                  </td>
                </tr>
              ) : (
                sortedBuyers.map((buyer, index) => (
                  <tr key={buyer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {index < 3 ? (
                          <Trophy
                            className={`h-5 w-5 ${
                              index === 0 ? "text-[#d4af37]" : index === 1 ? "text-gray-400" : "text-amber-700"
                            }`}
                          />
                        ) : (
                          <span className="text-white/60 font-medium w-5 text-center">{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium text-sm truncate max-w-[200px]">
                          {buyer.displayName}
                        </span>
                        {buyer.hasQRtoAR && (
                          <span className="text-xs text-[#d4af37] flex items-center gap-1 mt-0.5">
                            <Activity className="h-3 w-3" />
                            QR→AR
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-serif font-light text-white">{buyer.intentScore}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getIntentBadgeColor(getIntentLabel(buyer.id))}`}
                        >
                          {getIntentLabel(buyer.id)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {buyer.latitude && buyer.longitude ? (
                        <button
                          onClick={() => onLocationClick?.(buyer.latitude!, buyer.longitude!)}
                          className="flex items-center gap-1.5 text-white/80 hover:text-[#d4af37] transition-colors text-sm group"
                        >
                          <MapPin className="h-4 w-4" />
                          <span className="truncate max-w-[120px]">{buyer.city}</span>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ) : (
                        <span className="text-white/60 text-sm">{buyer.city}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <Clock className="h-4 w-4 text-white/60" />
                        {formatTime(buyer.totalARTime)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white text-sm">
                        <span className="font-medium">{buyer.sessionCount}</span>
                        <span className="text-white/60 text-xs ml-1">({buyer.uniqueDaysEngaged}d)</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white/80 text-sm">{formatDate(buyer.lastSeen)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white/80 text-sm">{formatDate(buyer.engagementTimestamp)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-white/80 text-xs max-w-[200px]">
                        {Object.keys(buyer.userMetadata).length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {Object.entries(buyer.userMetadata)
                              .filter(([key, value]) => value && value.toString().trim() !== "")
                              .map(([key, value]) => (
                                <div key={key} className="truncate" title={`${key}: ${value}`}>
                                  <span className="text-white/60">{key}:</span>{" "}
                                  <span className="text-white/90">{String(value)}</span>
                                </div>
                              ))}
                            {Object.entries(buyer.userMetadata).filter(([key, value]) => value && value.toString().trim() !== "").length === 0 && (
                              <span className="text-white/40 italic">No metadata</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-white/40 italic">No metadata</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
