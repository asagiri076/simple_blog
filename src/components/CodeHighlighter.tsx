'use client';

import { usePrismHighlight } from '@/hooks/usePrismHighlight';

interface CodeHighlighterProps {
  content: string;
}

export default function CodeHighlighter({ content }: CodeHighlighterProps) {
  usePrismHighlight([content]);

  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning={true}
    />
  );
}