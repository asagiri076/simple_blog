import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchPosts, fetchCategories, fetchStaticPages } from '../microcms';

// fetchをモック
global.fetch = vi.fn();

describe('microCMS API utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // 環境変数をセット
    process.env.MICROCMS_API_KEY = 'test-api-key';
    process.env.MICROCMS_DOMAIN = 'test-domain';
  });

  describe('fetchPosts', () => {
    it('基本的な記事取得が成功する', async () => {
      const mockResponse = {
        contents: [
          { id: 'post1', title: 'テスト記事1' },
          { id: 'post2', title: 'テスト記事2' }
        ],
        totalCount: 2,
        offset: 0,
        limit: 10
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchPosts();

      expect(fetch).toHaveBeenCalledWith(
        'https://test-domain.microcms.io/api/v1/posts',
        {
          headers: {
            'X-MICROCMS-API-KEY': 'test-api-key',
            'Content-Type': 'application/json'
          }
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('パラメータ付きで記事取得が成功する', async () => {
      const mockResponse = {
        contents: [{ id: 'post1', title: 'フィルタされた記事' }],
        totalCount: 1,
        offset: 10,
        limit: 5
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const params = {
        limit: 5,
        offset: 10,
        filters: 'publishedAt[greater_than]2024-01-01',
        orders: '-publishedAt'
      };

      await fetchPosts(params);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=5'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('offset=10'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('filters=publishedAt%5Bgreater_than%5D2024-01-01'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('orders=-publishedAt'),
        expect.any(Object)
      );
    });

    it('APIエラー時に適切にエラーをスローする', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(fetchPosts()).rejects.toThrow('Failed to fetch posts: 404 Not Found');
    });

    it('不正なパラメータは無視される', async () => {
      const mockResponse = { contents: [], totalCount: 0, offset: 0, limit: 10 };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const params = {
        limit: 0, // 無効な値
        offset: -1, // 無効な値
        filters: '   ', // 空白のみ
        orders: '' // 空文字
      };

      await fetchPosts(params);

      const calledUrl = (fetch as any).mock.calls[0][0];
      expect(calledUrl).not.toContain('limit=0');
      expect(calledUrl).not.toContain('offset=-1');
      expect(calledUrl).not.toContain('filters=');
      expect(calledUrl).not.toContain('orders=');
    });
  });

  describe('fetchCategories', () => {
    it('カテゴリ取得が成功する', async () => {
      const mockResponse = {
        contents: [
          { id: 'cat1', name: 'カテゴリ1' },
          { id: 'cat2', name: 'カテゴリ2' }
        ],
        totalCount: 2,
        offset: 0,
        limit: 100
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchCategories();

      expect(fetch).toHaveBeenCalledWith(
        'https://test-domain.microcms.io/api/v1/categories?limit=100',
        {
          headers: {
            'X-MICROCMS-API-KEY': 'test-api-key',
            'Content-Type': 'application/json'
          }
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('カテゴリ取得時のAPIエラー', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(fetchCategories()).rejects.toThrow('Failed to fetch categories: 500 Internal Server Error');
    });
  });

  describe('fetchStaticPages', () => {
    it('静的ページ取得が成功する', async () => {
      const mockResponse = {
        contents: [
          { id: 'page1', page_id: 'about', title: 'About' },
          { id: 'page2', page_id: 'contact', title: 'Contact' }
        ],
        totalCount: 2,
        offset: 0,
        limit: 100
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await fetchStaticPages();

      expect(fetch).toHaveBeenCalledWith(
        'https://test-domain.microcms.io/api/v1/static_pages?limit=100',
        {
          headers: {
            'X-MICROCMS-API-KEY': 'test-api-key',
            'Content-Type': 'application/json'
          }
        }
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('環境変数エラー', () => {
    it('API_KEYが未設定の場合はエラー', async () => {
      delete process.env.MICROCMS_API_KEY;

      await expect(fetchPosts()).rejects.toThrow('microCMS API key and domain are required');
    });

    it('DOMAINが未設定の場合はエラー', async () => {
      delete process.env.MICROCMS_DOMAIN;

      await expect(fetchPosts()).rejects.toThrow('microCMS API key and domain are required');
    });
  });

  describe('レート制限', () => {
    it('リクエスト間に適切な遅延が入る', async () => {
      const mockResponse = { contents: [], totalCount: 0, offset: 0, limit: 10 };

      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      const startTime = Date.now();
      
      // 2回のリクエストを実行
      await fetchPosts();
      await fetchPosts();
      
      const elapsedTime = Date.now() - startTime;
      
      // 最低100ms（RATE_LIMIT_DELAY）の遅延があることを確認
      expect(elapsedTime).toBeGreaterThanOrEqual(100);
    });
  });
});