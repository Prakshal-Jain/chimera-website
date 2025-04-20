const IS_PRODUCTION = false
const PRODUCTION_API_URL = "https://api.chimeraauto.com"
const DEVELOPMENT_API_URL = "http://localhost:8000"

export const API_URL = IS_PRODUCTION ? PRODUCTION_API_URL : DEVELOPMENT_API_URL