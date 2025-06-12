import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/microcms';
import { generateArticleUrl } from '@/lib/articleUrl';
import CategoryTags from './CategoryTags';
import DateDisplay from './DateDisplay';

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

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <Link href={generateArticleUrl(post)} className="block hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row">
                <div className="sm:w-64 h-40 relative">
                  <Image
                    src={post.eyecatch?.url ? post.eyecatch.url : '/no-image.png'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              <div className="flex-1 p-6">
                <h2 className="text-xl font-semibold text-gray-950 mb-2 line-clamp-2 min-h-[2.8em]">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
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