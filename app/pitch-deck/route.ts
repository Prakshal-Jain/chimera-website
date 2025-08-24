import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Path to the PDF file in the public directory
    const pdfPath = path.join(process.cwd(), 'public', 'pitch-deck.pdf');
    
    // Read the PDF file
    const pdfBuffer = await readFile(pdfPath);
    
    // Return the PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="chimera-pitch-deck.pdf"',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving pitch deck PDF:', error);
    return new NextResponse('PDF not found', { 
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
