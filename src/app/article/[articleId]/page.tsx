import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPostById, getAllPostsWithMeta, getCategoriesWithMeta } from '@/lib/data/prebuiltData';
import ArticleDetail from '@/components/article/detail/ArticleDetail';
import { siteConfig } from '@/lib/config/site';

// Next.js App RouterのPageProps型を利用
interface PageProps {
  params: Promise<{ articleId: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { articleId } = await params;

  try {
    const [post, categoriesData] = await Promise.all([
      getPostById(articleId),
      getCategoriesWithMeta()
    ]);

    if (!post) {
      notFound();
    }

    return (
      <ArticleDetail 
        post={post} 
        categories={categoriesData.contents} 
      />
    );
  } catch (error) {
    console.error('Error fetching article:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { articleId } = await params;
  
  try {
    const post = await getPostById(articleId);
    
    if (!post) {
      return {
        title: `Article Not Found | ${siteConfig.title}`,
        description: 'The requested article could not be found.',
      };
    }
    
    return {
      title: `${post.title} | ${siteConfig.title}`,
      description: post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        images: post.eyecatch ? [post.eyecatch.url] : [],
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.title,
        images: post.eyecatch ? [post.eyecatch.url] : [],
      },
    };
  } catch {
    return {
      title: `Article Not Found | ${siteConfig.title}`,
      description: 'The requested article could not be found.',
    };
  }
}

export async function generateStaticParams() {
  try {
    const postsData = await getAllPostsWithMeta();
    return postsData.contents.map((post) => ({
      articleId: post.id,
    }));
  } catch (error) {
    console.error('Error generating static params for articles:', error);
    return [];
  }
}