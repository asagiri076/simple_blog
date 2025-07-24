import { HtmlComponent } from '@/types/microcms'
import ServerSideContentRenderer from './ServerSideContentRenderer'

interface HtmlComponentRendererProps {
  components: HtmlComponent[]
  content: string
}

/**
 * HTMLコンポーネントがある記事用のレンダラー
 * ServerSideContentRendererに処理を委譲
 */
export default function HtmlComponentRenderer({ components, content }: HtmlComponentRendererProps) {
  return <ServerSideContentRenderer content={content} components={components} />
}