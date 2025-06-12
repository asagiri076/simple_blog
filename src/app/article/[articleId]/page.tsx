import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { fetchPost, fetchPosts, fetchCategories } from '@/lib/microcms';
import Sidebar from '@/components/Sidebar';

// Next.js App RouterのPageProps型を利用
interface PageProps {
  params: Promise<{ articleId: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { articleId } = await params;

  try {
    const [post, categoriesData] = await Promise.all([
      fetchPost(articleId),
      fetchCategories()
    ]);

    return (
      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {post.eyecatch && (
              <div className="w-full h-64 relative">
                <Image
                  src={post.eyecatch.url || '/no-image.png'}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-8">
              <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-950 mb-4">
                  {post.title}
                </h1>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    {post.categories && post.categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/tag/${cat.id}`}
                        className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                  <time className="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                  </time>
                </div>
                
                {post.excerpt && (
                  <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-gray-200 pl-4">
                    {post.excerpt}
                  </p>
                )}
              </header>

              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.contents || '' }}
              />
            </div>
          </div>
        </article>
        
        <Sidebar categories={categoriesData.contents} postId={articleId} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching article:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { articleId } = await params;
  
  try {
    const post = await fetchPost(articleId);
    
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
    const postsData = await fetchPosts({ limit: 100 });
    return postsData.contents.map((post) => ({
      articleId: post.id,
    }));
  } catch (error) {
    console.error('Error generating static params for articles:', error);
    return [];
  }
}