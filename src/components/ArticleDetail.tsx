import { Post, Category } from '@/types/microcms'
import ArticleHeader from './ArticleHeader'
import Sidebar from './Sidebar'

interface ArticleDetailProps {
  post: Post
  categories: Category[]
}

export default function ArticleDetail({ post, categories }: ArticleDetailProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <article className="bg-gradient-to-br from-white to-gray-50/30 rounded-xl shadow-xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
            <ArticleHeader post={post} />
            
            <div className="px-8 pb-8">
              <div 
                className="prose prose-lg max-w-none prose-headings:text-primary-800 prose-links:text-secondary-600 prose-links:hover:text-secondary-700 prose-blockquote:border-l-primary-400 prose-blockquote:bg-primary-50/50"
                dangerouslySetInnerHTML={{ __html: post.contents }}
              />
            </div>
          </article>
        </main>
        
        <aside className="lg:col-span-1">
          <Sidebar categories={categories} postId={post.id} />
        </aside>
      </div>
    </div>
  )
}