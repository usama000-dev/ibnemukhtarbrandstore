// components/FacebookPixel.js
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import { useEffect, useState } from 'react'

const FacebookPixel = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && typeof window.fbq !== 'undefined') {
      // Track page view on route changes
      window.fbq('track', 'PageView')
      
      // Additional debug info
      console.log('Facebook Pixel PageView tracked')
    }
  }, [pathname, searchParams, isMounted])

  return (
    <>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Facebook Pixel loaded successfully')
        }}
        onError={(e) => {
          console.error('Facebook Pixel failed to load', e)
        }}
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;
              n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            
            // Initialize with your Pixel ID
            fbq('init', '1112258920833652');
            
            // Track initial page view
            fbq('track', 'PageView');
            
            // Debug info
            console.log('Facebook Pixel initialized');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1112258920833652&ev=PageView&noscript=1"
          alt="Facebook Pixel fallback"
        />
      </noscript>
    </>
  )
}

export default FacebookPixel

// // components/FacebookPixel.js
// 'use client'

// import { usePathname, useSearchParams } from 'next/navigation'
// import Script from 'next/script'
// import { useEffect, useState } from 'react'

// const FacebookPixel = () => {
//   const pathname = usePathname()
//   const searchParams = useSearchParams()
//   const [consentGiven, setConsentGiven] = useState(false)

//   // Check if user has given consent (you'll need to implement your consent logic)
//   useEffect(() => {
//     // This is a placeholder - implement based on your consent mechanism
//     const hasConsent = localStorage.getItem('cookieConsent') === 'true'
//     setConsentGiven(hasConsent)
//   }, [])

//   useEffect(() => {
//     if (consentGiven && typeof window.fbq !== 'undefined') {
//       window.fbq('track', 'PageView')
//     }
//   }, [pathname, searchParams, consentGiven])

//   if (!consentGiven) return null

//   return (
//     <>
//       <Script
//         id="fb-pixel"
//         strategy="afterInteractive"
//         dangerouslySetInnerHTML={{
//           __html: `
//             !function(f,b,e,v,n,t,s)
//             {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//             n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//             if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//             n.queue=[];t=b.createElement(e);t.async=!0;
//             t.src=v;s=b.getElementsByTagName(e)[0];
//             s.parentNode.insertBefore(t,s)}(window, document,'script',
//             'https://connect.facebook.net/en_US/fbevents.js');
//             fbq('init', '1112258920833652');
//             fbq('track', 'PageView');
//           `,
//         }}
//       />
//       <noscript>
//         <img
//           height="1"
//           width="1"
//           style={{ display: 'none' }}
//           src="https://www.facebook.com/tr?id=1112258920833652&ev=PageView&noscript=1"
//         />
//       </noscript>
//     </>
//   )
// }

// export default FacebookPixel
