'use client';

import { useEffect, useState } from 'react';
import { generateResponsiveImageSet } from '@/lib/imageOptimizer';

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

        if (src && src.includes('microcms-assets.io')) {
          // Generate optimized image set
          const imageSet = generateResponsiveImageSet(src, 'articleContent', 'webp');
          
          // Create a unique ID for this image
          const imageId = `img-${Math.random().toString(36).substring(2, 11)}`;
          
          // Calculate aspect ratio for responsive container
          const aspectRatio = width && height ? (height / width) * 100 : 56.25; // Default to 16:9
          
          // Create optimized image HTML
          const optimizedImageHtml = `
            <div class="relative w-full my-8" style="padding-bottom: ${aspectRatio}%;">
              <img
                id="${imageId}"
                src="${imageSet.src}"
                srcset="${imageSet.srcSet}"
                sizes="${imageSet.sizes}"
                alt="${alt}"
                class="absolute inset-0 w-full h-full object-cover rounded-lg"
                loading="lazy"
                decoding="async"
              />
            </div>
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