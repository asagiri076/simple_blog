'use client';

import { usePrismHighlight } from '@/hooks/usePrismHighlight';
import { useIframely } from '@/hooks/useIframely';

interface ClientSideContentRendererProps {
  content: string;
}

/**
 * クライアントサイドでのコンテンツ処理を実行
 * 1. Prismコードハイライト
 * 2. iframelyロード
 * 
 * 注意: ToC・広告処理はServerSideContentRendererで既に完了済み
 */
export default function ClientSideContentRenderer({ content }: ClientSideContentRendererProps) {
  // Prismコードハイライトを適用
  usePrismHighlight(content);
  
  // Iframelyを適用
  useIframely(content);

  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning={true}
    />
  );
}