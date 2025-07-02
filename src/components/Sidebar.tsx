import Link from 'next/link';
import { Category } from '@/types/microcms';
import { CategoryWithCount } from '@/lib/prebuiltData';

interface SidebarProps {
  categories: Category[] | CategoryWithCount[];
}

export default function Sidebar({ categories }: SidebarProps) {

  return (
    <aside className="w-full lg:w-80 space-y-6">
      <div className="bg-gradient-to-br from-white to-secondary-50/30 rounded-xl shadow-lg border border-secondary-100/50 p-6 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-secondary-900 mb-5 flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-secondary-500 to-primary-500 rounded-full"></div>
          タグ
        </h2>
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const categoryWithCount = category as CategoryWithCount;
              const hasCount = 'postCount' in categoryWithCount;
              
              return (
                <Link
                  key={category.id}
                  href={`/tag/${category.id}`}
                  className="inline-block px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 rounded-full hover:from-primary-200 hover:to-primary-300 hover:text-primary-900 transition-all duration-300 hover:shadow-md hover:scale-105 border border-primary-200/50"
                >
                  {category.name}
                  {hasCount && categoryWithCount.postCount > 0 && (
                    <span className="ml-1 text-xs text-primary-600">({categoryWithCount.postCount})</span>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-secondary-400 text-sm text-center py-4 bg-secondary-50/50 rounded-lg border border-secondary-100/50">タグがありません</div>
        )}
      </div>
    </aside>
  );
}