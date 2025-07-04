'use client';

import { replaceTocPlaceholders } from '@/lib/content/toc/tableOfContents';
import { replaceAdPlaceholders } from '@/lib/content/ad/clientAd';

/**
 * クライアントサイドでのコンテンツ処理を統合
 * 1. Prismコードハイライト（usePrismHighlight経由）
 * 2. iframelyロード（IframelyLoader経由）
 */
export function processContentClientSide(content: string): string {
  let processedContent = content;
  
  // ToC処理（クライアントサイド - HTMLコンポーネントがない記事用）
  processedContent = replaceTocPlaceholders(processedContent);
  
  // 記事内広告の置換（クライアントサイド - HTMLコンポーネントがない記事用）
  processedContent = replaceAdPlaceholders(processedContent);
  
  return processedContent;
}