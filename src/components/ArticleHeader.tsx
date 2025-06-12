import Image from 'next/image'
import Link from 'next/link'
import { Post } from '@/types/microcms'
import DateDisplay from './DateDisplay'

interface ArticleHeaderProps {
  post: Post
}

export default function ArticleHeader({ post }: ArticleHeaderProps) {
  return (
    <>
      {post.eyecatch && (
        <div className="relative h-64 sm:h-80 lg:h-96 w-full">
          <Image
            src={post.eyecatch.url}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-950 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              {post.categories && post.categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/tag/${cat.id}`}
                  className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
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
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}
        </header>
      </div>
    </>
  )
}