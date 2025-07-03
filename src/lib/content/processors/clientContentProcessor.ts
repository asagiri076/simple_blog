'use client';

import { replaceTocPlaceholders } from '@/lib/content/toc/tableOfContents';

/**
 * クライアントサイドでのコンテンツ処理を統合
 * 1. ToC生成・置換（HTMLコンポーネントがない記事用）
 * 2. Prismコードハイライト（usePrismHighlight経由）
 * 3. iframelyロード（IframelyLoader経由）
 */
export function processContentClientSide(content: string): string {
  // ToC処理（クライアントサイド - HTMLコンポーネントがない記事用）
  return replaceTocPlaceholders(content);
}