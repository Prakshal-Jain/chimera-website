"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../variables"

interface ARFile {
  filename: string
  size: number
  s3Url?: string
  directS3Url?: string
  campaignCode?: string | null
}

interface ARData {
  files: ARFile[]
  count: number
}

export default function TestUSDZModelsPage() {
  const [arData, setArData] = useState<ARData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchARData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/ar-view/`)
        if (!response.ok) {
          throw new Error(`Failed to fetch AR data: ${response.status} ${response.statusText}`)
        }
        const data = await response.json()
        setArData(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch AR data"
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchARData()
  }, [])

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>CloudFront USDZ Models Test Page</h1>
      
      {isLoading && <p>Loading models...</p>}
      
      {error && (
        <div style={{ color: "red", padding: "10px", backgroundColor: "#ffe6e6", margin: "10px 0" }}>
          Error: {error}
        </div>
      )}
      
      {arData && (
        <div>
          <p>Total models: {arData.count}</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {arData.files.map((file) => {
              const url = file.s3Url || file.directS3Url
              return (
                <li key={file.filename} style={{ margin: "20px 0", padding: "10px", border: "1px solid #ccc" }}>
                  <div>
                    <strong>{file.filename}</strong>
                    {file.campaignCode && <span style={{ marginLeft: "10px", color: "#666" }}>(Campaign: {file.campaignCode})</span>}
                  </div>
                  {url ? (
                    <div>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          display: "inline-block", 
                          marginTop: "5px", 
                          color: "#0066cc",
                          wordBreak: "break-all"
                        }}
                      >
                        {url}
                      </a>
                      <br />
                      <a 
                        href={url} 
                        rel="ar"
                        style={{ 
                          display: "inline-block", 
                          marginTop: "10px", 
                          padding: "8px 16px", 
                          backgroundColor: "#0066cc", 
                          color: "white", 
                          textDecoration: "none",
                          borderRadius: "4px"
                        }}
                      >
                        View in AR (iOS)
                      </a>
                    </div>
                  ) : (
                    <div style={{ color: "red", marginTop: "5px" }}>No URL available</div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

