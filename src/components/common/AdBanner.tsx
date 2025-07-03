'use client'

import { useEffect } from 'react'


export default function FooterSponsoredAd() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ADSENSE_ID) {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    }
  }, [])

  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) {
    return null
  }

  return (
    <div className="my-8 text-center">
      <p className="text-sm text-gray-500 mb-2">スポンサードリンク</p>
      <ins className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
          data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT}
          data-adtest={process.env.NEXT_PUBLIC_DEBUG_MODE==='true' ? 'on' : 'off'}>
      </ins>
    </div>
  )
}