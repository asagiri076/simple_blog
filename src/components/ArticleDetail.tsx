import { Post, Category } from '@/types/microcms'
import ArticleHeader from './ArticleHeader'
import Sidebar from './Sidebar'
import CodeHighlighter from './CodeHighlighter'
import HtmlComponentRenderer from './HtmlComponentRenderer'
import FooterSponsoredAd from './SponsoredAd'
import ArticleNavigation from './ArticleNavigation'
import { getRelatedPostsServer, getAdjacentPosts } from '@/lib/prebuiltData'

interface ArticleDetailProps {
  post: Post
  categories: Category[]
}

export default async function ArticleDetail({ post, categories }: ArticleDetailProps) {
  // サーバーサイドで関連記事と前後記事を取得（ビルド時に静的化される）
  const [relatedPosts, { prevPost, nextPost }] = await Promise.all([
    getRelatedPostsServer(post.id),
    getAdjacentPosts(post.id)
  ]);
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <article className="bg-gradient-to-br from-white to-gray-50/30 rounded-xl shadow-xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
            <ArticleHeader post={post} />
            
            <div className="px-4 pb-12">
              {post.componets && post.componets.length > 0 ? (
                <HtmlComponentRenderer 
                  components={post.componets} 
                  content={post.contents} 
                />
              ) : (
                <CodeHighlighter content={post.contents} />
              )}
            </div>
          </article>

          <ArticleNavigation prevPost={prevPost} nextPost={nextPost} />

          <FooterSponsoredAd />
        </main>
        
        <aside className="lg:col-span-1">
          <Sidebar categories={categories} relatedPosts={relatedPosts} />
        </aside>
      </div>
    </div>
  )
}