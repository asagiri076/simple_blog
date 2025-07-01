import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchPosts, fetchCategories, fetchCategoriesWithPostCount } from '@/lib/microcms';
import ArticleLayout from '@/components/ArticleLayout';

interface PageProps {
  params: Promise<{ tagId: string; pageNum: string }>;
}

export default async function TagPaginatedPage({ params }: PageProps) {
  const { tagId, pageNum } = await params;
  const currentPage = parseInt(pageNum);
  
  // ページ番号の妥当性チェック
  if (!Number.isInteger(currentPage) || currentPage < 1) {
    notFound();
  }

  const limit = 10;
  const offset = (currentPage - 1) * limit;

  try {
    const [postsData, categoriesData] = await Promise.all([
      fetchPosts({ 
        limit,
        offset,
        orders: '-publishedAt',
        filters: `categories[contains]${tagId}`
      }),
      fetchCategoriesWithPostCount()
    ]);

    const currentCategory = categoriesData.find(cat => cat.id === tagId);
    
    if (!currentCategory) {
      notFound();
    }

    const totalPages = Math.ceil(postsData.totalCount / limit);

    // ページ番号が総ページ数を超えている場合は404
    if (currentPage > totalPages) {
      notFound();
    }

    return (
      <ArticleLayout
        title={currentCategory.name}
        subtitle="タグ"
        posts={postsData.contents}
        categories={categoriesData}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/tag/${tagId}/page`}
      />
    );
  } catch (error) {
    console.error('Error fetching tag paginated page data:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tagId, pageNum } = await params;
  const currentPage = parseInt(pageNum);

  try {
    const categoriesData = await fetchCategories();
    const currentCategory = categoriesData.contents.find(cat => cat.id === tagId);
    
    if (!currentCategory) {
      return {
        title: 'Tag Not Found | Simple Blog',
        description: 'The requested tag could not be found.',
      };
    }

    if (currentPage === 1) {
      return {
        title: `${currentCategory.name} | Simple Blog`,
        description: `Articles tagged with ${currentCategory.name}`,
        openGraph: {
          title: `${currentCategory.name} | Simple Blog`,
          description: `Articles tagged with ${currentCategory.name}`,
          type: 'website',
        },
      };
    }

    return {
      title: `${currentCategory.name} - Page ${currentPage} | Simple Blog`,
      description: `Page ${currentPage} of articles tagged with ${currentCategory.name}`,
      openGraph: {
        title: `${currentCategory.name} - Page ${currentPage} | Simple Blog`,
        description: `Page ${currentPage} of articles tagged with ${currentCategory.name}`,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Tag Not Found | Simple Blog',
      description: 'The requested tag could not be found.',
    };
  }
}

export async function generateStaticParams() {
  try {
    const categoriesData = await fetchCategories();
    const params = [];

    // 各カテゴリのページ数を計算
    for (const category of categoriesData.contents) {
      const postsData = await fetchPosts({
        limit: 1,
        filters: `categories[contains]${category.id}`
      });
      
      const totalPosts = postsData.totalCount;
      const limit = 10;
      const totalPages = Math.ceil(totalPosts / limit);

      // 各ページのパラメータを生成
      for (let page = 1; page <= totalPages; page++) {
        params.push({
          tagId: category.id,
          pageNum: page.toString()
        });
      }
    }

    console.log(`Generated ${params.length} paginated tag pages`);
    return params;
  } catch (error) {
    console.error('Error generating static params for tag pagination:', error);
    return [];
  }
}