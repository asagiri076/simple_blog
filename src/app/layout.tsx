import type { Metadata } from 'next'

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
      <body>{children}</body>
    </html>
  )
}