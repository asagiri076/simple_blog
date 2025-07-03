import { HtmlComponent } from '@/types/microcms';
import { sanitizeComponentHtml } from '@/lib/content/sanitizer/sanitizer';
import { replaceTocPlaceholders } from '@/lib/content/toc/serverToC';
import { optimizeImagesInContent } from '@/lib/content/imageOptimizer';

/**
 * サーバーサイドでのコンテンツ処理を統合
 * 1. ToC生成・置換
 * 2. HTMLコンポーネント置換・サニタイズ
 * 3. 画像最適化
 */
export async function processContentServerSide(
  content: string,
  components: HtmlComponent[] = []
): Promise<string> {
  let processedContent = content;

  // 1. ToC処理（サーバーサイド）
  processedContent = replaceTocPlaceholders(processedContent);

  // 2. HTMLコンポーネントの置き換えとサニタイズ
  if (components.length > 0) {
    processedContent = await replaceHtmlComponents(processedContent, components);
  }

  // 3. 画像最適化
  processedContent = optimizeImagesInContent(processedContent);

  return processedContent;
}

/**
 * HTMLコンポーネントの置き換えとサニタイズ処理
 */
async function replaceHtmlComponents(content: string, components: HtmlComponent[]): Promise<string> {
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