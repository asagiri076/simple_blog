import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllPostsWithMeta, getCategoriesWithMeta, getPostByWpId, getPostById } from '@/lib/data/prebuiltData';
import { getArticleId, extractYearMonth, parseArticleIdType } from '@/lib/utils/articleUrl';
import ArticleDetail from '@/components/article/ArticleDetail';

// Next.js App RouterのPageProps型を利用
interface PageProps {
  params: Promise<{ year: string; month: string; articleId: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { year, month, articleId } = await params;

  try {
    // IDタイプを判定して適切なfetch関数を使用
    const idType = parseArticleIdType(articleId);
    const [post, categoriesData] = await Promise.all([
      idType === 'wp_id' ? getPostByWpId(parseInt(articleId)) : getPostById(articleId),
      getCategoriesWithMeta()
    ]);

    if (!post) {
      notFound();
    }

    // URLの年月と記事の公開日が一致するかチェック
    const postYearMonth = extractYearMonth(post.publishedAt);
    if (postYearMonth.year !== year || postYearMonth.month !== month) {
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
  const { year, month, articleId } = await params;
  
  try {
    // IDタイプを判定して適切なfetch関数を使用
    const idType = parseArticleIdType(articleId);
    const post = await (idType === 'wp_id' ? getPostByWpId(parseInt(articleId)) : getPostById(articleId));

    if (!post) {
      return {
        title: 'Article Not Found | Simple Blog',
        description: 'The requested article could not be found.',
      };
    }

    // URLの年月と記事の公開日が一致するかチェック
    const postYearMonth = extractYearMonth(post.publishedAt);
    if (postYearMonth.year !== year || postYearMonth.month !== month) {
      return {
        title: 'Article Not Found | Simple Blog',
        description: 'The requested article could not be found.',
      };
    }
    
    return {
      title: `${post.title} | Simple Blog`,
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
      title: 'Article Not Found | Simple Blog',
      description: 'The requested article could not be found.',
    };
  }
}

export async function generateStaticParams() {
  try {
    const postsData = await getAllPostsWithMeta();
    return postsData.contents.map((post) => {
      const { year, month } = extractYearMonth(post.publishedAt);
      const articleId = getArticleId(post);
      return {
        year,
        month,
        articleId,
      };
    });
  } catch (error) {
    console.error('Error generating static params for articles:', error);
    return [];
  }
}