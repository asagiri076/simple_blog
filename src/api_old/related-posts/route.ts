import { NextRequest, NextResponse } from 'next/server';
import { fetchPosts, fetchPostByWpId, fetchPostById } from '@/lib/microcms';
import { Post, ApiResponse, ApiErrorResponse } from '@/types/microcms';
import { parseArticleIdType } from '@/lib/articleUrl';

// /api/related-posts?postId=xxxx&limit=5
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<Post> | ApiErrorResponse>> {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  const limit = Number(searchParams.get('limit') || 5);

  if (!postId) {
    return NextResponse.json({ contents: [] }, { status: 400 });
  }

  // 対象記事を取得（IDタイプに応じて適切なfetch関数を使用）
  let targetPost: Post | null;
  try {
    const idType = parseArticleIdType(postId);
    targetPost = await (idType === 'wp_id' ? fetchPostByWpId(parseInt(postId)) : fetchPostById(postId));
    if (!targetPost) {
      return NextResponse.json({ contents: [] }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ contents: [] }, { status: 404 });
  }

  // タグ一致記事をAPIでlimit件取得
  const categories = targetPost.categories || [];
  let related: Post[] = [];
  let usedIds = new Set<string>();

  if (categories.length > 0) {
    const categoryIds = categories.map((cat) => cat.id);
    // 複数カテゴリを[or]でつなぐ
    const filters = categoryIds.map((id) => `categories[contains]${id}`).join('[or]');
    // タグ一致で最新順にlimit件取得（自分自身を除外）
    const res = await fetchPosts({
      filters: `${filters}[and]id[not_equals]${targetPost.id}`,
      limit,
      orders: '-publishedAt',
    });
    related = res.contents;
    usedIds = new Set(related.map((p) => p.id));
  } else {
    // タグなし同士
    const res = await fetchPosts({
      filters: `categories[equals]null[and]id[not_equals]${targetPost.id}`,
      limit,
      orders: '-publishedAt',
    });
    related = res.contents;
    usedIds = new Set(related.map((p) => p.id));
  }

  // 足りない場合は最新記事で補充
  if (related.length < limit) {
    usedIds.add(targetPost.id);
    const excludeIds = Array.from(usedIds);
    const filters = excludeIds.map((id) => `id[not_equals]${id}`).join('[and]');
    const restRes = await fetchPosts({
      filters,
      limit: limit - related.length,
      orders: '-publishedAt',
    });
    related = related.concat(restRes.contents.slice(0, limit - related.length));
  }

  return NextResponse.json({ contents: related });
}
