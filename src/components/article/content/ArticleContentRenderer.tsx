import { optimizeImagesInContent } from '@/lib/content/imageOptimizer';
import IframelyLoader from './IframelyLoader';

interface ArticleContentRendererProps {
  content: string;
}

export default function ArticleContentRenderer({ content }: ArticleContentRendererProps) {
  // サーバーサイドで画像最適化を実行
  const optimizedContent = optimizeImagesInContent(content);

  return (
    <>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: optimizedContent }}
        suppressHydrationWarning={true}
      />
      <IframelyLoader content={optimizedContent} />
    </>
  );
}