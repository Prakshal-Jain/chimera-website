const IS_PRODUCTION = true

const PRODUCTION_API_URL = "https://api.chimeraauto.com/api"
const DEVELOPMENT_API_URL = "http://localhost:8000/api"

export const API_URL = IS_PRODUCTION ? PRODUCTION_API_URL : DEVELOPMENT_API_URL

// Feature flags
export const ENABLE_VISION_ASSESSMENT = false // Set to true to enable vision assessment step