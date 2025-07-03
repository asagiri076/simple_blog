import { Post, Category } from '@/types/microcms'
import { CategoryWithCount } from '@/lib/data/prebuiltData'
import ArticleList from '@/components/article/ArticleList'
import PageNavigation from '@/components/common/PageNavigation'
import Sidebar from '@/components/layout/Sidebar'

interface ArticleLayoutProps {
  title: string
  subtitle?: string
  posts: Post[]
  categories: Category[] | CategoryWithCount[]
  currentPage: number
  totalPages: number
  basePath: string
}

export default function ArticleLayout({
  title,
  subtitle,
  posts,
  categories,
  currentPage,
  totalPages,
  basePath
}: ArticleLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-800 to-secondary-700 bg-clip-text text-transparent">{title}</h1>
        </div>
        {subtitle && (
          <p className="text-secondary-600 font-medium ml-5">{subtitle}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <ArticleList posts={posts} />
          {totalPages > 1 && (
            <div className="mt-8">
              <PageNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={basePath}
              />
            </div>
          )}
        </main>
        
        <aside className="lg:col-span-1">
          <Sidebar categories={categories} />
        </aside>
      </div>
    </div>
  )
}