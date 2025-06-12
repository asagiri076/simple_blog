import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-96 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-950 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          トップページに戻る
        </Link>
      </div>
    </div>
  );
}