# 実装計画: イベントデータソース更新

**ブランチ**: `001-update-event-csv` | **日付**: 2026-05-02 | **仕様書**: [spec.md](/Users/collie/develop/yosakoiPortal/specs/001-update-event-csv/spec.md)
**入力**: `/specs/001-update-event-csv/spec.md` の feature specification

**注記**: この文書は `/speckit-plan` により生成された実装計画。

## 要約

旧イベントデータの import を `frontend/app/src/assets/data/yosakoi_event.csv` に置き換え、
英語ヘッダーの新スキーマを既存 Nuxt 画面へ対応させる。詳細ページは `event_id` で解決し、
各詳細ページに AI 収集データの注意書きを追加し、利用規約にも対応する免責文言を追記する。

## 技術コンテキスト

**言語/バージョン**: TypeScript + Nuxt 3.17  
**主要依存関係**: Nuxt 3.17、Tailwind CSS 3.4、PapaParse 5.5  
**データ保存**: `frontend/app/src/assets/data/` 配下の静的 CSV。クライアント側でメモリキャッシュを持つ  
**検証方法**: 手動確認のみ。unit / integration / E2E テストは追加しない  
**対象プラットフォーム**: レスポンシブ Web（モバイル / デスクトップ）  
**プロジェクト種別**: Nuxt Web アプリケーション  
**性能目標**: 数十件規模の CSV を初回クライアント parse しても、一覧・詳細の初期利用感を損なわない  
**制約**: シンプル UX、保守しやすいコード、モバイルファースト、自動テスト追加なし、新規 framework 追加なし  
**対象範囲**: 公開イベント一覧 1 ページ、詳細ルート 1 パターン、利用規約 1 ページ更新、単一 CSV 数十件規模

## Constitution Check

*GATE: Phase 0 の調査前に必ず通過し、Phase 1 設計後に再確認する。*

- Nuxt.js、TypeScript、Tailwind CSS の範囲内で実装し、競合 framework を追加しない。
- 主要操作は少ない手順で理解しやすく、迷いにくい UI を維持する。
- 計画にモバイルファーストの表示確認とデスクトップ確認が含まれている。
- 変更範囲を小さな責務単位に分け、保守しやすい構造を優先する。
- unit / integration / E2E テストは追加しない。

**ゲート状態**: PASS

## プロジェクト構成

### ドキュメント（この機能）

```text
specs/001-update-event-csv/
├── plan.md              # この実装計画
├── research.md          # Phase 0 の調査結果
├── data-model.md        # Phase 1 のデータ設計
├── quickstart.md        # Phase 1 の手動確認手順
├── contracts/           # Phase 1 の契約定義
└── tasks.md             # Phase 2 のタスク定義（/speckit-tasks で生成）
```

### ソースコード（リポジトリルート）

```text
frontend/app/
├── src/
│   ├── components/
│   ├── composables/
│   ├── pages/
│   ├── plugins/
│   ├── assets/
│   └── types/
├── public/
├── nuxt.config.ts
└── tailwind.config.js
```

**構成方針**: 既存の Nuxt アプリ `frontend/app` をそのまま使い、変更は最小責務単位の
モジュールに閉じ込める。主な修正対象は `src/composables/useRemote.ts`、
`src/types/index.ts`、`src/pages/index.vue`、`src/pages/event/[id].vue`、
`src/pages/terms.vue` である。

## 複雑性トラッキング

> **Constitution Check に違反があり、正当化が必要な場合のみ記入**

| 違反項目 | 必要理由 | より単純な代替案を採らない理由 |
|-----------|----------|------------------------------------|
| なし | 該当なし | 該当なし |
