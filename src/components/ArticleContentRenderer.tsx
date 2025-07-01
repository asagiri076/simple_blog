'use client';

import { useEffect, useState } from 'react';
import { optimizeImageUrl } from '@/lib/imageOptimizer';

// Type declaration for iframely
declare global {
  interface Window {
    iframely?: {
      load: () => void;
    };
  }
}

interface ArticleContentRendererProps {
  content: string;
}

export default function ArticleContentRenderer({ content }: ArticleContentRendererProps) {
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

      // Remove duplicate iframely script tags from content since we load it globally
      processedContent = processedContent.replace(
        /<script[^>]*src="https:\/\/cdn\.iframe\.ly\/embed\.js"[^>]*><\/script>/gi,
        ''
      );

      setOptimizedContent(processedContent);
    };

    optimizeImages();
  }, [content]);

  // Handle iframely loading after content is rendered
  useEffect(() => {
    if (optimizedContent && optimizedContent.includes('iframely-embed')) {
      const loadIframely = () => {
        if (typeof window !== 'undefined' && window.iframely) {
          try {
            window.iframely.load();
          } catch (error) {
            console.warn('Failed to load iframely:', error);
          }
        } else {
          // Retry after a short delay if iframely is not loaded yet
          setTimeout(loadIframely, 100);
        }
      };

      // Wait for next tick to ensure DOM is updated
      setTimeout(loadIframely, 0);
    }
  }, [optimizedContent]);

  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: optimizedContent }}
      suppressHydrationWarning={true}
    />
  );
}