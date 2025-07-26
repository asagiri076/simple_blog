'use client';

import { useEffect } from 'react';

// Type declaration for iframely
declare global {
  interface Window {
    iframely?: {
      load: () => void;
    };
  }
}

interface IframelyLoaderProps {
  content: string;
}

export default function IframelyLoader({ content }: IframelyLoaderProps) {
  useEffect(() => {
    if (content && content.includes('iframely-embed')) {
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
  }, [content]);

  return null; // This component doesn't render anything
}