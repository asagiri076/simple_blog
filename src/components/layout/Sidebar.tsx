import Link from 'next/link';
import { Category } from '@/types/microcms';
import { CategoryWithCount } from '@/lib/data/prebuiltData';
import StaticPageLinks from '@/components/static/StaticPageLinks';

interface SidebarProps {
  categories: Category[] | CategoryWithCount[];
}

export default function Sidebar({ categories }: SidebarProps) {

  return (
    <aside className="w-full lg:w-80 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-secondary-900 mb-5 flex items-center gap-2">
          <div className="w-1 h-5 bg-gradient-to-b from-secondary-500 to-primary-500 rounded-full"></div>
          タグ
        </h2>
        {categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map((category) => {
              const categoryWithCount = category as CategoryWithCount;
              const hasCount = 'postCount' in categoryWithCount;
              if (hasCount && categoryWithCount.postCount === 0) {
                return null; // カウントが0のタグは表示しない
              }
              
              return (
                <Link
                  key={category.id}
                  href={`/tag/${category.id}`}
                  className="flex items-center justify-between pl-3 pb-1 mb-2 border-b-1 border-dashed border-gray-300"
                >
                  <span className="text-sm hover:text-primary-800 duration-200">
                    {category.name}
                  </span>
                  {hasCount && (
                    <span className="text-sm px-2 py-1">
                      {categoryWithCount.postCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-secondary-400 text-sm text-center py-4 bg-secondary-50/50 rounded-lg border border-secondary-100/50">タグがありません</div>
        )}
      </div>
      
      <StaticPageLinks />
    </aside>
  );
}