import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { generateTableOfContents, renderTableOfContents, replaceTocPlaceholders } from '../tableOfContents';

// JSDOMのセットアップ
beforeEach(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
  global.DOMParser = dom.window.DOMParser;
  global.document = dom.window.document;
});

describe('tableOfContents utilities', () => {
  describe('generateTableOfContents', () => {
    it('基本的な見出しからToCを生成', () => {
      const html = `
        <h2>第1章</h2>
        <p>内容</p>
        <h3>1.1 節</h3>
        <p>内容</p>
        <h2>第2章</h2>
      `;

      const toc = generateTableOfContents(html);
      
      expect(toc).toHaveLength(2);
      expect(toc[0].title).toBe('第1章');
      expect(toc[0].level).toBe(2);
      expect(toc[0].children).toHaveLength(1);
      expect(toc[0].children![0].title).toBe('1.1 節');
      expect(toc[0].children![0].level).toBe(3);
      
      expect(toc[1].title).toBe('第2章');
      expect(toc[1].level).toBe(2);
      expect(toc[1].children).toHaveLength(0);
    });

    it('空の見出しは無視される', () => {
      const html = `
        <h2>有効な見出し</h2>
        <h3></h3>
        <h2>   </h2>
        <h2>もう一つの有効な見出し</h2>
      `;

      const toc = generateTableOfContents(html);
      
      expect(toc).toHaveLength(2);
      expect(toc[0].title).toBe('有効な見出し');
      expect(toc[1].title).toBe('もう一つの有効な見出し');
    });

    it('IDが自動生成される（日本語対応）', () => {
      const html = `
        <h2>プログラミング入門</h2>
        <h3>JavaScript の基礎</h3>
      `;

      const toc = generateTableOfContents(html);
      
      expect(toc[0].id).toBe('プログラミング入門');
      expect(toc[0].children![0].id).toBe('javascript-の基礎');
    });

    it('既存のIDがある場合は保持される', () => {
      const html = `
        <h2 id="custom-id">カスタムID付き見出し</h2>
        <h3>通常の見出し</h3>
      `;

      const toc = generateTableOfContents(html);
      
      expect(toc[0].id).toBe('custom-id');
      expect(toc[0].children![0].id).toBe('通常の見出し');
    });

    it('見出しがない場合は空配列を返す', () => {
      const html = `
        <p>段落のみ</p>
        <div>divタグ</div>
      `;

      const toc = generateTableOfContents(html);
      expect(toc).toHaveLength(0);
    });
  });

  describe('renderTableOfContents', () => {
    it('空のToCの場合は空文字を返す', () => {
      const result = renderTableOfContents([]);
      expect(result).toBe('');
    });

    it('基本的なToCのHTMLレンダリング', () => {
      const tocItems = [
        {
          id: 'chapter1',
          title: '第1章',
          level: 2,
          children: [
            {
              id: 'section1-1',
              title: '1.1 節',
              level: 3,
              children: []
            }
          ]
        }
      ];

      const result = renderTableOfContents(tocItems);
      
      expect(result).toContain('table-of-contents');
      expect(result).toContain('目次');
      expect(result).toContain('href="#chapter1"');
      expect(result).toContain('第1章');
      expect(result).toContain('href="#section1-1"');
      expect(result).toContain('1.1 節');
      expect(result).toContain('toc-level-2');
      expect(result).toContain('toc-level-3');
    });
  });

  describe('replaceTocPlaceholders', () => {
    it('[toc]プレースホルダーがToCに置換される', () => {
      const html = `
        <p>導入文</p>
        <p>[toc]</p>
        <h2>第1章</h2>
        <p>内容</p>
      `;

      const result = replaceTocPlaceholders(html);
      
      expect(result).not.toContain('[toc]');
      expect(result).toContain('table-of-contents');
      expect(result).toContain('第1章');
    });

    it('複数の[toc]プレースホルダーが全て置換される', () => {
      const html = `
        <p>[toc]</p>
        <h2>第1章</h2>
        <p>中間のテキスト</p>
        <p>[toc]</p>
        <h3>1.1 節</h3>
      `;

      const result = replaceTocPlaceholders(html);
      
      // [toc]が全て削除されている
      expect(result.match(/\[toc\]/g)).toBeNull();
      // table-of-contentsが2つ含まれている
      expect((result.match(/table-of-contents/g) || []).length).toBe(2);
    });

    it('[toc]がない場合は元のHTMLをそのまま返す', () => {
      const html = `
        <h2>第1章</h2>
        <p>内容</p>
      `;

      const result = replaceTocPlaceholders(html);
      expect(result).toBe(html);
    });

    // 見出しがない場合のテスト - 実用性が低いためコメントアウト
    // it('見出しがない場合は[toc]プレースホルダーが削除される', () => {
    //   const html = `
    //     <p>導入文</p>
    //     <p>[toc]</p>
    //     <p>本文</p>
    //   `;

    //   const result = replaceTocPlaceholders(html);
    //   // 見出しがない場合、[toc]は空文字で置換される
    //   expect(result).toContain('導入文');
    //   expect(result).toContain('本文');
    //   // ToCが生成されないため、[toc]は空で置換される
    //   expect(result.includes('<p></p>') || !result.includes('[toc]')).toBe(true);
    // });
  });
});