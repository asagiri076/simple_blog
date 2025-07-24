/**
 * サーバーサイドでの記事内広告置換処理
 */

/**
 * 記事内広告のHTMLを生成
 */
export function renderInArticleAd(): string {
  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) {
    return '';
  }

  const adHtml = `
    <div class="my-6 flex justify-center">
      <div class="w-full max-w-md">
        <p class="text-xs text-gray-400 mb-2 text-center">広告</p>
        <ins class="adsbygoogle"
            style="display: block; text-align: center; min-height: 200px;"
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="${process.env.NEXT_PUBLIC_ADSENSE_ID}"
            data-ad-slot="${process.env.NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT}"
            data-adtest="${process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' ? 'on' : 'off'}">
        </ins>
      </div>
    </div>
  `;

  return adHtml;
}

/**
 * <p>[inAD]</p> プレースホルダーを記事内広告に置換
 */
export function replaceAdPlaceholders(content: string): string {
  // 記事内広告のHTMLを生成
  const adHtml = renderInArticleAd();
  
  // Replace all <p>[inAD]</p> with the generated ad
  let processedContent = content;
  
  // Pattern to match <p>[inAD]</p> with optional whitespace
  const adPattern = /<p\s*[^>]*>\s*\[inAD\]\s*<\/p>/gi;
  
  if (adHtml && processedContent.match(adPattern)) {
    processedContent = processedContent.replace(adPattern, adHtml);
  }
  
  return processedContent;
}