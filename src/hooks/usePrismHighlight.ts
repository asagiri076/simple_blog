'use client';

import { useEffect } from 'react';

// 基本的なPrism.jsとよく使う言語をインポート
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';

/**
 * Prism.jsのシンタックスハイライトを適用するカスタムフック
 * @param content - ハイライト対象のコンテンツ
 */
export function usePrismHighlight(content: string) {
  useEffect(() => {
    // ページロード後にPrismハイライトを適用
    Prism.highlightAll();
  }, [content]);
}