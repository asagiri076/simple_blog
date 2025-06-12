'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post, Category } from '@/types/microcms';
import { generateArticleUrl } from '@/lib/articleUrl';

interface SidebarProps {
  categories: Category[];
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
          throw new Error('Failed to fetch related posts');
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
    <aside className="w-full lg:w-80 space-y-8">
      {postId && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-950 mb-4">関連記事</h2>
          {loading && (
            <div className="text-gray-500 text-sm">読み込み中...</div>
          )}
          {error && (
            <div className="text-red-500 text-sm">関連記事の取得に失敗しました</div>
          )}
          {!loading && !error && relatedPosts.length > 0 && (
            <div className="space-y-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={generateArticleUrl(post)}
                  className="block hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-950 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!loading && !error && relatedPosts.length === 0 && (
            <div className="text-gray-500 text-sm">関連記事がありません</div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-950 mb-4">タグ</h2>
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/tag/${category.id}`}
                className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">タグがありません</div>
        )}
      </div>
    </aside>
  );
}