'use client';

import { useEffect, useRef } from 'react';

// Prismコアのみインポート
import Prism from 'prismjs';

// 動的に言語を読み込む関数
const loadPrismLanguage = async (language: string): Promise<void> => {
  if (Prism.languages[language]) {
    return; // 既に読み込み済み
  }

  try {
    await import(`prismjs/components/prism-${language}`);
  } catch (error) {
    console.warn(`Failed to load Prism language: ${language}`, error);
  }
};

// コンテンツから使用されている言語を検出する関数
const detectLanguagesInContent = (content: string): string[] => {
  const languagePattern = /class="language-(\w+)"/g;
  const languages = new Set<string>();
  let match;

  while ((match = languagePattern.exec(content)) !== null) {
    languages.add(match[1]);
  }

  return Array.from(languages);
};

/**
 * Prism.jsのシンタックスハイライトを適用するカスタムフック
 * 必要な言語のみを動的に読み込む
 * @param content - ハイライト対象のコンテンツ
 */
export function usePrismHighlight(content: string) {
  const loadedLanguagesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const applyHighlighting = async () => {
      // コンテンツから使用されている言語を検出
      const detectedLanguages = detectLanguagesInContent(content);
      
      // 新しい言語のみを読み込む
      const languagesToLoad = detectedLanguages.filter(
        lang => !loadedLanguagesRef.current.has(lang)
      );

      if (languagesToLoad.length > 0) {
        // 言語を並列で読み込み
        await Promise.all(
          languagesToLoad.map(lang => loadPrismLanguage(lang))
        );

        // 読み込み済みとしてマーク
        languagesToLoad.forEach(lang => 
          loadedLanguagesRef.current.add(lang)
        );
      }

      // ハイライトを適用
      Prism.highlightAll();
    };

    if (content) {
      applyHighlighting();
    }
  }, [content]);
}