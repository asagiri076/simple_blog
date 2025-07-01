import Link from 'next/link'
import { Category } from '@/types/microcms'

interface CategoryTagsProps {
  categories?: Category[]
  variant?: 'list' | 'detail'
  className?: string
  linkable?: boolean // リンク機能のON/OFF
}

export default function CategoryTags({ 
  categories, 
  variant = 'list', 
  className = '',
  linkable = false
}: CategoryTagsProps) {
  if (!categories || categories.length === 0) {
    return null
  }

  const baseClasses = 'inline-block px-3 py-1 text-xs rounded-full'
  const variantClasses = {
    list: 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 hover:from-primary-200 hover:to-primary-300 hover:scale-105 transition-all duration-300 shadow-sm border border-primary-200/50',
    detail: 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 hover:from-primary-200 hover:to-primary-300 hover:scale-105 transition-all duration-300 shadow-sm border border-primary-200/50'
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((cat) => {
        const content = (
          <span className={`${baseClasses} ${variantClasses[variant]}`}>
            {cat.name}
          </span>
        );

        if (linkable) {
          return (
            <Link key={cat.id} href={`/tag/${cat.id}`}>
              {content}
            </Link>
          );
        } else {
          return (
            <span key={cat.id}>
              {content}
            </span>
          );
        }
      })}
    </div>
  )
}