'use client';

import { usePrismHighlight } from '@/hooks/usePrismHighlight';
import ArticleContentRenderer from './ArticleContentRenderer';

interface CodeHighlighterProps {
  content: string;
}

export default function CodeHighlighter({ content }: CodeHighlighterProps) {
  usePrismHighlight([content]);

  return <ArticleContentRenderer content={content} />;
}