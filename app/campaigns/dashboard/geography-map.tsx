"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe } from "lucide-react"

// Import CSS files - Next.js will handle these
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

interface GeographyMapProps {
  logs: Array<{
    latitude?: number
    longitude?: number
    persistent_user_id?: string
    timestamp: string
    success?: boolean
    ar_engagement_status?: string
  }>
}

export function GeographyMap({ logs }: GeographyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [locationStats, setLocationStats] = useState({
    totalLocations: 0,
    totalUsers: 0,
    topCity: "",
  })

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    // Clean up existing map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    // Dynamically import Leaflet only on client side
    const loadMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet.markercluster")

      // Fix for default marker icons in webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      if (!mapRef.current) return

      // Create map centered on USA (can adjust based on data)
      const map = L.map(mapRef.current).setView([37.8, -96], 4)

      // Add dark themed tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      // Process logs to extract location data
      const locationData: Array<{
        lat: number
        lng: number
        userId: string
        timestamp: string
        success: boolean
      }> = []

      const uniqueUsers = new Set<string>()

      logs.forEach((log) => {
        if (log.latitude && log.longitude) {
          locationData.push({
            lat: log.latitude,
            lng: log.longitude,
            userId: log.persistent_user_id || "anonymous",
            timestamp: log.timestamp,
            success: log.success || false,
          })
          if (log.persistent_user_id) {
            uniqueUsers.add(log.persistent_user_id)
          }
        }
      })

      // Create custom icons for individual markers
      const goldIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
                    background: radial-gradient(circle, rgba(251,191,36,0.95) 0%, rgba(251,191,36,0.7) 100%);
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 3px solid rgba(251,191,36,1);
                    box-shadow: 0 0 20px rgba(251,191,36,0.9), 0 0 10px rgba(251,191,36,0.6);
                    position: relative;
                "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const redIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
                    background: radial-gradient(circle, rgba(239,68,68,0.95) 0%, rgba(239,68,68,0.7) 100%);
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 3px solid rgba(239,68,68,1);
                    box-shadow: 0 0 20px rgba(239,68,68,0.9), 0 0 10px rgba(239,68,68,0.6);
                    position: relative;
                "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      // Create marker cluster group with custom rectangular styling
      const markers = (L as any).markerClusterGroup({
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount()
          
          // Determine size based on count
          let width = 40
          let height = 30
          let fontSize = 14
          let padding = "6px 10px"
          
          if (count > 50) {
            width = 60
            height = 40
            fontSize = 16
            padding = "8px 14px"
          } else if (count > 20) {
            width = 50
            height = 35
            fontSize = 15
            padding = "7px 12px"
          }

          return L.divIcon({
            html: `<div style="
                            background: linear-gradient(135deg, rgba(251,191,36,0.85) 0%, rgba(251,146,60,0.85) 100%);
                            border: 2px solid rgba(251,191,36,1);
                            border-radius: 8px;
                            color: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: bold;
                            font-size: ${fontSize}px;
                            padding: ${padding};
                            box-shadow: 0 2px 8px rgba(251,191,36,0.5), 0 0 15px rgba(251,191,36,0.3);
                            min-width: ${width}px;
                            height: ${height}px;
                            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                        ">${count}</div>`,
            className: "custom-cluster-icon",
            iconSize: L.point(width, height),
            iconAnchor: L.point(width / 2, height / 2),
          })
        },
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
      })

      // Add markers for each location
      locationData.forEach((location) => {
        const marker = L.marker([location.lat, location.lng], {
          icon: location.success ? goldIcon : redIcon,
        })

        const formattedDate = new Date(location.timestamp).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })

        marker.bindPopup(`
                    <div style="
                        background: rgba(0,0,0,0.95);
                        padding: 12px;
                        border-radius: 8px;
                        border: 1px solid rgba(212,175,55,0.5);
                        min-width: 200px;
                    ">
                        <div style="color: #d4af37; font-weight: 600; margin-bottom: 8px; font-size: 14px;">
                            ${location.success ? "✓ Successful View" : "✗ Failed View"}
                        </div>
                        <div style="color: rgba(255,255,255,0.8); font-size: 12px; margin-bottom: 4px;">
                            <strong>User:</strong> ${location.userId.substring(0, 20)}...
                        </div>
                        <div style="color: rgba(255,255,255,0.8); font-size: 12px; margin-bottom: 4px;">
                            <strong>Location:</strong> ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}
                        </div>
                        <div style="color: rgba(255,255,255,0.6); font-size: 11px;">
                            ${formattedDate}
                        </div>
                    </div>
                `)

        markers.addLayer(marker)
      })

      map.addLayer(markers)

      // Add heatmap layer
      if (locationData.length > 0) {
        const HeatmapOverlay = (await import("leaflet-heatmap")).default

        const heatmapConfig = {
          radius: 25,
          maxOpacity: 0.6,
          scaleRadius: true,
          useLocalExtrema: false,
          gradient: {
            0.0: "rgba(59, 130, 246, 0)",
            0.3: "rgba(59, 130, 246, 0.5)",
            0.5: "rgba(212, 175, 55, 0.7)",
            0.7: "rgba(251, 191, 36, 0.8)",
            1.0: "rgba(239, 68, 68, 1)",
          },
        }

        const heatmapLayer = new HeatmapOverlay(heatmapConfig)
        heatmapLayer.addTo(map)

        const heatmapData = {
          max: 10,
          data: locationData.map((loc) => ({
            lat: loc.lat,
            lng: loc.lng,
            count: 1,
          })),
        }

        heatmapLayer.setData(heatmapData)
      }

      // Update stats
      setLocationStats({
        totalLocations: locationData.length,
        totalUsers: uniqueUsers.size,
        topCity: locationData.length > 0 ? "Multiple Locations" : "No data",
      })

      mapInstanceRef.current = map
    }

    loadMap().catch(console.error)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [logs])

  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-serif font-light text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#d4af37]" />
              User Geography
            </CardTitle>
            <CardDescription className="text-white/60">
              Interactive heatmap showing user engagement locations
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-serif font-light text-white">{locationStats.totalLocations}</p>
              <p className="text-xs text-white/60">Total Sessions</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-serif font-light text-white">{locationStats.totalUsers}</p>
              <p className="text-xs text-white/60">Unique Users</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          style={{
            height: "500px",
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#d4af37] border-2 border-[#d4af37] shadow-lg shadow-[#d4af37]/50" />
            <span className="text-white/70">Successful AR Views</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-red-500 shadow-lg shadow-red-500/50" />
            <span className="text-white/70">Failed/QR Code Shown</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 via-[#d4af37] to-red-500" />
            <span className="text-white/70">Engagement Heatmap</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-white/50 leading-relaxed">
            <span className="text-white/60 font-medium">Note:</span> Location data is approximate and aggregated for privacy. User coordinates are anonymized and intentionally generalized, so actual engagement may occur within a broader area than shown.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
