import { describe, it, expect } from 'vitest';
import { getArticleId, parseArticleIdType, extractYearMonth, generateArticleUrl } from '../articleUrl';
import { Post } from '@/types/microcms';

describe('articleUrl utilities', () => {
  describe('getArticleId', () => {
    it('wp_idがある場合はwp_idを文字列で返す', () => {
      const post = { id: 'abc123', wp_id: 12345 } as Post;
      expect(getArticleId(post)).toBe('12345');
    });

    it('wp_idがない場合はidを返す', () => {
      const post = { id: 'abc123' } as Post;
      expect(getArticleId(post)).toBe('abc123');
    });

    it('wp_idが0の場合はidを返す', () => {
      const post = { id: 'abc123', wp_id: 0 } as Post;
      expect(getArticleId(post)).toBe('abc123');
    });
  });

  describe('parseArticleIdType', () => {
    it('数値のみの文字列はwp_idと判定', () => {
      expect(parseArticleIdType('12345')).toBe('wp_id');
      expect(parseArticleIdType('0')).toBe('wp_id');
      expect(parseArticleIdType('999')).toBe('wp_id');
    });

    it('英数字混合の文字列はidと判定', () => {
      expect(parseArticleIdType('abc123')).toBe('id');
      expect(parseArticleIdType('test-article')).toBe('id');
      expect(parseArticleIdType('a1b2c3')).toBe('id');
    });

    it('空文字はidと判定', () => {
      expect(parseArticleIdType('')).toBe('id');
    });
  });

  describe('extractYearMonth', () => {
    it('正常な日付文字列から年月を抽出', () => {
      const result = extractYearMonth('2023-12-25T10:30:00.000Z');
      expect(result).toEqual({
        year: '2023',
        month: '12'
      });
    });

    it('1桁の月は0埋めされる', () => {
      const result = extractYearMonth('2023-05-15T08:00:00.000Z');
      expect(result).toEqual({
        year: '2023',
        month: '05'
      });
    });

    it('1月の場合', () => {
      const result = extractYearMonth('2024-01-01T00:00:00.000Z');
      expect(result).toEqual({
        year: '2024',
        month: '01'
      });
    });

    it('12月の場合', () => {
      // UTC時間で12月31日23:59を指定（タイムゾーンの影響を避ける）
      const result = extractYearMonth('2024-12-15T12:00:00.000Z');
      expect(result).toEqual({
        year: '2024',
        month: '12'
      });
    });
  });

  describe('generateArticleUrl', () => {
    it('wp_idがある記事のURL生成', () => {
      const post = {
        id: 'abc123',
        wp_id: 12345,
        publishedAt: '2023-12-25T10:30:00.000Z'
      } as Post;
      
      expect(generateArticleUrl(post)).toBe('/2023/12/12345');
    });

    it('wp_idがない記事のURL生成', () => {
      const post = {
        id: 'test-article-id',
        publishedAt: '2024-01-15T08:00:00.000Z'
      } as Post;
      
      expect(generateArticleUrl(post)).toBe('/2024/01/test-article-id');
    });

    it('1桁月の記事のURL生成', () => {
      const post = {
        id: 'spring-article',
        publishedAt: '2024-03-01T12:00:00.000Z'
      } as Post;
      
      expect(generateArticleUrl(post)).toBe('/2024/03/spring-article');
    });
  });
});