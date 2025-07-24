import { readFileSync } from 'fs';
import { join } from 'path';
import { Post, Category } from '@/types/microcms';

export type CategoryWithCount = Category & { postCount: number };

export interface PrebuiltData {
  posts: Post[];
  categories: Category[];
  relatedPosts: Record<string, Post[]>;
  categoriesWithCount: Array<Category & { postCount: number }>;
  generatedAt: string;
}

// 並行処理での競合を防ぐためのPromiseキャッシュ
let loadingPromise: Promise<PrebuiltData> | null = null;
let cachedData: PrebuiltData | null = null;

/**
 * プリビルドデータを読み込む
 * 並行処理時は1つのPromiseを共有して重複読み込みを防ぐ
 */
async function loadPrebuiltData(): Promise<PrebuiltData> {
  // 既にデータがキャッシュされている場合はそれを返す
  if (cachedData) {
    return cachedData;
  }

  // 既に読み込み処理が開始されている場合はそのPromiseを待つ
  if (loadingPromise) {
    return loadingPromise;
  }

  // 新しい読み込み処理を開始
  loadingPromise = (async () => {
    try {
      const dataPath = join(process.cwd(), 'prebuild-data', 'prebuilt.json');
      const jsonData = readFileSync(dataPath, 'utf-8');
      const data: PrebuiltData = JSON.parse(jsonData);
      
      // データをキャッシュ
      cachedData = data;
      console.log(`📚 Loaded prebuilt data (${data.posts.length} posts, generated at ${data.generatedAt})`);
      
      return data;
    } catch (error) {
      console.error('Failed to load prebuilt data:', error);
      // エラー時はPromiseをリセット
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
}

/**
 * 全記事を取得する（プリビルドデータから）
 */
export async function getAllPosts(): Promise<Post[]> {
  const data = await loadPrebuiltData();
  return data.posts;
}

/**
 * 関連記事を取得する（プリビルドデータから）
 */
export async function getRelatedPosts(postId: string): Promise<Post[]> {
  const data = await loadPrebuiltData();
  return data.relatedPosts[postId] || [];
}

/**
 * カテゴリ一覧を取得する（プリビルドデータから）
 */
export async function getCategories(): Promise<Category[]> {
  const data = await loadPrebuiltData();
  return data.categories;
}

/**
 * 記事数付きカテゴリ一覧を取得する（プリビルドデータから）
 */
export async function getCategoriesWithCount(): Promise<Array<Category & { postCount: number }>> {
  const data = await loadPrebuiltData();
  return data.categoriesWithCount;
}

/**
 * 特定の記事を取得する（プリビルドデータから）
 */
export async function getPostById(postId: string): Promise<Post | null> {
  const data = await loadPrebuiltData();
  return data.posts.find(post => post.id === postId) || null;
}

/**
 * カテゴリ別の記事を取得する（プリビルドデータから）
 */
export async function getPostsByCategory(categoryId: string, limit?: number): Promise<Post[]> {
  const data = await loadPrebuiltData();
  const filteredPosts = data.posts.filter(post =>
    post.categories?.some(cat => cat.id === categoryId)
  );
  
  return limit ? filteredPosts.slice(0, limit) : filteredPosts;
}

/**
 * 人気記事を取得する（プリビルドデータから）
 */
export async function getPopularPosts(limit: number = 5): Promise<Post[]> {
  const data = await loadPrebuiltData();
  // publishedAtの新しい順でソート済みなので、先頭から取得
  return data.posts.slice(0, limit);
}

/**
 * WP IDから記事を取得する（プリビルドデータから）
 */
export async function getPostByWpId(wpId: number): Promise<Post | null> {
  const data = await loadPrebuiltData();
  return data.posts.find(post => post.wp_id === wpId) || null;
}

/**
 * 全記事を取得する（microCMSの形式に合わせてcontentsプロパティでラップ）
 */
export async function getAllPostsWithMeta(): Promise<{ contents: Post[]; totalCount: number; offset: number; limit: number }> {
  const data = await loadPrebuiltData();
  return {
    contents: data.posts,
    totalCount: data.posts.length,
    offset: 0,
    limit: data.posts.length
  };
}

/**
 * カテゴリ一覧を取得する（microCMSの形式に合わせてcontentsプロパティでラップ）
 */
export async function getCategoriesWithMeta(): Promise<{ contents: Category[]; totalCount: number; offset: number; limit: number }> {
  const data = await loadPrebuiltData();
  return {
    contents: data.categories,
    totalCount: data.categories.length,
    offset: 0,
    limit: data.categories.length
  };
}

/**
 * サーバーサイドで関連記事を取得する関数
 * プリビルドデータから高速に関連記事を取得
 * @param postId - 記事ID
 * @returns 関連記事の配列
 */
export async function getRelatedPostsServer(postId: string): Promise<Post[]> {
  try {
    return await getRelatedPosts(postId);
  } catch (error) {
    console.warn(`Error fetching related posts for ${postId}:`, error);
    return [];
  }
}

/**
 * 前後の記事を取得する
 * @param postId - 現在の記事ID
 * @returns 前の記事と次の記事のオブジェクト
 */
export async function getAdjacentPosts(postId: string): Promise<{ prevPost: Post | null; nextPost: Post | null }> {
  const data = await loadPrebuiltData();
  const currentIndex = data.posts.findIndex(post => post.id === postId);
  
  if (currentIndex === -1) {
    return { prevPost: null, nextPost: null };
  }
  
  // 記事は公開日の新しい順でソート済みなので、
  // 前の記事は配列の前の要素（より新しい記事）
  // 次の記事は配列の後の要素（より古い記事）
  const prevPost = currentIndex > 0 ? data.posts[currentIndex - 1] : null;
  const nextPost = currentIndex < data.posts.length - 1 ? data.posts[currentIndex + 1] : null;
  
  return { prevPost, nextPost };
}