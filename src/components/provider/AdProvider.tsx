'use client'

import { useAdSense } from '@/hooks/useAdSense'

interface AdProviderProps {
  children: React.ReactNode
}

/**
 * AdSenseの初期化を行い、子コンポーネントをレンダリングするプロバイダー
 * layout.tsxで使用してアプリ全体でAdSenseを初期化する
 */
export default function AdProvider({ children }: AdProviderProps) {
  // AdSenseを初期化
  useAdSense()

  return <>{children}</>
}