import { fetchPosts, fetchCategories } from '@/lib/microcms';
import ArticleLayout from '@/components/ArticleLayout';

// Next.js App RouterのPageProps型を利用
interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const [postsData, categoriesData] = await Promise.all([
    fetchPosts({ limit, offset, orders: '-publishedAt' }),
    fetchCategories()
  ]);

  const totalPages = Math.ceil(postsData.totalCount / limit);

  return (
    <ArticleLayout
      title="最新記事"
      posts={postsData.contents}
      categories={categoriesData.contents}
      currentPage={currentPage}
      totalPages={totalPages}
      basePath="/"
    />
  );
}