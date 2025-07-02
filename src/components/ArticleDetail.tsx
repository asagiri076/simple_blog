import { Post, Category } from '@/types/microcms'
import ArticleHeader from './ArticleHeader'
import Sidebar from './Sidebar'
import CodeHighlighter from './CodeHighlighter'
import HtmlComponentRenderer from './HtmlComponentRenderer'
import FooterSponsoredAd from './SponsoredAd'
import ArticleNavigation from './ArticleNavigation'
import { getRelatedPostsServer, getAdjacentPosts } from '@/lib/prebuiltData'
import Link from 'next/link'
import Image from 'next/image'
import { generateArticleUrl } from '@/lib/articleUrl'
import DateDisplay from './DateDisplay'
import { generateResponsiveImageSet } from '@/lib/imageOptimizer'

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

  const noImgUrl = 'https://images.microcms-assets.io/assets/cf1b067d77e34fb9a08b3cb8537aacda/16d3b7260cf44a7790032a2e0418d713/no-image.png';
  const noImgSet = generateResponsiveImageSet(noImgUrl, 'sidebar', 'auto');
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

          {relatedPosts.length > 0 && (
            <div className="mt-8 bg-gradient-to-br from-white to-primary-50/30 rounded-xl shadow-lg border border-primary-100/50 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-primary-900 mb-5 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full"></div>
                関連記事
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={generateArticleUrl(post)}
                    className="group block hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 p-3 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-20 h-16 relative flex-shrink-0">
                        {post.eyecatch?.url ? (() => {
                          const imageSet = generateResponsiveImageSet(post.eyecatch.url, 'sidebar', 'avif');
                          return (
                            <Image
                              src={imageSet.src}
                              alt={post.title}
                              fill
                              className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                              sizes={imageSet.sizes}
                            />
                          );
                        })() : (
                          <Image
                            src={noImgSet.src}
                            alt={post.title}
                            fill
                            className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-800 line-clamp-2 transition-colors duration-300">
                          {post.title}
                        </h3>
                        <DateDisplay
                          date={post.publishedAt}
                          className="text-xs text-secondary-600 mt-2 font-medium"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
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