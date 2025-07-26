import ServerSideContentRenderer from './ServerSideContentRenderer';

interface CodeHighlighterProps {
  content: string;
}

/**
 * HTMLコンポーネントがない記事用のレンダラー
 * ServerSideContentRendererに処理を委譲
 */
export default function CodeHighlighter({ content }: CodeHighlighterProps) {
  return <ServerSideContentRenderer content={content} />;
}