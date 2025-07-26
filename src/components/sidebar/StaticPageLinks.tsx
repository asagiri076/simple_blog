import Link from 'next/link'
import { getAllStaticPages } from '@/lib/data/prebuiltData'

export default async function StaticPageLinks() {
  const staticPages = await getAllStaticPages()

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm">
      <h2 className="text-lg font-bold text-secondary-900 mb-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-secondary-500 to-primary-500 rounded-full"></div>
        当サイトについて
      </h2>
      {staticPages.length > 0 ? (
        <div className="space-y-2">
          {staticPages.map((page) => (
            <Link
              key={page.id}
              href={`/static/${page.page_id}`}
              className="flex items-center justify-between pl-3 pb-1 mb-2 border-b-1 border-dashed border-gray-300"
            >
              <span className="text-sm hover:text-primary-800 duration-200">
                {page.title}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-secondary-400 text-sm text-center py-4 bg-secondary-50/50 rounded-lg border border-secondary-100/50">
          静的ページがありません
        </div>
      )}
    </div>
  )
}