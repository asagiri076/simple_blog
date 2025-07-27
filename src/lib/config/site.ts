/**
 * サイト全体の設定を取得する関数
 * テスト時の環境変数の動的な変更に対応するため、関数形式で提供
 */
export function getSiteConfig() {
  return {
    title: process.env.NEXT_PUBLIC_SITE_TITLE || 'Simple Blog',
    year: '2024',
    copyright: `© ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_SITE_TITLE || 'Simple Blog'}. All rights reserved.`,
  } as const;
}

/**
 * 後方互換性のため、既存のsiteConfigオブジェクトも提供
 * @deprecated getSiteConfig()を使用することを推奨
 */
export const siteConfig = getSiteConfig();