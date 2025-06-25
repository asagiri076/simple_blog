import { fetchPosts, fetchCategoriesWithPostCount } from '@/lib/microcms';
import ArticleLayout from '@/components/ArticleLayout';

export default async function Home() {
  // 静的エクスポート用：1ページ目のみ表示
  const currentPage = 1;
  const limit = 10;
  const offset = 0;

  const [postsData, categoriesData] = await Promise.all([
    fetchPosts({ limit, offset, orders: '-publishedAt' }),
    fetchCategoriesWithPostCount()
  ]);

  const totalPages = Math.ceil(postsData.totalCount / limit);

  return (
    <ArticleLayout
      title="最新記事"
      posts={postsData.contents}
      categories={categoriesData}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/"
    />
  );
}