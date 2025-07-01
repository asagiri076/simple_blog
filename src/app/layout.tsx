import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Simple Blog',
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
        <main className="max-w-7xl mx-auto px-1 sm:px-6 sm:py-4 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}