import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { siteConfig, getSiteConfig } from '../site';

describe('siteConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // 環境変数をクリーンな状態にリセット
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  afterEach(() => {
    // 元の環境変数を復元
    process.env = originalEnv;
  });

  describe('title', () => {
    it('環境変数が設定されている場合はその値を使用', () => {
      process.env.NEXT_PUBLIC_SITE_TITLE = 'カスタムブログタイトル';
      
      const config = getSiteConfig();
      
      expect(config.title).toBe('カスタムブログタイトル');
    });

    it('環境変数が未設定の場合はデフォルト値を使用', () => {
      delete process.env.NEXT_PUBLIC_SITE_TITLE;
      
      const config = getSiteConfig();
      
      expect(config.title).toBe('Simple Blog');
    });

    it('環境変数が空文字の場合はデフォルト値を使用', () => {
      process.env.NEXT_PUBLIC_SITE_TITLE = '';
      
      const config = getSiteConfig();
      
      expect(config.title).toBe('Simple Blog');
    });
  });

  describe('year', () => {
    it('固定値として2024が設定されている', () => {
      expect(siteConfig.year).toBe('2024');
    });
  });

  describe('copyright', () => {
    it('現在の年とサイトタイトルを含む著作権表示', () => {
      const currentYear = new Date().getFullYear();
      
      expect(siteConfig.copyright).toContain(currentYear.toString());
      expect(siteConfig.copyright).toContain('All rights reserved');
      expect(siteConfig.copyright).toMatch(/^© \d{4} .+ All rights reserved\.$/);
    });

    it('環境変数のサイトタイトルが著作権表示に反映される', () => {
      process.env.NEXT_PUBLIC_SITE_TITLE = 'テストサイト';
      
      const config = getSiteConfig();
      
      expect(config.copyright).toContain('テストサイト');
    });

    it('サイトタイトルが未設定の場合はデフォルト値が著作権表示に使用される', () => {
      delete process.env.NEXT_PUBLIC_SITE_TITLE;
      
      const config = getSiteConfig();
      
      expect(config.copyright).toContain('Simple Blog');
    });
  });

  describe('getSiteConfig function', () => {
    it('関数として呼び出し可能で設定オブジェクトを返す', () => {
      const config = getSiteConfig();
      
      expect(config).toHaveProperty('title');
      expect(config).toHaveProperty('year');
      expect(config).toHaveProperty('copyright');
    });

    it('全ての必須プロパティが文字列型', () => {
      const config = getSiteConfig();
      
      expect(typeof config.title).toBe('string');
      expect(typeof config.year).toBe('string');
      expect(typeof config.copyright).toBe('string');
    });

    it('titleとcopyrightは空文字ではない', () => {
      const config = getSiteConfig();
      
      expect(config.title.length).toBeGreaterThan(0);
      expect(config.copyright.length).toBeGreaterThan(0);
    });
  });

  describe('siteConfig object (backward compatibility)', () => {
    it('後方互換性のため既存のオブジェクトも利用可能', () => {
      expect(siteConfig).toHaveProperty('title');
      expect(siteConfig).toHaveProperty('year');
      expect(siteConfig).toHaveProperty('copyright');
    });
  });
});