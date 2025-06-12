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
    list: 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 hover:from-primary-200 hover:to-primary-300 hover:scale-105 transition-all duration-300 shadow-sm',
    detail: 'bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800 hover:from-secondary-200 hover:to-secondary-300 hover:scale-105 transition-all duration-300 shadow-sm'
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