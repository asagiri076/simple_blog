import Link from 'next/link'

export interface StaticPage {
  id: string
  name: string
  path: string
}

const staticPages: StaticPage[] = [
  {
    id: 'hello-world',
    name: 'Hello World',
    path: '/static/hello-world'
  }
]

export default function StaticPageLinks() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 backdrop-blur-sm">
      <h2 className="text-lg font-bold text-secondary-900 mb-5 flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-secondary-500 to-primary-500 rounded-full"></div>
        静的ページ
      </h2>
      {staticPages.length > 0 ? (
        <div className="space-y-2">
          {staticPages.map((page) => (
            <Link
              key={page.id}
              href={page.path}
              className="flex items-center justify-between pl-3 pb-1 mb-2 border-b-1 border-dashed border-gray-300"
            >
              <span className="text-sm hover:text-primary-800 duration-200">
                {page.name}
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