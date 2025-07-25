import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getStaticPageByPageId, getAllStaticPages } from '@/lib/data/prebuiltData'
import StaticPageLayout from '@/components/article/static/StaticPageLayout'
import CodeHighlighter from '@/components/article/content/CodeHighlighter'
import HtmlComponentRenderer from '@/components/article/content/HtmlComponentRenderer'

interface PageProps {
  params: Promise<{ pageId: string }>
}

export default async function DynamicStaticPage({ params }: PageProps) {
  const { pageId } = await params

  try {
    const staticPage = await getStaticPageByPageId(pageId)

    if (!staticPage) {
      notFound()
    }

    return (
      <StaticPageLayout title={staticPage.title}>
        {staticPage.components && staticPage.components.length > 0 ? (
          <HtmlComponentRenderer 
            components={staticPage.components} 
            content={staticPage.contents} 
          />
        ) : (
          <CodeHighlighter content={staticPage.contents} />
        )}
      </StaticPageLayout>
    )
  } catch (error) {
    console.error('Error fetching static page:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pageId } = await params
  
  try {
    const staticPage = await getStaticPageByPageId(pageId)
    
    if (!staticPage) {
      return {
        title: 'Page Not Found | Simple Blog',
        description: 'The requested static page could not be found.',
      }
    }
    
    return {
      title: `${staticPage.title} | Simple Blog`,
      description: staticPage.title,
      openGraph: {
        title: staticPage.title,
        description: staticPage.title,
        type: 'website',
      },
      twitter: {
        card: 'summary',
        title: staticPage.title,
        description: staticPage.title,
      },
    }
  } catch {
    return {
      title: 'Page Not Found | Simple Blog',
      description: 'The requested static page could not be found.',
    }
  }
}

export async function generateStaticParams() {
  try {
    const staticPages = await getAllStaticPages()
    return staticPages.map((page) => ({
      pageId: page.page_id,
    }))
  } catch (error) {
    console.error('Error generating static params for static pages:', error)
    return []
  }
}