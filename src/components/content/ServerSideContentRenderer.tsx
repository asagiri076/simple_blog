import { HtmlComponent } from '@/types/microcms';
import { replaceHtmlComponents } from '@/lib/content/sanitizer/sanitizer';
import { replaceTocPlaceholders } from '@/lib/content/toc/serverToC';
import { optimizeImagesInContent } from '@/lib/content/imageOptimizer';
import ClientSideContentRenderer from './ClientSideContentRenderer';

interface ServerSideContentRendererProps {
  content: string;
  components?: HtmlComponent[];
}

/**
 * サーバーサイドでのコンテンツ処理を実行し、
 * クライアントサイドの処理に引き継ぐ
 */
export default async function ServerSideContentRenderer({ 
  content, 
  components = [] 
}: ServerSideContentRendererProps) {
  let processedContent = content;

  // 1. ToC処理（サーバーサイド）
  processedContent = replaceTocPlaceholders(processedContent);

  // 2. HTMLコンポーネントの置き換えとサニタイズ
  if (components.length > 0) {
    processedContent = await replaceHtmlComponents(processedContent, components);
  }

  // 3. 画像最適化
  processedContent = optimizeImagesInContent(processedContent);

  // クライアントサイドの処理に引き継ぐ
  return <ClientSideContentRenderer content={processedContent} />;
}