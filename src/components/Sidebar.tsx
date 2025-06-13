'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post, Category } from '@/types/microcms';
import { CategoryWithCount } from '@/lib/microcms';
import { generateArticleUrl } from '@/lib/articleUrl';
import DateDisplay from './DateDisplay';
import { generateResponsiveImageSet } from '@/lib/imageOptimizer';

interface SidebarProps {
  categories: Category[] | CategoryWithCount[];
  postId?: string; // 現在の記事ID（関連記事取得用）
}

export default function Sidebar({ categories, postId }: SidebarProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;
    async function fetchRelatedPosts() {
      try {
        setLoading(true);
        const response = await fetch(`/api/related-posts?postId=${postId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch related posts: ${response.status}`);
        }
        const data = await response.json();
        setRelatedPosts(data.contents);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchRelatedPosts();
  }, [postId]);

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {postId && (
        <div className="bg-gradient-to-br from-white to-primary-50/30 rounded-xl shadow-lg border border-primary-100/50 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-primary-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full"></div>
            関連記事
          </h2>
          {loading && (
            <div className="text-primary-500 text-sm text-center py-4 bg-primary-50/50 rounded-lg border border-primary-100/50 animate-pulse">読み込み中...</div>
          )}
          {error && (
            <div className="text-red-600 text-sm text-center py-4 bg-red-50 rounded-lg border border-red-200">関連記事の取得に失敗しました</div>
          )}
          {!loading && !error && relatedPosts.length > 0 && (
            <div className="space-y-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={generateArticleUrl(post)}
                  className="group block hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 p-3 rounded-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-20 h-16 relative flex-shrink-0">
                      {post.eyecatch?.url ? (() => {
                        const imageSet = generateResponsiveImageSet(post.eyecatch.url, 'sidebar', 'auto');
                        return (
                          <Image
                            src={imageSet.src}
                            alt={post.title}
                            fill
                            className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                            sizes={imageSet.sizes}
                          />
                        );
                      })() : (
                        <Image
                          src="/no-image.png"
                          alt={post.title}
                          fill
                          className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-800 line-clamp-2 transition-colors duration-300">
                        {post.title}
                      </h3>
                      <DateDisplay
                        date={post.publishedAt}
                        className="text-xs text-secondary-600 mt-2 font-medium"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!loading && !error && relatedPosts.length === 0 && (
            <div className="text-primary-400 text-sm text-center py-4 bg-primary-50/50 rounded-lg border border-primary-100/50">関連記事がありません</div>
          )}
        </div>
      )}

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