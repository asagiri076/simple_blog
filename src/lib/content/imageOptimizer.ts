/**
 * microCMS画像最適化ユーティリティ
 * microCMSのimgix APIを使用して画像を最適化
 */

export type ImageFormat = 'webp' | 'avif' | 'auto' | 'jpg' | 'png';
export type FitMode = 'crop' | 'scale' | 'max' | 'min' | 'fill';

export interface ImageOptimizationOptions {
  width: number;
  height?: number;
  quality?: number;
  format?: ImageFormat;
  fit?: FitMode;
}

/**
 * microCMS画像URLに最適化パラメータを追加
 */
export function optimizeImageUrl(
  originalUrl: string,
  options: ImageOptimizationOptions
): string {
  if (!originalUrl) return originalUrl;

  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'crop'
  } = options;

  const params = new URLSearchParams({
    w: width.toString(),
    q: quality.toString(),
    fm: format,
    fit: fit
  });

  if (height) {
    params.set('h', height.toString());
  }

  return `${originalUrl}?${params.toString()}`;
}

/**
 * 用途別の画像最適化プリセット
 */
export const imagePresets = {
  /**
   * 記事ヘッダー用（大きな表示）
   */
  articleHeader: {
    mobile: { width: 640, height: 360, quality: 85 },
    tablet: { width: 1024, height: 576, quality: 85 },
    desktop: { width: 1200, height: 675, quality: 85 }
  },

  /**
   * 記事一覧用（サムネイル）
   */
  articleList: {
    mobile: { width: 320, height: 200, quality: 75 },
    tablet: { width: 400, height: 250, quality: 75 },
    desktop: { width: 512, height: 320, quality: 75 }
  },

  /**
   * サイドバー用（小サムネイル）
   */
  sidebar: {
    mobile: { width: 120, height: 96, quality: 70 },
    tablet: { width: 160, height: 128, quality: 70 },
    desktop: { width: 160, height: 128, quality: 70 }
  },

  /**
   * 記事コンテンツ内画像用
   */
  articleContent: {
    mobile: { width: 640, height: 360, quality: 80 },
    tablet: { width: 800, height: 450, quality: 80 },
    desktop: { width: 1024, height: 576, quality: 80 }
  },

  /**
   * OGP・SNSシェア用
   */
  ogp: {
    twitter: { width: 1200, height: 630, quality: 80 },
    facebook: { width: 1200, height: 630, quality: 80 }
  }
} as const;

/**
 * レスポンシブ画像セット生成
 */
export function generateResponsiveImageSet(
  originalUrl: string,
  preset: keyof typeof imagePresets,
  format: ImageFormat = 'webp'
): {
  src: string;
  srcSet: string;
  sizes: string;
} {
  if (!originalUrl || !imagePresets[preset]) {
    return {
      src: originalUrl,
      srcSet: '',
      sizes: ''
    };
  }

  const presetConfig = imagePresets[preset];
  
  // srcSetを生成
  const srcSetEntries = Object.entries(presetConfig).map(([, config]) => {
    const optimizedUrl = optimizeImageUrl(originalUrl, { ...config, format });
    return `${optimizedUrl} ${config.width}w`;
  });
  
  // デフォルトsrc（デスクトップまたは最大サイズ）
  const configEntries = Object.values(presetConfig);
  const defaultConfig = configEntries[configEntries.length - 1] || configEntries[0];
  const src = optimizeImageUrl(originalUrl, { ...defaultConfig, format });
  
  // sizes属性を生成
  const sizes = generateSizesAttribute(preset);
  
  return {
    src,
    srcSet: srcSetEntries.join(', '),
    sizes
  };
}

/**
 * sizes属性を生成
 */
function generateSizesAttribute(preset: keyof typeof imagePresets): string {
  switch (preset) {
    case 'articleHeader':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px';
    case 'articleList':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 256px, 256px';
    case 'sidebar':
      return '(max-width: 640px) 120px, (max-width: 1024px) 160px, 160px';
    case 'articleContent':
      return '(max-width: 640px) 100vw, (max-width: 800px) 100vw, 1024px';
    case 'ogp':
      return '1200px';
    default:
      return '100vw';
  }
}

/**
 * 簡単な画像最適化（基本的な用途）
 */
export function optimizeImage(originalUrl: string, width: number, height?: number): string {
  return optimizeImageUrl(originalUrl, { width, height });
}


/**
 * コンテンツ内の画像を最適化（サーバーサイド処理）
 */
export function optimizeImagesInContent(content: string): string {
  let processedContent = content;

  // microCMSの画像を含むimgタグを検索・置換
  const imgRegex = /<img[^>]*src="([^"]*microcms-assets\.io[^"]*)"[^>]*>/gi;
  
  processedContent = processedContent.replace(imgRegex, (match) => {
    // src, alt, width, height属性を抽出
    const srcMatch = match.match(/src="([^"]*)"/);
    const altMatch = match.match(/alt="([^"]*)"/);
    const widthMatch = match.match(/width="([^"]*)"/);
    const heightMatch = match.match(/height="([^"]*)"/);
    
    if (!srcMatch || !widthMatch || !heightMatch) {
      return match; // 必要な属性がない場合はそのまま
    }

    const src = srcMatch[1];
    const alt = altMatch ? altMatch[1] : '';
    const width = parseInt(widthMatch[1]);
    const height = parseInt(heightMatch[1]);

    if (!width || !height) {
      return match; // 有効な幅・高さがない場合はそのまま
    }

    // 画像を最適化
    const optimizedSrc = optimizeImageUrl(src, { 
      width, 
      height, 
      format: 'avif', 
      quality: 70 
    });
    
    // 最適化された画像HTMLを作成
    const optimizedImageHtml = `
      <figure>
        <img
          src="${optimizedSrc}"
          alt="${alt}"
          width="${width}"
          height="${height}"
          class="rounded-lg"
          loading="lazy"
          decoding="async"
        />
      </figure>
    `;

    return optimizedImageHtml.trim();
  });

  // 既存のfigureタグに包まれた画像の処理は上記のimgRegexで既に処理されているため削除
  // figureタグの処理は不要（imgRegexで既に最適化されたfigureタグに置換されるため）

  // iframelyスクリプトタグを削除（グローバルでロードするため）
  processedContent = processedContent.replace(
    /<script[^>]*src="https:\/\/cdn\.iframe\.ly\/embed\.js"[^>]*><\/script>/gi,
    ''
  );

  return processedContent;
}