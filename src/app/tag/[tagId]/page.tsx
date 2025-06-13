import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchPosts, fetchCategories, fetchCategoriesWithPostCount } from '@/lib/microcms';
import ArticleLayout from '@/components/ArticleLayout';

// Next.js App RouterのPageProps型を利用
interface PageProps {
  params: Promise<{ tagId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { tagId } = await params;
  const sp = await searchParams;
  const currentPage = Number(sp.page) || 1;
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

    return (
      <ArticleLayout
        title={currentCategory.name}
        subtitle="タグ"
        posts={postsData.contents}
        categories={categoriesData}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/tag/${tagId}`}
      />
    );
  } catch (error) {
    console.error('Error fetching tag page data:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tagId } = await params;
  
  try {
    const categoriesData = await fetchCategories();
    const currentCategory = categoriesData.contents.find(cat => cat.id === tagId);
    
    if (!currentCategory) {
      return {
        title: 'Tag Not Found | Simple Blog',
        description: 'The requested tag could not be found.',
      };
    }
    
    return {
      title: `${currentCategory.name} | Simple Blog`,
      description: `Articles tagged with ${currentCategory.name}`,
      openGraph: {
        title: `${currentCategory.name} | Simple Blog`,
        description: `Articles tagged with ${currentCategory.name}`,
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
    return categoriesData.contents.map((category) => ({
      tagId: category.id,
    }));
  } catch (error) {
    console.error('Error generating static params for tags:', error);
    return [];
  }
}