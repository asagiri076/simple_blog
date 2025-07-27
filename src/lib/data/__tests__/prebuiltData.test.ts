import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  getAllPosts,
  getPostById,
  getPostByWpId,
  getPostsByCategory,
  getPopularPosts,
  getRelatedPosts,
  getAdjacentPosts,
  getCategories,
  getCategoriesWithCount
} from '../prebuiltData';
import { Post, Category } from '@/types/microcms';

// fsモジュールをモック
vi.mock('fs');
vi.mock('path');

const mockReadFileSync = vi.mocked(readFileSync);
const mockJoin = vi.mocked(join);

describe('prebuiltData utilities', () => {
  const mockData = {
    posts: [
      {
        id: 'post1',
        wp_id: 123,
        title: 'テスト記事1',
        publishedAt: '2024-01-15T10:00:00.000Z',
        categories: [{ id: 'cat1', name: 'カテゴリ1' }]
      },
      {
        id: 'post2',
        title: 'テスト記事2',
        publishedAt: '2024-01-10T10:00:00.000Z',
        categories: [{ id: 'cat1', name: 'カテゴリ1' }, { id: 'cat2', name: 'カテゴリ2' }]
      },
      {
        id: 'post3',
        title: 'テスト記事3',
        publishedAt: '2024-01-05T10:00:00.000Z',
        categories: [{ id: 'cat2', name: 'カテゴリ2' }]
      }
    ] as Post[],
    categories: [
      { id: 'cat1', name: 'カテゴリ1' },
      { id: 'cat2', name: 'カテゴリ2' }
    ] as Category[],
    staticPages: [],
    relatedPosts: {
      'post1': [
        { id: 'post2', title: 'テスト記事2' },
        { id: 'post3', title: 'テスト記事3' }
      ]
    },
    categoriesWithCount: [
      { id: 'cat1', name: 'カテゴリ1', postCount: 2 },
      { id: 'cat2', name: 'カテゴリ2', postCount: 2 }
    ],
    generatedAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // デフォルトのモック設定
    mockJoin.mockReturnValue('/mock/path/prebuilt.json');
    mockReadFileSync.mockReturnValue(JSON.stringify(mockData));
    
    // プロセス環境変数をクリア
    delete process.env.PREBUILT_DATA_PATH;
    
    // キャッシュをクリア（実際のモジュールの内部状態をリセット）
    vi.resetModules();
  });

  describe('getAllPosts', () => {
    it('全記事を取得できる', async () => {
      const posts = await getAllPosts();
      expect(posts).toHaveLength(3);
      expect(posts[0].id).toBe('post1');
      expect(posts[1].id).toBe('post2');
      expect(posts[2].id).toBe('post3');
    });
  });

  describe('getPostById', () => {
    it('存在する記事IDで記事を取得', async () => {
      const post = await getPostById('post1');
      expect(post).not.toBeNull();
      expect(post!.id).toBe('post1');
      expect(post!.title).toBe('テスト記事1');
    });

    it('存在しない記事IDではnullを返す', async () => {
      const post = await getPostById('nonexistent');
      expect(post).toBeNull();
    });
  });

  describe('getPostByWpId', () => {
    it('存在するwp_idで記事を取得', async () => {
      const post = await getPostByWpId(123);
      expect(post).not.toBeNull();
      expect(post!.id).toBe('post1');
      expect(post!.wp_id).toBe(123);
    });

    it('存在しないwp_idではnullを返す', async () => {
      const post = await getPostByWpId(999);
      expect(post).toBeNull();
    });
  });

  describe('getPostsByCategory', () => {
    it('指定カテゴリの記事を取得', async () => {
      const posts = await getPostsByCategory('cat1');
      expect(posts).toHaveLength(2);
      expect(posts[0].id).toBe('post1');
      expect(posts[1].id).toBe('post2');
    });

    it('limitが指定された場合は制限される', async () => {
      const posts = await getPostsByCategory('cat1', 1);
      expect(posts).toHaveLength(1);
      expect(posts[0].id).toBe('post1');
    });

    it('存在しないカテゴリでは空配列を返す', async () => {
      const posts = await getPostsByCategory('nonexistent');
      expect(posts).toHaveLength(0);
    });
  });

  describe('getPopularPosts', () => {
    it('指定された件数の人気記事を取得', async () => {
      const posts = await getPopularPosts(2);
      expect(posts).toHaveLength(2);
      expect(posts[0].id).toBe('post1');
      expect(posts[1].id).toBe('post2');
    });

    it('デフォルトでは5件取得', async () => {
      const posts = await getPopularPosts();
      expect(posts).toHaveLength(3); // 実際のデータが3件なので3件
    });
  });

  describe('getRelatedPosts', () => {
    it('関連記事を取得', async () => {
      const relatedPosts = await getRelatedPosts('post1');
      expect(relatedPosts).toHaveLength(2);
      expect(relatedPosts[0].id).toBe('post2');
      expect(relatedPosts[1].id).toBe('post3');
    });

    it('関連記事がない場合は空配列を返す', async () => {
      const relatedPosts = await getRelatedPosts('post2');
      expect(relatedPosts).toHaveLength(0);
    });
  });

  describe('getAdjacentPosts', () => {
    it('前後の記事を正しく取得', async () => {
      const { prevPost, nextPost } = await getAdjacentPosts('post2');
      
      // post2の前の記事はpost1（より新しい記事）
      expect(prevPost).not.toBeNull();
      expect(prevPost!.id).toBe('post1');
      
      // post2の次の記事はpost3（より古い記事）
      expect(nextPost).not.toBeNull();
      expect(nextPost!.id).toBe('post3');
    });

    it('最初の記事では前の記事がnull', async () => {
      const { prevPost, nextPost } = await getAdjacentPosts('post1');
      
      expect(prevPost).toBeNull();
      expect(nextPost).not.toBeNull();
      expect(nextPost!.id).toBe('post2');
    });

    it('最後の記事では次の記事がnull', async () => {
      const { prevPost, nextPost } = await getAdjacentPosts('post3');
      
      expect(prevPost).not.toBeNull();
      expect(prevPost!.id).toBe('post2');
      expect(nextPost).toBeNull();
    });

    it('存在しない記事IDでは前後ともnull', async () => {
      const { prevPost, nextPost } = await getAdjacentPosts('nonexistent');
      
      expect(prevPost).toBeNull();
      expect(nextPost).toBeNull();
    });
  });

  describe('getCategories', () => {
    it('全カテゴリを取得', async () => {
      const categories = await getCategories();
      expect(categories).toHaveLength(2);
      expect(categories[0].id).toBe('cat1');
      expect(categories[1].id).toBe('cat2');
    });
  });

  describe('getCategoriesWithCount', () => {
    it('記事数付きカテゴリを取得', async () => {
      const categories = await getCategoriesWithCount();
      expect(categories).toHaveLength(2);
      expect(categories[0].postCount).toBe(2);
      expect(categories[1].postCount).toBe(2);
    });
  });

  describe('環境変数によるパス指定', () => {
    it('PREBUILT_DATA_PATHが指定された場合はそのパスを使用', async () => {
      // モジュールを再インポートしてキャッシュをクリア
      vi.resetModules();
      process.env.PREBUILT_DATA_PATH = '/custom/path/data.json';
      
      // 新しい環境変数でモジュールを再読み込み
      const { getAllPosts: getAllPostsNew } = await import('../prebuiltData');
      await getAllPostsNew();
      
      expect(mockReadFileSync).toHaveBeenCalledWith('/custom/path/data.json', 'utf-8');
    });
  });
});