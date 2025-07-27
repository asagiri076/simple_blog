// 型定義（script配下専用）
export interface Post {
  id: string;
  title: string;
  content?: string;
  contents?: string;
  publishedAt: string;
  revisedAt: string;
  categories?: Category[];
  tags?: Tag[];
  featuredImage?: {
    url: string;
    width: number;
    height: number;
  };
  excerpt?: string;
  wp_id?: number;
  components?: any[];
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}

export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface FetchPostsParams {
  limit?: number;
  offset?: number;
  filters?: string;
  orders?: string;
}

export interface StaticPage {
  id: string;
  page_id: string;
  title: string;
  contents: string;
  components?: any[] | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}

export interface PrebuiltData {
  posts: Post[];
  categories: Category[];
  staticPages: StaticPage[];
  relatedPosts: Record<string, Post[]>;
  categoriesWithCount: Array<Category & { postCount: number }>;
  generatedAt: string;
}