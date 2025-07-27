import { describe, it, expect } from 'vitest';
import {
  optimizeImageUrl,
  optimizeImage,
  generateResponsiveImageSet,
  optimizeImagesInContent,
  imagePresets
} from '../imageOptimizer';

describe('imageOptimizer utilities', () => {
  const sampleImageUrl = 'https://example.microcms-assets.io/assets/123/sample.jpg';

  describe('optimizeImageUrl', () => {
    it('基本的な画像最適化パラメータを追加', () => {
      const result = optimizeImageUrl(sampleImageUrl, {
        width: 800,
        height: 600
      });

      expect(result).toContain('w=800');
      expect(result).toContain('h=600');
      expect(result).toContain('q=80'); // デフォルト品質
      expect(result).toContain('fm=webp'); // デフォルト形式
      expect(result).toContain('fit=crop'); // デフォルトfit
    });

    it('カスタムオプションが正しく適用される', () => {
      const result = optimizeImageUrl(sampleImageUrl, {
        width: 1200,
        height: 800,
        quality: 90,
        format: 'avif',
        fit: 'scale'
      });

      expect(result).toContain('w=1200');
      expect(result).toContain('h=800');
      expect(result).toContain('q=90');
      expect(result).toContain('fm=avif');
      expect(result).toContain('fit=scale');
    });

    it('heightが未指定の場合はhパラメータが含まれない', () => {
      const result = optimizeImageUrl(sampleImageUrl, {
        width: 800
      });

      expect(result).toContain('w=800');
      expect(result).not.toContain('h=');
    });

    it('空のURLの場合はそのまま返す', () => {
      const result = optimizeImageUrl('', { width: 800 });
      expect(result).toBe('');
    });

    it('nullやundefinedのURLの場合はそのまま返す', () => {
      expect(optimizeImageUrl(null as any, { width: 800 })).toBe(null);
      expect(optimizeImageUrl(undefined as any, { width: 800 })).toBe(undefined);
    });
  });

  describe('optimizeImage', () => {
    it('幅のみ指定した場合', () => {
      const result = optimizeImage(sampleImageUrl, 800);
      
      expect(result).toContain('w=800');
      expect(result).not.toContain('h=');
    });

    it('幅と高さを指定した場合', () => {
      const result = optimizeImage(sampleImageUrl, 800, 600);
      
      expect(result).toContain('w=800');
      expect(result).toContain('h=600');
    });
  });

  describe('generateResponsiveImageSet', () => {
    it('有効なプリセットでレスポンシブ画像セットを生成', () => {
      const result = generateResponsiveImageSet(sampleImageUrl, 'articleList');

      expect(result.src).toContain(sampleImageUrl);
      expect(result.srcSet).toContain('320w');
      expect(result.srcSet).toContain('400w');
      expect(result.srcSet).toContain('512w');
      expect(result.sizes).toContain('(max-width: 640px)');
    });

    it('存在しないプリセットの場合はフォールバック', () => {
      const result = generateResponsiveImageSet(sampleImageUrl, 'nonexistent' as any);

      expect(result.src).toBe(sampleImageUrl);
      expect(result.srcSet).toBe('');
      expect(result.sizes).toBe('');
    });

    it('空のURLの場合はフォールバック', () => {
      const result = generateResponsiveImageSet('', 'articleList');

      expect(result.src).toBe('');
      expect(result.srcSet).toBe('');
      expect(result.sizes).toBe('');
    });

    it('カスタム形式が適用される', () => {
      const result = generateResponsiveImageSet(sampleImageUrl, 'articleList', 'avif');

      expect(result.src).toContain('fm=avif');
      expect(result.srcSet).toContain('fm=avif');
    });
  });

  describe('optimizeImagesInContent', () => {
    it('microCMS画像を含むimgタグを最適化', () => {
      const html = `
        <p>テスト文章</p>
        <img src="https://example.microcms-assets.io/assets/123/test.jpg" alt="テスト画像" width="800" height="600" />
        <p>続きの文章</p>
      `;

      const result = optimizeImagesInContent(html);

      expect(result).toContain('<figure>');
      expect(result).toContain('loading="lazy"');
      expect(result).toContain('decoding="async"');
      expect(result).toContain('class="rounded-lg"');
      expect(result).toContain('fm=avif');
      expect(result).toContain('q=70');
    });

    it('microCMS以外の画像は変更されない', () => {
      const html = `
        <img src="https://example.com/image.jpg" alt="外部画像" width="800" height="600" />
      `;

      const result = optimizeImagesInContent(html);
      expect(result).toBe(html);
    });

    it('必要な属性がないimgタグは変更されない', () => {
      const html = `
        <img src="https://example.microcms-assets.io/assets/123/test.jpg" alt="テスト画像" />
      `;

      const result = optimizeImagesInContent(html);
      expect(result).toBe(html);
    });

    it('iframelyスクリプトタグが削除される', () => {
      const html = `
        <p>コンテンツ</p>
        <script src="https://cdn.iframe.ly/embed.js"></script>
        <p>続きのコンテンツ</p>
      `;

      const result = optimizeImagesInContent(html);
      expect(result).not.toContain('<script');
      expect(result).toContain('コンテンツ');
      expect(result).toContain('続きのコンテンツ');
    });

    it('複数の画像が同時に処理される', () => {
      const html = `
        <img src="https://example.microcms-assets.io/assets/123/test1.jpg" alt="画像1" width="800" height="600" />
        <p>中間テキスト</p>
        <img src="https://example.microcms-assets.io/assets/456/test2.jpg" alt="画像2" width="400" height="300" />
      `;

      const result = optimizeImagesInContent(html);
      
      // 両方の画像がfigureタグで包まれている
      expect((result.match(/<figure>/g) || []).length).toBe(2);
      expect(result).toContain('画像1');
      expect(result).toContain('画像2');
    });
  });

  describe('imagePresets', () => {
    it('全てのプリセットが必要なプロパティを持つ', () => {
      Object.entries(imagePresets).forEach(([presetName, preset]) => {
        if (presetName === 'ogp') {
          // OGPプリセットは特別な構造
          expect(preset.twitter).toBeDefined();
          expect(preset.facebook).toBeDefined();
        } else {
          // 通常のプリセット
          expect(preset.mobile).toBeDefined();
          expect(preset.tablet).toBeDefined();
          expect(preset.desktop).toBeDefined();
          
          // 各デバイス設定が必要なプロパティを持つ
          [preset.mobile, preset.tablet, preset.desktop].forEach(config => {
            expect(config.width).toBeGreaterThan(0);
            expect(config.height).toBeGreaterThan(0);
            expect(config.quality).toBeGreaterThan(0);
            expect(config.quality).toBeLessThanOrEqual(100);
          });
        }
      });
    });

    it('articleHeaderプリセットが正しい値を持つ', () => {
      const preset = imagePresets.articleHeader;
      
      expect(preset.mobile.width).toBe(640);
      expect(preset.mobile.height).toBe(360);
      expect(preset.desktop.width).toBe(1200);
      expect(preset.desktop.height).toBe(675);
    });
  });
});