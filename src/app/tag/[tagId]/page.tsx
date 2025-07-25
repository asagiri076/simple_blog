import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoriesWithMeta } from '@/lib/data/prebuiltData';
import { siteConfig } from '@/lib/config/site';

interface PageProps {
  params: Promise<{ tagId: string }>;
}

export default async function TagPage({ params }: PageProps) {
  const { tagId } = await params;
  // タグページは1ページ目にリダイレクト
  redirect(`/tag/${tagId}/page/1`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tagId } = await params;
  
  try {
    const categoriesData = await getCategoriesWithMeta();
    const currentCategory = categoriesData.contents.find(cat => cat.id === tagId);
    
    if (!currentCategory) {
      return {
        title: `Tag Not Found | ${siteConfig.title}`,
        description: 'The requested tag could not be found.',
      };
    }
    
    return {
      title: `${currentCategory.name} | ${siteConfig.title}`,
      description: `Articles tagged with ${currentCategory.name}`,
      openGraph: {
        title: `${currentCategory.name} | ${siteConfig.title}`,
        description: `Articles tagged with ${currentCategory.name}`,
        type: 'website',
      },
    };
  } catch {
    return {
      title: `Tag Not Found | ${siteConfig.title}`,
      description: 'The requested tag could not be found.',
    };
  }
}

export async function generateStaticParams() {
  try {
    const categoriesData = await getCategoriesWithMeta();
    return categoriesData.contents.map((category) => ({
      tagId: category.id,
    }));
  } catch (error) {
    console.error('Error generating static params for tags:', error);
    return [];
  }
}