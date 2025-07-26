# Simple Blog

Next.js 15とmicroCMSを使用したシンプルなブログシステム

## 利用可能なコマンド

### 開発用コマンド

#### `npm run dev`
通常のNext.js開発サーバーを起動します。SSG構成のため一部でエラーが発生する場合がありますが、CSSやデザイン修正では使用可能です。

#### `npm run dev-build`
開発用ビルドを実行します。既存のJSONデータを使用してビルドし、開発用の設定（robots.txtでインデックス禁止など）を適用します。
```bash
npm run dev-build
```

#### `npm run dev-server`
ビルド済みの静的サイトをプレビューします。SSGビルドの動作確認に使用します。
```bash
npm run dev-server
```

### 本番ビルドコマンド

#### `npm run build`
本番用ビルドを実行します。最新のmicroCMSデータを取得してからビルドし、本番用の静的アセットを配置します。
```bash
npm run build
```

### データ管理コマンド

#### `npm run fetch-data`
microCMSから必要なデータを取得してJSONファイルに保存します。ビルド前にデータを事前取得することで、ビルド時間の短縮とトラブルシューティングを容易にします。
```bash
npm run fetch-data
```

#### `npm run setup-assets`
robots.txtやads.txtなどの静的アセットを配置します。環境変数に応じて適切なファイルを生成します。
```bash
npm run setup-assets
```

### その他

#### `npm run lint`
ESLintを実行してコードの品質をチェックします。
```bash
npm run lint
```

## 特殊な使用方法

### サンプルデータでのビルド
サンプルデータを使用してビルドする場合は、環境変数でデータパスを指定します：
```bash
PREBUILT_DATA_PATH=sample-data/prebuilt.json npm run dev-build
```

### カスタムデータでのビルド
任意のJSONファイルを使用してビルドする場合：
```bash
PREBUILT_DATA_PATH=/path/to/your/data.json npm run dev-build
```

## 環境変数

必要な環境変数は`.env.local`に設定してください：

### 必須の環境変数
- `MICROCMS_API_KEY` - microCMS APIキー
- `MICROCMS_DOMAIN` - microCMSサービスドメイン

### 任意の環境変数
- `NEXT_PUBLIC_GA_ID` - Google Analytics測定ID
- `NEXT_PUBLIC_ADSENSE_ID` - Google AdSense パブリッシャーID（ads.txt生成も兼用）
- `NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT` - 記事内AdSenseスロットID
- `NEXT_PUBLIC_ADSENSE_FOOTER_SLOT` - フッターAdSenseスロットID
- `NEXT_PUBLIC_SITE_TITLE` - サイトタイトル
- `NEXT_PUBLIC_DEBUG_MODE` - AdSenseテスト広告モード（本番環境でのテスト時のみ有効）

### .env.local サンプル
```env
# microCMS設定（必須）
MICROCMS_DOMAIN=your-service-id
MICROCMS_API_KEY=your-api-key-here

# Google Analytics（任意）
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google AdSense（任意）
NEXT_PUBLIC_ADSENSE_ID=ca-pub-1234567890123456
NEXT_PUBLIC_ADSENSE_ARTICLE_SLOT=1234567890
NEXT_PUBLIC_ADSENSE_FOOTER_SLOT=0987654321

# サイト設定（任意）
NEXT_PUBLIC_SITE_TITLE=マイブログ
NEXT_PUBLIC_DEBUG_MODE=false
```
