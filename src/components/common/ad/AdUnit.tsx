interface AdUnitProps {
  type: 'footer' | 'article'
  className?: string
}

/**
 * 広告表示用コンポーネント
 * AdProviderで初期化済みのAdSenseを使用して広告を表示
 */
export default function AdUnit({ type, className }: AdUnitProps) {
  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) {
    return null
  }

  // 広告タイプごとの設定
  const adConfig = {
    footer: {
      slot: process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT,
      label: 'スポンサードリンク',
      containerClass: 'my-8 text-center',
      labelClass: 'text-sm text-gray-500 mb-2',
      style: { display: 'block', textAlign: 'center' as const }
    },
    article: {
      slot: process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT,
      label: '広告',
      containerClass: 'my-6 flex justify-center',
      labelClass: 'text-xs text-gray-400 mb-2 text-center',
      style: { 
        display: 'block', 
        textAlign: 'center' as const,
        minHeight: '200px'
      }
    }
  }

  const config = adConfig[type]

  return (
    <div className={`${config.containerClass} ${className || ''}`}>
      {type === 'article' && (
        <div className="w-full max-w-md">
          <p className={config.labelClass}>{config.label}</p>
          <ins 
            className="adsbygoogle"
            style={config.style}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
            data-ad-slot={config.slot}
            data-adtest={process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' ? 'on' : 'off'}
          />
        </div>
      )}
      
      {type === 'footer' && (
        <>
          <p className={config.labelClass}>{config.label}</p>
          <ins 
            className="adsbygoogle"
            style={config.style}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
            data-ad-slot={config.slot}
            data-adtest={process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' ? 'on' : 'off'}
          />
        </>
      )}
    </div>
  )
}