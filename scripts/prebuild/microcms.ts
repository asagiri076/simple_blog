import { Post, Category, MicroCMSListResponse, FetchPostsParams } from './types';

// 遅延初期化を行う関数
function getMicroCMSConfig() {
  const API_KEY = process.env.MICROCMS_API_KEY;
  const DOMAIN = process.env.MICROCMS_DOMAIN;
  
  if (!API_KEY || !DOMAIN) {
    throw new Error('microCMS API key and domain are required');
  }
  
  return {
    baseUrl: `https://${DOMAIN}.microcms.io/api/v1`,
    headers: {
      'X-MICROCMS-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    }
  };
}

// Rate limiting: sleep function to avoid 429 errors
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiting delay (100ms between requests)
const RATE_LIMIT_DELAY = 100;

export async function fetchPosts(params: FetchPostsParams = {}): Promise<MicroCMSListResponse<Post>> {
  // Rate limiting delay
  await sleep(RATE_LIMIT_DELAY);
  
  const { baseUrl, headers } = getMicroCMSConfig();
  const searchParams = new URLSearchParams();
  
  if (params.limit && params.limit > 0) searchParams.append('limit', params.limit.toString());
  if (params.offset && params.offset >= 0) searchParams.append('offset', params.offset.toString());
  if (params.filters && params.filters.trim()) searchParams.append('filters', params.filters);
  if (params.orders && params.orders.trim()) searchParams.append('orders', params.orders);

  const url = `${baseUrl}/posts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
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
  // Rate limiting delay
  await sleep(RATE_LIMIT_DELAY);
  
  const { baseUrl, headers } = getMicroCMSConfig();
  const response = await fetch(`${baseUrl}/posts/${id}`, { headers });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch post: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchCategories(limit: number = 100): Promise<MicroCMSListResponse<Category>> {
  // Rate limiting delay
  await sleep(RATE_LIMIT_DELAY);
  
  const { baseUrl, headers } = getMicroCMSConfig();
  
  // すべてのカテゴリを取得するため、デフォルトで大きなlimitを設定
  const searchParams = new URLSearchParams();
  searchParams.append('limit', limit.toString());
  
  const url = `${baseUrl}/categories?${searchParams.toString()}`;
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