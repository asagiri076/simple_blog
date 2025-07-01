'use client';

import { useState, useEffect } from 'react'
import { HtmlComponent } from '@/types/microcms'
import { usePrismHighlight } from '@/hooks/usePrismHighlight'
import { sanitizeComponentHtml } from '@/lib/sanitizer'
import ArticleContentRenderer from './ArticleContentRenderer'

interface HtmlComponentRendererProps {
  components: HtmlComponent[]
  content: string
}

export default function HtmlComponentRenderer({ components, content }: HtmlComponentRendererProps) {
  const [processedContent, setProcessedContent] = useState<string>(content)

  useEffect(() => {
    const processContent = async () => {
      let newContent = content

      // 各コンポーネントに対してspanを置き換え（外側のpタグも含めて）
      for (const component of components) {
        const spanPattern = new RegExp(
          `<p><span class="html_component_id">${component.component_id}</span></p>`,
          'g'
        )
        // HTMLコンポーネントをサニタイズしてから置換
        const sanitizedComponent = await sanitizeComponentHtml(component.component)
        newContent = newContent.replace(spanPattern, sanitizedComponent)
      }

      setProcessedContent(newContent)
    }

    processContent()
  }, [content, components])

  usePrismHighlight([processedContent, components]);

  return <ArticleContentRenderer content={processedContent} />
}