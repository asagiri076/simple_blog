import DOMPurify from 'dompurify';

// HTMLサニタイズの設定
const SANITIZE_CONFIG = {
  // 許可するタグ（商品紹介に必要な基本タグのみ）
  ALLOWED_TAGS: [
    'div', 'span', 'p', 'a', 'img', 'strong', 'em', 'b', 'i',
    'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'br', 'hr', 'blockquote', 'pre', 'code', 'table', 'thead',
    'tbody', 'tr', 'td', 'th', 'small', 'sub', 'sup'
  ],
  
  // 許可する属性（最小限）
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'id', 'style',
    'target', 'rel', 'width', 'height', 'colspan', 'rowspan'
  ],
  
  // 危険なものを明示的に禁止
  FORBID_TAGS: [
    'script', 'iframe', 'form', 'input', 'textarea', 'style', 
    'link', 'video', 'audio', 'embed', 'object', 'applet',
    'meta', 'base'
  ],
  
  // すべてのイベントハンドラーを禁止
  FORBID_ATTR: ['on*'],
  
  // プロトコル制限
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  
  // その他の設定
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  SANITIZE_DOM: true
};

/**
 * クライアントサイド専用HTMLサニタイズ関数
 * @param html - サニタイズするHTML文字列
 * @returns サニタイズされたHTML文字列
 */
export function sanitizeHtmlClient(html: string): string {
  return DOMPurify.sanitize(html, SANITIZE_CONFIG);
}