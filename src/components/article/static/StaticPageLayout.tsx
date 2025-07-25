import type { ReactNode } from 'react'

interface StaticPageLayoutProps {
  title: string
  children: ReactNode
  className?: string
}

export default function StaticPageLayout({ 
  title, 
  children, 
  className = '' 
}: StaticPageLayoutProps) {
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
          {title}
        </h1>
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
      </div>
    </div>
  )
}