import { Category } from '@/types/microcms'

interface CategoryTagsProps {
  categories?: Category[]
  variant?: 'list' | 'detail'
  className?: string
}

export default function CategoryTags({ 
  categories, 
  variant = 'list', 
  className = '' 
}: CategoryTagsProps) {
  if (!categories || categories.length === 0) {
    return null
  }

  const baseClasses = 'inline-block px-2 py-1 text-xs rounded'
  const variantClasses = {
    list: 'bg-blue-100 text-blue-800',
    detail: 'bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((cat) => (
        <span
          key={cat.id}
          className={`${baseClasses} ${variantClasses[variant]}`}
        >
          {cat.name}
        </span>
      ))}
    </div>
  )
}