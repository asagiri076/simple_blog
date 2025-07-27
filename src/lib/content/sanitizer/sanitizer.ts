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

/**
 * HTMLコンポーネントの置き換えとサニタイズを実行
 * @param content - 処理対象のコンテンツ
 * @param components - HTMLコンポーネント配列
 * @returns 処理済みコンテンツ
 */
export async function replaceHtmlComponents(content: string, components: import('@/types/microcms').HtmlComponent[]): Promise<string> {
  let processedContent = content;

  // 各コンポーネントに対してspanを置き換え（外側のpタグも含めて）
  for (const component of components) {
    const spanPattern = new RegExp(
      `<p><span class="html_component_id">${component.component_id}</span></p>`,
      'g'
    );
    // HTMLコンポーネントをサニタイズしてから置換
    const sanitizedComponent = await sanitizeComponentHtml(component.component);
    processedContent = processedContent.replace(spanPattern, sanitizedComponent);
  }

  return processedContent;
}
