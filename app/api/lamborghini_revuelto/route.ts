import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    // Check if the request is from an iOS device
    const userAgent = request.headers.get('user-agent') || ''
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !/MSStream/.test(userAgent)
    
    if (!isIOS) {
      // Return a message for non-iOS devices
      return NextResponse.json({
        error: 'AR View not supported',
        message: 'We currently do not support AR View on Android devices. Please use an iOS device (iPhone or iPad) to experience AR.',
        supportedDevices: ['iPhone', 'iPad']
      }, { status: 400 })
    }

    // Path to the USDZ file in the public directory
    const filePath = join(process.cwd(), 'public', 'lamborghini_revuelto.3d_model_source.usdz')
    
    // Read the file
    const fileBuffer = readFileSync(filePath)
    
    // Return the file with appropriate headers for AR Quick Look
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'model/vnd.usdz+zip',
        'Content-Disposition': 'inline; filename="lamborghini_revuelto.3d_model_source.usdz"',
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    })
  } catch (error) {
    console.error('Error serving USDZ file:', error)
    return NextResponse.json({
      error: 'File not found',
      message: 'The AR model file could not be found or loaded.'
    }, { status: 404 })
  }
}
