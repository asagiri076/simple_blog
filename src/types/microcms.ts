export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
}

export interface HtmlComponent {
  fieldId: string;
  component_id: string;
  component: string;
}

export interface Post {
  id: string;
  wp_id?: number;
  title: string;
  contents: string;
  excerpt: string;
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  };
  categories: Category[];
  componets?: HtmlComponent[];
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

export interface MicroCMSResponse<T> {
  contents: T;
}

export interface FetchPostsParams {
  limit?: number;
  offset?: number;
  filters?: string;
  orders?: string;
}

export interface ApiResponse<T> {
  contents: T[];
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
}