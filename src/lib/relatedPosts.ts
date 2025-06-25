import { Post } from '@/types/microcms';

import { fetchPosts } from './microcms';

/**
 * サーバーサイドで関連記事を取得する関数
 * ビルド時に直接microCMSから取得して静的化される
 * @param postId - 記事ID
 * @returns 関連記事の配列
 */
export async function getRelatedPostsServer(postId: string): Promise<Post[]> {
  try {
    // APIルートを経由せず、直接microCMSから関連記事を取得
    // 同じカテゴリの記事を3件取得（現在の記事を除く）
    const { contents: allPosts } = await fetchPosts({
      limit: 100 // 十分な数を取得してフィルタリング
    });
    
    // 現在の記事を取得
    const currentPost = allPosts.find(post => post.id === postId);
    if (!currentPost || !currentPost.categories.length) {
      return [];
    }
    
    // 同じカテゴリを持つ記事をフィルタリング
    const categoryIds = currentPost.categories.map(cat => cat.id);
    const relatedPosts = allPosts
      .filter(post => 
        post.id !== postId && // 現在の記事を除外
        post.categories.some(cat => categoryIds.includes(cat.id)) // 同じカテゴリを持つ
      )
      .slice(0, 3); // 最大3件
    
    return relatedPosts;
  } catch (error) {
    console.warn(`Error fetching related posts for ${postId}:`, error);
    return [];
  }
}