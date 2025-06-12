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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-800 to-secondary-700 bg-clip-text text-transparent mb-6 leading-tight">
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
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-l-4 border-gradient-to-b border-primary-400 pl-6 pr-4 py-4 rounded-r-lg mb-6">
              <p className="text-gray-700 text-lg leading-relaxed font-medium italic">
                {post.excerpt}
              </p>
            </div>
          )}
        </header>
      </div>
    </>
  )
}