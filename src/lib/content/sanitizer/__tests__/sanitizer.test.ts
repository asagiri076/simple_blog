import { describe, it, expect, vi } from 'vitest';
import { sanitizeHtml, sanitizeComponentHtml, replaceHtmlComponents } from '../sanitizer';

// サーバーサイドとクライアントサイドのモジュールをモック
vi.mock('../sanitizer.server', () => ({
  sanitizeHtmlServer: vi.fn().mockResolvedValue('<p>サーバーでサニタイズ済み</p>')
}));

vi.mock('../sanitizer.client', () => ({
  sanitizeHtmlClient: vi.fn().mockResolvedValue('<p>クライアントでサニタイズ済み</p>')
}));

describe('sanitizer utilities', () => {
  describe('sanitizeHtml', () => {
    it('サーバーサイド環境ではサーバー用関数を呼び出し', async () => {
      // windowオブジェクトが存在しない状態をシミュレート
      const originalWindow = global.window;
      delete (global as any).window;

      const result = await sanitizeHtml('<p>テストHTML</p>');
      
      expect(result).toBe('<p>サーバーでサニタイズ済み</p>');
      
      // windowオブジェクトを復元
      global.window = originalWindow;
    });

    it('クライアントサイド環境ではクライアント用関数を呼び出し', async () => {
      // windowオブジェクトが存在する状態をシミュレート
      global.window = {} as Window & typeof globalThis;

      const result = await sanitizeHtml('<p>テストHTML</p>');
      
      expect(result).toBe('<p>クライアントでサニタイズ済み</p>');
      
      // クリーンアップ
      delete (global as any).window;
    });
  });

  describe('sanitizeComponentHtml', () => {
    it('sanitizeHtml関数を委譲する', async () => {
      const originalWindow = global.window;
      delete (global as any).window;

      const result = await sanitizeComponentHtml('<div>コンポーネントHTML</div>');
      
      expect(result).toBe('<p>サーバーでサニタイズ済み</p>');
      
      global.window = originalWindow;
    });
  });

  describe('replaceHtmlComponents', () => {
    it('HTMLコンポーネントの置き換えが正しく実行される', async () => {
      const originalWindow = global.window;
      delete (global as any).window;

      const content = `
        <p>開始テキスト</p>
        <p><span class="html_component_id">comp-123</span></p>
        <p>終了テキスト</p>
      `;

      const components = [
        {
          component_id: 'comp-123',
          component: '<div class="custom-component">カスタムコンテンツ</div>'
        }
      ];

      const result = await replaceHtmlComponents(content, components);
      
      expect(result).toContain('<p>開始テキスト</p>');
      expect(result).toContain('<p>終了テキスト</p>');
      expect(result).toContain('<p>サーバーでサニタイズ済み</p>');
      expect(result).not.toContain('html_component_id');
      expect(result).not.toContain('comp-123');
      
      global.window = originalWindow;
    });

    it('複数のHTMLコンポーネントを同時に置き換え', async () => {
      const originalWindow = global.window;
      delete (global as any).window;

      const content = `
        <p><span class="html_component_id">comp-1</span></p>
        <p>中間テキスト</p>
        <p><span class="html_component_id">comp-2</span></p>
      `;

      const components = [
        {
          component_id: 'comp-1',
          component: '<div>コンポーネント1</div>'
        },
        {
          component_id: 'comp-2',
          component: '<div>コンポーネント2</div>'
        }
      ];

      const result = await replaceHtmlComponents(content, components);
      
      // 両方のコンポーネントが置き換えられている
      expect(result).not.toContain('comp-1');
      expect(result).not.toContain('comp-2');
      expect(result).toContain('中間テキスト');
      
      global.window = originalWindow;
    });

    it('該当するコンポーネントIDがない場合は元のコンテンツを返す', async () => {
      const content = `
        <p>テストコンテンツ</p>
        <p><span class="html_component_id">nonexistent</span></p>
      `;

      const components = [
        {
          component_id: 'different-id',
          component: '<div>存在しないコンポーネント</div>'
        }
      ];

      const result = await replaceHtmlComponents(content, components);
      
      // 置き換えが発生しない
      expect(result).toContain('nonexistent');
      expect(result).toContain('html_component_id');
    });

    it('コンポーネント配列が空の場合は元のコンテンツを返す', async () => {
      const content = `
        <p>テストコンテンツ</p>
        <p><span class="html_component_id">comp-123</span></p>
      `;

      const result = await replaceHtmlComponents(content, []);
      
      expect(result).toBe(content);
    });

    it('同じコンポーネントIDが複数回出現する場合は全て置き換え', async () => {
      const originalWindow = global.window;
      delete (global as any).window;

      const content = `
        <p><span class="html_component_id">comp-repeat</span></p>
        <p>中間テキスト</p>
        <p><span class="html_component_id">comp-repeat</span></p>
      `;

      const components = [
        {
          component_id: 'comp-repeat',
          component: '<div>繰り返しコンポーネント</div>'
        }
      ];

      const result = await replaceHtmlComponents(content, components);
      
      // 両方とも置き換えられている
      expect(result).not.toContain('comp-repeat');
      expect(result).toContain('中間テキスト');
      
      global.window = originalWindow;
    });
  });
});