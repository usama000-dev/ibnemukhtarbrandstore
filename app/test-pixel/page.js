// app/test-pixel/page.js
'use client'

import { useState } from 'react'

export default function TestPixelPage() {
  const [testResults, setTestResults] = useState('')

  const testPixel = () => {
    if (typeof window.fbq !== 'undefined') {
      // Test standard events
      window.fbq('track', 'ViewContent', {
        content_name: 'Test Product',
        content_category: 'Test Category',
        content_ids: ['test123'],
        content_type: 'product',
        value: 99.99,
        currency: 'USD'
      })
      
      setTestResults('Event sent successfully! Check Facebook Events Manager.')
      console.log('Test event sent to Facebook Pixel')
    } else {
      setTestResults('Error: Facebook Pixel not loaded')
      console.error('Facebook Pixel not available')
    }
  }

  const checkPixel = () => {
    if (typeof window.fbq !== 'undefined') {
      setTestResults('Pixel is loaded and available')
      console.log('Facebook Pixel is available:', window.fbq)
    } else {
      setTestResults('Pixel is NOT loaded')
      console.error('Facebook Pixel not found')
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Facebook Pixel Test Page</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={checkPixel}
          style={{ padding: '10px 15px', marginRight: '10px', background: '#0070f3', color: 'white', border: 'none' }}
        >
          Check Pixel Status
        </button>
        
        <button 
          onClick={testPixel}
          style={{ padding: '10px 15px', background: '#0070f3', color: 'white', border: 'none' }}
        >
          Send Test Event
        </button>
      </div>
      
      {testResults && (
        <div style={{ 
          padding: '1rem', 
          background: '#f0f0f0', 
          border: '1px solid #ccc',
          marginBottom: '1rem'
        }}>
          <h3>Test Results:</h3>
          <p>{testResults}</p>
        </div>
      )}
      
      <div style={{ background: '#f9f9f9', padding: '1rem', border: '1px solid #eee' }}>
        <h3>Next Steps:</h3>
        <ol>
          <li>Click &#34;Check Pixel Status&#34; to verify the pixel is loaded</li>
          <li>Click &#34;Send Test Event&#34; to test event tracking</li>
          <li>Open Facebook Events Manager → Test Events tool</li>
          <li>Check if events appear in the tool</li>
        </ol>
        
        <p>
          <strong>Note:</strong> It may take a few minutes for events to appear in Events Manager.
          The Pixel Helper extension might not work on Vercel domains, so rely on the Test Events tool.
        </p>
      </div>
    </div>
  )
}