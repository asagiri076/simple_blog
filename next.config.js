/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['images.microcms-assets.io'],
    unoptimized: true,
  },
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  
  // JavaScript最適化
  webpack: (config, { isServer }) => {
    // クライアントサイドバンドルの最適化
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Reactとその関連ライブラリを分離
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 20,
            },
            // その他のベンダーライブラリ
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }
    return config;
  },

  // 静的エクスポート用の最適化
  experimental: {
    // CSS最適化は手動で実装済み
    optimizePackageImports: ['react', 'react-dom'], // パッケージインポート最適化
  },

  // RSCペイロード最小化
  productionBrowserSourceMaps: false, // ソースマップ無効化
  poweredByHeader: false, // X-Powered-By ヘッダー削除

  // 不要な機能を無効化してバンドルサイズを削減
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // development時のデバッガーも削除（本番時）
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? {
      properties: ['^data-testid$']
    } : false,
  },
  
  // 静的サイトでは不要な機能を削減（リダイレクトはexport時非対応）

  // 実験的：RSCペイロード最小化とパフォーマンス向上
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
    // プリレンダリング時のペイロード最小化
    taint: true,
    // 静的サイトでは不要な機能を削減
    typedRoutes: false,
  },

  // サーバーサイドパッケージの外部化
  serverExternalPackages: [],
}

module.exports = nextConfig