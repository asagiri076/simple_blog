import Image from 'next/image'
import Link from 'next/link'
import { Post } from '@/types/microcms'
import DateDisplay from './DateDisplay'
import { generateResponsiveImageSet } from '@/lib/imageOptimizer'

interface ArticleHeaderProps {
  post: Post
}

export default function ArticleHeader({ post }: ArticleHeaderProps) {
  return (
    <div className="px-6 py-4">
      <header className="mb-3">
        <h1 className="text-3xl font-bold text-primary-800 my-6 leading-tight">
          {post.title}
        </h1>
        
        {post.eyecatch && (
          <div className="relative w-full max-w-2xl mx-auto mb-6">
            {(() => {
              const imageSet = generateResponsiveImageSet(post.eyecatch.url, 'articleHeader', 'avif');
              return (
                <Image
                  src={imageSet.src}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="object-contain rounded-lg shadow-sm"
                  sizes={imageSet.sizes}
                  priority
                />
              );
            })()}
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            {post.categories && post.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/tag/${cat.id}`}
                className="inline-block px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 rounded-full hover:from-primary-200 hover:to-primary-300 hover:scale-105 transition-all duration-300 shadow-sm border border-primary-200/50"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="flex gap-1 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <DateDisplay 
                date={post.publishedAt} 
                className="text-sm text-gray-500" 
              />
            </div>
            {post.updatedAt && post.updatedAt !== post.publishedAt && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <DateDisplay 
                  date={post.updatedAt} 
                  className="text-sm text-gray-500" 
                />
              </div>
            )}
          </div>
        </div>
        
        {post.excerpt && (
          <div className="relative bg-gradient-to-r from-primary-50 to-secondary-50 border-l-4 border-primary-400 pl-6 pr-4 py-5 rounded-r-lg mb-8 shadow-sm">
            <div className="absolute top-2 left-2 text-primary-300 text-2xl">&ldquo;</div>
            <p className="text-gray-700 text-lg leading-relaxed font-medium italic pl-4">
              {post.excerpt}
            </p>
            <div className="absolute bottom-2 right-4 text-secondary-300 text-2xl rotate-180">&rdquo;</div>
          </div>
        )}
      </header>
    </div>
  )
}