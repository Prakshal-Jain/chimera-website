declare module "leaflet-heatmap" {
  import * as L from "leaflet"

  interface HeatmapConfig {
    radius?: number
    maxOpacity?: number
    scaleRadius?: boolean
    useLocalExtrema?: boolean
    gradient?: { [key: string]: string }
  }

  interface HeatmapData {
    max: number
    data: Array<{
      lat: number
      lng: number
      count: number
    }>
  }

  class HeatmapOverlay {
    constructor(config: HeatmapConfig)
    setData(data: HeatmapData): void
    addTo(map: L.Map): this
  }

  export default HeatmapOverlay
}

