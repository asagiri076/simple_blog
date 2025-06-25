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
    <>
      {post.eyecatch && (
        <div className="relative h-64 sm:h-80 lg:h-96 w-full">
          {(() => {
            const imageSet = generateResponsiveImageSet(post.eyecatch.url, 'articleHeader', 'webp');
            return (
              <Image
                src={imageSet.src}
                alt={post.title}
                fill
                className="object-cover"
                sizes={imageSet.sizes}
                priority
              />
            );
          })()}
        </div>
      )}
      
      <div className="p-8">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-primary-800 mb-6 leading-tight">
            {post.title}
          </h1>
          
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
            <DateDisplay 
              date={post.publishedAt} 
              className="text-sm text-gray-500" 
            />
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
    </>
  )
}