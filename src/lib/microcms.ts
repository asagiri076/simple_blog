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

export async function fetchPosts(params?: FetchPostsParams): Promise<MicroCMSListResponse<Post>> {
  const searchParams = new URLSearchParams();
  
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.offset) searchParams.append('offset', params.offset.toString());
  if (params?.filters) searchParams.append('filters', params.filters);
  if (params?.orders) searchParams.append('orders', params.orders);

  const url = `${BASE_URL}/posts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
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
  try {
    return await fetchPost(id);
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<MicroCMSListResponse<Category>> {
  const response = await fetch(`${BASE_URL}/categories`, { headers });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchPopularPosts(limit: number = 5): Promise<MicroCMSListResponse<Post>> {
  return fetchPosts({
    limit,
    orders: '-publishedAt'
  });
}