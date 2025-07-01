'use client';

import { useEffect, useState } from 'react';
import { optimizeImageUrl } from '@/lib/imageOptimizer';

interface OptimizedImageRendererProps {
  content: string;
}

export default function OptimizedImageRenderer({ content }: OptimizedImageRendererProps) {
  const [optimizedContent, setOptimizedContent] = useState<string>(content);

  useEffect(() => {
    const optimizeImages = () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const images = doc.querySelectorAll('img');
      
      if (images.length === 0) {
        setOptimizedContent(content);
        return;
      }

      let processedContent = content;

      images.forEach((img) => {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || '';
        const width = parseInt(img.getAttribute('width') || '0');
        const height = parseInt(img.getAttribute('height') || '0');

        if (src && src.includes('microcms-assets.io') && width && height) {
          // Simply convert to AVIF format with original dimensions
          const optimizedSrc = optimizeImageUrl(src, { 
            width, 
            height, 
            format: 'avif', 
            quality: 70 
          });
          
          // Create optimized image HTML with original dimensions
          const optimizedImageHtml = `
            <figure>
              <img
                src="${optimizedSrc}"
                alt="${alt}"
                width="${width}"
                height="${height}"
                class="rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </figure>
          `;

          // Replace the original img tag (including any wrapping figure)
          const figurePattern = new RegExp(
            `<figure[^>]*>\\s*${img.outerHTML.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*</figure>`,
            'gi'
          );
          
          if (figurePattern.test(processedContent)) {
            processedContent = processedContent.replace(figurePattern, optimizedImageHtml);
          } else {
            processedContent = processedContent.replace(
              img.outerHTML.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              optimizedImageHtml
            );
          }
        }
      });

      setOptimizedContent(processedContent);
    };

    optimizeImages();
  }, [content]);

  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: optimizedContent }}
      suppressHydrationWarning={true}
    />
  );
}