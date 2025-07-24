'use client'

import { useEffect } from 'react'

/**
 * AdSenseの初期化を管理するカスタムフック
 * ページ全体で1回のみ実行される
 */
export function useAdSense() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ADSENSE_ID) {
      // AdSenseの初期化処理
      window.adsbygoogle = window.adsbygoogle || []
      
      // 既存の広告がある場合は新たに初期化
      const existingAds = document.querySelectorAll('.adsbygoogle')
      existingAds.forEach(() => {
        try {
          window.adsbygoogle.push({})
        } catch (error) {
          console.warn('AdSense initialization failed:', error)
        }
      })
    }
  }, [])
}