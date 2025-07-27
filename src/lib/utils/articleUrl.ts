import { Post } from '@/types/microcms';

export type ArticleIdType = 'wp_id' | 'id';

/**
 * 記事IDの取得（wp_idがある場合はそれを、ない場合はidを使用）
 */
export function getArticleId(post: Post): string {
  return post.wp_id ? post.wp_id.toString() : post.id;
}


/**
 * URLパラメータからIDタイプを判定（数値ならwp_id、そうでなければid）
 */
export function parseArticleIdType(articleId: string): ArticleIdType {
  return /^\d+$/.test(articleId) ? 'wp_id' : 'id';
}

/**
 * 公開日から年月を抽出
 */
export function extractYearMonth(publishedAt: string): { year: string; month: string } {
  const date = new Date(publishedAt);
  return {
    year: date.getFullYear().toString(),
    month: (date.getMonth() + 1).toString().padStart(2, '0')
  };
}

/**
 * 記事の詳細ページURLを生成
 */
export function generateArticleUrl(post: Post): string {
  const { year, month } = extractYearMonth(post.publishedAt);
  const articleId = getArticleId(post);
  return `/${year}/${month}/${articleId}`;
}