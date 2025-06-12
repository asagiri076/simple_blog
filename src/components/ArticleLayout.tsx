import { Post, Category } from '@/types/microcms'
import ArticleList from './ArticleList'
import Pagination from './Pagination'
import Sidebar from './Sidebar'

interface ArticleLayoutProps {
  title: string
  subtitle?: string
  posts: Post[]
  categories: Category[]
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-950 mb-2">{title}</h1>
        {subtitle && (
          <p className="text-gray-600">{subtitle}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <ArticleList posts={posts} />
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
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