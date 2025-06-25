import { Post } from '@/types/microcms';

// グローバルキャッシュで全記事を一度だけ取得
let allPostsCache: Post[] | null = null;

/**
 * 全記事を一度だけ取得してキャッシュする
 * ビルド時のAPI呼び出し数を大幅削減
 */
async function getAllPosts(): Promise<Post[]> {
  if (allPostsCache) {
    return allPostsCache;
  }

  try {
    // 動的インポートでmicroCMSをロード（循環インポート回避）
    const { fetchPosts } = await import('./microcms');

    // すべての記事を一度に取得（バッチ処理）
    const allPosts: Post[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const { contents } = await fetchPosts({
        offset,
        limit,
        orders: '-publishedAt'
      });

      allPosts.push(...contents);
      hasMore = contents.length === limit;
      offset += limit;
    }

    allPostsCache = allPosts;
    console.log(`Cached ${allPosts.length} posts for related posts calculation`);
    return allPosts;
  } catch (error) {
    console.warn('Error fetching all posts for cache:', error);
    return [];
  }
}

/**
 * サーバーサイドで関連記事を取得する関数
 * ビルド時にバッチ処理で効率的に関連記事を計算
 * @param postId - 記事ID
 * @returns 関連記事の配列
 */
export async function getRelatedPostsServer(postId: string): Promise<Post[]> {
  try {
    // 全記事をキャッシュから取得（初回のみAPI呼び出し）
    const allPosts = await getAllPosts();

    // 現在の記事を取得
    const currentPost = allPosts.find(post => post.id === postId);
    if (!currentPost || !currentPost.categories?.length) {
      return [];
    }

    // 同じカテゴリを持つ記事をフィルタリング
    const categoryIds = currentPost.categories.map(cat => cat.id);
    const relatedPosts = allPosts
      .filter(post =>
        post.id !== postId && // 現在の記事を除外
        post.categories?.some(cat => categoryIds.includes(cat.id)) // 同じカテゴリを持つ
      )
      .slice(0, 5); // 最大5件
    if (relatedPosts.length !== 5) {
      relatedPosts.push(
        ...allPosts.filter(post => post.id !== postId && !relatedPosts.some(rp => rp.id === post.id))
          .slice(0, 5 - relatedPosts.length)
      );
    }

    return relatedPosts;
  } catch (error) {
    console.warn(`Error fetching related posts for ${postId}:`, error);
    return [];
  }
}