import { Post, Category, MicroCMSListResponse, FetchPostsParams } from '@/types/microcms';

const API_KEY = process.env.MICROCMS_API_KEY;
const DOMAIN = process.env.MICROCMS_DOMAIN;
const BASE_URL = `https://${DOMAIN}.microcms.io/api/v1`;

if (!API_KEY || !DOMAIN) {
  throw new Error('microCMS API key and domain are required');
}

const headers = {
  'X-MICROCMS-API-KEY': API_KEY,
  'Content-Type': 'application/json',
};

export async function fetchPosts(params: FetchPostsParams = {}): Promise<MicroCMSListResponse<Post>> {
  const searchParams = new URLSearchParams();
  
  if (params.limit && params.limit > 0) searchParams.append('limit', params.limit.toString());
  if (params.offset && params.offset >= 0) searchParams.append('offset', params.offset.toString());
  if (params.filters && params.filters.trim()) searchParams.append('filters', params.filters);
  if (params.orders && params.orders.trim()) searchParams.append('orders', params.orders);

  const url = `${BASE_URL}/posts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    console.error('microCMS API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: url,
      headers: headers
    });
    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchPost(id: string): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${id}`, { headers });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch post: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchPostByWpId(wpId: number): Promise<Post | null> {
  if (!Number.isInteger(wpId) || wpId <= 0) {
    return null;
  }
  
  try {
    const wpIdFilter = `wp_id[equals]${wpId}`;
    const response = await fetchPosts({ 
      filters: wpIdFilter,
      limit: 1 
    });
    
    return response.contents.length > 0 ? response.contents[0] : null;
  } catch {
    return null;
  }
}

export async function fetchPostById(id: string): Promise<Post | null> {
  if (!id || !id.trim()) {
    return null;
  }
  
  try {
    return await fetchPost(id.trim());
  } catch {
    return null;
  }
}

export async function fetchCategories(limit: number = 100): Promise<MicroCMSListResponse<Category>> {
  // すべてのカテゴリを取得するため、デフォルトで大きなlimitを設定
  const searchParams = new URLSearchParams();
  searchParams.append('limit', limit.toString());
  
  const url = `${BASE_URL}/categories?${searchParams.toString()}`;
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    console.error('microCMS API Error for categories:', {
      status: response.status,
      statusText: response.statusText,
      url: url
    });
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchPopularPosts(limit: number = 5): Promise<MicroCMSListResponse<Post>> {
  const validLimit = Math.max(1, Math.min(limit, 100)); // Clamp between 1 and 100
  
  return fetchPosts({
    limit: validLimit,
    orders: '-publishedAt'
  });
}

/**
 * カテゴリごとの記事数を取得
 */
export interface CategoryWithCount extends Category {
  postCount: number;
}

export async function fetchCategoriesWithPostCount(): Promise<CategoryWithCount[]> {
  try {
    // すべてのカテゴリと記事を取得
    const [categoriesData, postsData] = await Promise.all([
      fetchCategories(),
      fetchPosts({ limit: 1000 }) // 十分に大きなlimitで全記事を取得
    ]);

    // カテゴリごとの記事数をカウント
    const categoryCountMap = new Map<string, number>();
    
    postsData.contents.forEach(post => {
      post.categories?.forEach(category => {
        const currentCount = categoryCountMap.get(category.id) || 0;
        categoryCountMap.set(category.id, currentCount + 1);
      });
    });

    // カテゴリに記事数を追加し、記事数の多い順にソート
    const categoriesWithCount: CategoryWithCount[] = categoriesData.contents
      .map(category => ({
        ...category,
        postCount: categoryCountMap.get(category.id) || 0
      }))
      .sort((a, b) => b.postCount - a.postCount); // 記事数の多い順

    return categoriesWithCount;
  } catch (error) {
    console.error('Error fetching categories with post count:', error);
    // エラー時は通常のカテゴリリストを記事数0で返す
    const categoriesData = await fetchCategories();
    return categoriesData.contents.map(category => ({
      ...category,
      postCount: 0
    }));
  }
}