import { fetchPosts, fetchCategories } from '@/lib/microcms';
import Sidebar from '@/components/Sidebar';
import ArticleList from '@/components/ArticleList';
import Pagination from '@/components/Pagination';

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
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-950 mb-6">最新記事</h1>
        <ArticleList posts={postsData.contents} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/"
        />
      </div>
      <Sidebar categories={categoriesData.contents} />
    </div>
  );
}