import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostsByCategory, getCategoriesWithCount, getCategories } from '@/lib/data/prebuiltData';
import ArticleLayout from '@/components/layout/ArticleLayout';

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
    const [categoryPosts, categoriesData] = await Promise.all([
      getPostsByCategory(tagId),
      getCategoriesWithCount()
    ]);

    const currentCategory = categoriesData.find(cat => cat.id === tagId);
    
    if (!currentCategory) {
      notFound();
    }

    const totalPages = Math.ceil(categoryPosts.length / limit);

    // ページ番号が総ページ数を超えている場合は404
    if (currentPage > totalPages) {
      notFound();
    }

    // ページングされた記事を取得
    const posts = categoryPosts.slice(offset, offset + limit);

    return (
      <ArticleLayout
        title={currentCategory.name}
        subtitle="タグ"
        posts={posts}
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
    const categoriesData = await getCategories();
    const currentCategory = categoriesData.find(cat => cat.id === tagId);
    
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
    const categoriesData = await getCategoriesWithCount();
    const params = [];
    const limit = 10;

    // 各カテゴリのページ数を計算
    for (const category of categoriesData) {
      const totalPages = Math.ceil(category.postCount / limit);

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