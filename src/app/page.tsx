/**
 * ルートページ (/) のリダイレクト処理
 * 
 * なぜNext.jsのredirect()を使わないのか：
 * - redirect()はNext.jsのクライアントサイドルーティングJSをバンドルに含める
 * - SSG + 静的エクスポートでバンドルサイズを最小化するため、純粋なHTMLリダイレクトを使用
 * - meta refreshとJavaScriptの二重保険でNext.js依存を排除
 * 
 * この実装により：
 * - バンドルサイズ削減（Next.jsルーター機能不要）
 * - ハイドレーション前の即座リダイレクト
 * - CDN/静的ホスティング完全対応
 */
export default function Home() {
  return (
    <html>
      <head>
        {/* HTML標準のリダイレクト（JavaScript無効環境対応） */}
        <meta httpEquiv="refresh" content="0;url=/page/1" />
        {/* JavaScript版リダイレクト（より確実・高速） */}
        <script dangerouslySetInnerHTML={{
          __html: "window.location.replace('/page/1')"
        }} />
      </head>
      <body>
        <p>リダイレクト中...</p>
        {/* 最終フォールバック（すべて失敗時の手動リンク） */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/page/1">こちらをクリックしてください</a>
      </body>
    </html>
  );
}