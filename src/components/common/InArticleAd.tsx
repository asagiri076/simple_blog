'use client'

import { useEffect } from 'react'

export default function InArticleAd() {
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
    <div className="my-6 flex justify-center">
      <div className="w-full max-w-md">
        <p className="text-xs text-gray-400 mb-2 text-center">広告</p>
        <ins className="adsbygoogle"
            style={{ 
              display: 'block', 
              textAlign: 'center',
              minHeight: '200px'
            }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
            data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT}
            data-adtest={process.env.NEXT_PUBLIC_DEBUG_MODE==='true' ? 'on' : 'off'}>
        </ins>
      </div>
    </div>
  )
}