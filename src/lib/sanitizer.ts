/**
 * 環境に応じたHTMLサニタイズ関数
 * @param html - サニタイズするHTML文字列
 * @returns サニタイズされたHTML文字列
 */
export async function sanitizeHtml(html: string): Promise<string> {
  if (typeof window === 'undefined') {
    // サーバーサイド環境
    const { sanitizeHtmlServer } = await import('./sanitizer.server');
    return sanitizeHtmlServer(html);
  } else {
    // クライアントサイド環境
    const { sanitizeHtmlClient } = await import('./sanitizer.client');
    return sanitizeHtmlClient(html);
  }
}

/**
 * HTMLコンポーネントのHTMLをサニタイズする
 * @param componentHtml - コンポーネントのHTML文字列
 * @returns サニタイズされたHTML文字列
 */
export async function sanitizeComponentHtml(componentHtml: string): Promise<string> {
  return sanitizeHtml(componentHtml);
}
