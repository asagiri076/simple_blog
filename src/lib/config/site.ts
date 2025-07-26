/**
 * サイト全体の設定
 */
export const siteConfig = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'Simple Blog',
  year: '2024',
  copyright: `© ${new Date().getFullYear()} ${process.env.NEXT_PUBLIC_SITE_TITLE || 'Simple Blog'}. All rights reserved.`,
} as const;