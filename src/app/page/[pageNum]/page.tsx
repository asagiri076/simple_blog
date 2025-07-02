import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllPosts, getCategoriesWithCount } from '@/lib/prebuiltData';
import ArticleLayout from '@/components/ArticleLayout';

interface PageProps {
  params: Promise<{ pageNum: string }>;
}

export default async function PaginatedHome({ params }: PageProps) {
  const { pageNum } = await params;
  const currentPage = parseInt(pageNum);
  
  // ページ番号の妥当性チェック
  if (!Number.isInteger(currentPage) || currentPage < 1) {
    notFound();
  }

  const limit = 10;
  const offset = (currentPage - 1) * limit;

  try {
    const [allPosts, categoriesData] = await Promise.all([
      getAllPosts(),
      getCategoriesWithCount()
    ]);

    const totalPages = Math.ceil(allPosts.length / limit);

    // ページ番号が総ページ数を超えている場合は404
    if (currentPage > totalPages) {
      notFound();
    }

    // ページングされた記事を取得
    const posts = allPosts.slice(offset, offset + limit);

    return (
      <ArticleLayout
        title="最新記事"
        posts={posts}
        categories={categoriesData}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/page"
      />
    );
  } catch (error) {
    console.error('Error fetching paginated home data:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pageNum } = await params;
  const currentPage = parseInt(pageNum);

  if (currentPage === 1) {
    return {
      title: 'Simple Blog',
      description: 'A simple blog built with Next.js and microCMS',
    };
  }

  return {
    title: `Page ${currentPage} | Simple Blog`,
    description: `Page ${currentPage} of blog posts`,
  };
}

export async function generateStaticParams() {
  try {
    // 全記事数を取得してページ数を計算
    const allPosts = await getAllPosts();
    const totalPosts = allPosts.length;
    const limit = 10;
    const totalPages = Math.ceil(totalPosts / limit);

    // 各ページのパラメータを生成
    const params = [];
    for (let page = 1; page <= totalPages; page++) {
      params.push({ pageNum: page.toString() });
    }

    console.log(`Generated ${totalPages} paginated pages for homepage`);
    return params;
  } catch (error) {
    console.error('Error generating static params for pagination:', error);
    return [];
  }
}