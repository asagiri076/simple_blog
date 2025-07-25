import type { Metadata } from 'next'
import StaticPageLayout from '@/components/static/StaticPageLayout'

export const metadata: Metadata = {
  title: 'Hello World - Static Page',
  description: 'A simple hello world static page',
}

export default function StaticHelloWorldPage() {
  return (
    <StaticPageLayout title="Hello World">
      <p>
        これは静的ページのサンプルです。
      </p>
      <p>
        <code>/static/hello-world</code> パスでアクセスできます。
      </p>
      <h2>特徴</h2>
      <ul>
        <li>Next.js 15のApp Routerを使用</li>
        <li>SSG (Static Site Generation) 対応</li>
        <li>共通レイアウトコンポーネントを使用</li>
        <li>レスポンシブデザイン対応</li>
      </ul>
    </StaticPageLayout>
  )
}