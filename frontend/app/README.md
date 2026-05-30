## 開発向けドキュメント

### フロント起動手順

```
$ cd frontend/app
$ npm ci
$ npm run dev
```

### 画面アクセス

 local環境：http://localhost:4351/

### Cloudflare Pages SSR

Cloudflare Pages では以下の設定を使う。

| 設定項目 | 値 |
| --- | --- |
| Root directory | `frontend/app` |
| Build command | `npm run build:cloudflare` |
| Build output directory | `dist` |
| Node.js version | `22.16.0` |
| Compatibility date | `2025-05-15` |
| Environment variables | `GA_MEASUREMENT_ID` |

ローカルで Cloudflare Pages 用の成果物を確認する場合:

```
$ npm run build:cloudflare
$ npm run preview:cloudflare
```
