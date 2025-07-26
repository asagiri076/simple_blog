# Simple Blog

Next.js 15とmicroCMSを使用したシンプルなブログシステム

## ビルドコマンド

### 通常のビルド
```bash
npm run build
```
microCMSからデータを取得してビルドします。

### サンプルデータを使用したビルド
```bash
npm run sample-build
```
サンプルデータ（`sample-data/prebuilt.json`）を使用してビルドします。

### カスタムデータパスでのビルド
```bash
PREBUILT_DATA_PATH=/path/to/your/data.json npm run dev-build
```
環境変数`PREBUILT_DATA_PATH`で任意のJSONファイルを指定できます。

## 開発

```bash
npm run dev-build    # 開発用ビルド（microCMS取得なし）
npm run dev-server   # ビルド済みサイトのプレビュー
```
