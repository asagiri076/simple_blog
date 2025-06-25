import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/microcms';
import { generateArticleUrl } from '@/lib/articleUrl';
import CategoryTags from './CategoryTags';
import DateDisplay from './DateDisplay';
import { generateResponsiveImageSet } from '@/lib/imageOptimizer';

interface ArticleListProps {
  posts: Post[];
}

export default function ArticleList({ posts }: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">記事がありません</p>
      </div>
    );
  }
  const noImgUrl = 'https://images.microcms-assets.io/assets/cf1b067d77e34fb9a08b3cb8537aacda/16d3b7260cf44a7790032a2e0418d713/no-image.png';
  const noImgSet = generateResponsiveImageSet(noImgUrl, 'articleList', 'auto');

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article key={post.id} className="group bg-gradient-to-br from-white to-gray-50/30 rounded-xl shadow-lg border border-gray-200/50 overflow-hidden backdrop-blur-sm">
          <Link href={generateArticleUrl(post)} className="block hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex flex-col sm:flex-row">
                <div className="sm:w-64 h-40 relative overflow-hidden">
                  {post.eyecatch?.url ? (() => {
                    const imageSet = generateResponsiveImageSet(post.eyecatch.url, 'articleList', 'auto');
                    return (
                      <Image
                        src={imageSet.src}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes={imageSet.sizes}
                      />
                    );
                  })() : (
                    <Image
                      src={noImgSet.src}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              <div className="flex-1 p-6">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-800 mb-3 line-clamp-2 min-h-[2.8em] transition-colors duration-300">
                  {post.title}
                </h2>
                <p className="text-gray-600 group-hover:text-gray-700 text-sm mb-4 line-clamp-3 transition-colors duration-300">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <CategoryTags categories={post.categories} variant="list" />
                  <DateDisplay 
                    date={post.publishedAt} 
                    className="text-sm text-gray-500" 
                  />
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}