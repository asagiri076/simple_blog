import Link from 'next/link';
import { Post } from '@/types/microcms';
import { getArticleId, extractYearMonth } from '@/lib/articleUrl';

interface ArticleNavigationProps {
  prevPost: Post | null;
  nextPost: Post | null;
}

export default function ArticleNavigation({ prevPost, nextPost }: ArticleNavigationProps) {
  if (!prevPost && !nextPost) {
    return null;
  }

  const getPostUrl = (post: Post) => {
    const { year, month } = extractYearMonth(post.publishedAt);
    const articleId = getArticleId(post);
    return `/${year}/${month}/${articleId}`;
  };

  return (
    <nav className="mt-8 pt-8 border-t border-gray-200">
      <div className="flex justify-between items-start gap-6">
        {/* Previous Post */}
        <div className="flex-1">
          {prevPost ? (
            <Link 
              href={getPostUrl(prevPost)}
              className="group block bg-white p-4 rounded-lg shadow-lg backdrop-blur-sm hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 h-24 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                前の記事
              </div>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                {prevPost.title}
              </h3>
            </Link>
          ) : (
            <div className="p-4 rounded-lg border border-gray-100 h-24 flex flex-col justify-between">
              <div className="text-sm text-gray-400">前の記事</div>
              <div className="text-gray-400">これが最新の記事です</div>
            </div>
          )}
        </div>

        {/* Next Post */}
        <div className="flex-1">
          {nextPost ? (
            <Link 
              href={getPostUrl(nextPost)}
              className="group block bg-white p-4 rounded-lg shadow-lg backdrop-blur-sm hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 text-right h-24 flex flex-col justify-between"
            >
              <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
                次の記事
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                {nextPost.title}
              </h3>
            </Link>
          ) : (
            <div className="p-4 rounded-lg border border-gray-100 text-right h-24 flex flex-col justify-between">
              <div className="text-sm text-gray-400">次の記事</div>
              <div className="text-gray-400">これが最初の記事です</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}