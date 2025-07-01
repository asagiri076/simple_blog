'use client';

import { usePrismHighlight } from '@/hooks/usePrismHighlight';
import OptimizedImageRenderer from './OptimizedImageRenderer';

interface CodeHighlighterProps {
  content: string;
}

export default function CodeHighlighter({ content }: CodeHighlighterProps) {
  usePrismHighlight([content]);

  return <OptimizedImageRenderer content={content} />;
}