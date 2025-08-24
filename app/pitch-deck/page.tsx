'use client';

import { useEffect } from 'react';

export default function PitchDeckPage() {
  useEffect(() => {
    // Redirect to the PDF file in the public directory
    window.location.href = '/pitch-deck.pdf';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <p>Redirecting to pitch deck...</p>
      <p>
        If you are not redirected automatically, 
        <a href="/pitch-deck.pdf" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          click here
        </a>
      </p>
    </div>
  );
}
