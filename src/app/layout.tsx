import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AdProvider from '@/components/provider/AdProvider'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import { siteConfig } from '@/lib/config/site'

export const metadata: Metadata = {
  title: `${siteConfig.title}`,
  description: 'A simple blog built with Next.js and microCMS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <script async src="https://cdn.iframe.ly/embed.js"></script>
      </head>
      <body className="min-h-screen bg-gray-50">
        <Header />
        <AdProvider>
          <main className="max-w-7xl mx-auto px-1 sm:px-6 sm:py-4 lg:px-8">
            {children}
          </main>
        </AdProvider>
        <Footer />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} debugMode={process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'} />
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            // strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  )
}