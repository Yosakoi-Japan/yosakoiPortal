<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
  - Template Principle 1 -> I. クリーンコードと保守性
  - Template Principle 2 -> II. シンプルなUX
  - Template Principle 3 -> III. レスポンシブファースト
  - Template Principle 4 -> IV. テストコード非実装
  - Template Principle 5 -> V. 技術スタック統一
- Added sections:
  - 実装制約
  - 開発運用
- Removed sections:
  - なし
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md
  - ✅ updated: .specify/templates/spec-template.md
  - ✅ updated: .specify/templates/tasks-template.md
  - ⚠ pending: .specify/templates/commands/*.md (directory not present in this repository)
- Follow-up TODOs:
  - なし
-->
# yosakoiPortal Constitution

## Core Principles

### I. クリーンコードと保守性
本プロジェクトのコードは、可読性と保守性を最優先にして記述しなければならない。各ファイル、
コンポーネント、composable、utility は単一責務を保ち、命名は役割が即座に分かるものを使う。
重複実装、未使用コード、説明のない回避策、過度に密結合した実装を追加してはならない。
例外的な設計判断は、対象箇所の近くに短く理由を残すこと。理由: 将来の変更コストを下げ、
機能追加時の安全な修正を可能にするため。

### II. シンプルなUX
画面設計は、ユーザーの主要タスクを最短で完了できることを基準にしなければならない。主要導線は
明確に 1 つずつ示し、不要な入力、過剰な装飾、理解に時間がかかる UI パターンを避けること。
文言は簡潔にし、状態変化、エラー、完了結果は利用者が迷わない形で提示しなければならない。
理由: 機能が増えても利用負荷を上げず、継続利用しやすい体験を保つため。

### III. レスポンシブファースト
すべての新規 UI と改修 UI は、モバイルを起点に設計し、主要なスマートフォン幅、
タブレット幅、デスクトップ幅で破綻しないことを必須とする。横スクロール依存のレイアウト、
読めない文字サイズ、不十分なタップ領域、画面幅で意味が変わる操作は許可しない。各機能の
受け入れ条件には、少なくともモバイルとデスクトップの表示確認観点を含めなければならない。
理由: 利用環境の差で体験品質が劣化しないようにするため。

### IV. テストコード非実装
本プロジェクトでは、単体テスト、結合テスト、E2E テストを新規作成してはならない。テスト用
フレームワーク、モック基盤、CI 上の自動テスト前提の実装も追加してはならない。品質確認は、
仕様の受け入れ条件と手動検証手順で担保すること。自動テストが必要になった場合は、実装前に
constitution を改定し、例外ではなく方針変更として扱わなければならない。理由: 現時点の
開発方針と投入コストを一致させるため。

### V. 技術スタック統一
フロントエンド実装は Nuxt.js、TypeScript、Tailwind CSS を標準技術として採用しなければ
ならない。新規機能は既存の Nuxt 構成に従い、型安全性を損なう `any` や無根拠な型回避を避ける
こと。スタイルは Tailwind CSS を軸に実装し、別系統の CSS フレームワークや UI フレームワークを
追加してはならない。理由: 実装判断のばらつきを減らし、変更容易性と一貫した UI を保つため。

## 実装制約

- フロントエンドの作業対象は `frontend/app` を基準とし、Nuxt の `pages`、`components`、
  `composables`、`plugins` など既存構成に合わせて責務を分離すること。
- TypeScript の型を優先し、暗黙的なデータ構造や過度な型アサーションに依存しないこと。
- UI 実装では Tailwind CSS のユーティリティと既存スタイル資産を優先し、場当たり的な
  インラインスタイルや重複クラス設計を避けること。
- 仕様書、計画書、タスクでは「モバイル対応」「簡潔な操作導線」「手動検証」を明示すること。

## 開発運用

- `spec.md` ではユーザーシナリオと受け入れ条件を、複雑な試験設計ではなく利用者視点の
  検証観点として記述すること。
- `plan.md` の Constitution Check では、クリーンコード、シンプル UX、レスポンシブ対応、
  テストコード非実装、技術スタック統一の 5 点を必ず確認すること。
- `tasks.md` では自動テスト作成タスクを含めず、実装、UI 調整、手動確認、ドキュメント更新を
  中心に構成すること。
- 実装完了時には、主要ユーザーフローについてモバイルとデスクトップの手動確認項目を残すこと。

## Governance

この constitution は、本リポジトリの設計・実装・計画・レビューの判断基準に優先する。
改定は、変更理由、影響範囲、関連テンプレートの更新を含む明示的な constitution 更新として
行わなければならない。バージョニングは semantic versioning に従い、原則の削除や互換性の
ない再定義は MAJOR、新しい原則や必須運用の追加は MINOR、文言整理や意図の明確化は PATCH を
上げる。すべての plan、spec、tasks のレビューでは、本 constitution との整合性確認を必須とし、
不整合が見つかった場合は実装より先に文書を修正すること。

**Version**: 1.0.0 | **Ratified**: 2026-05-01 | **Last Amended**: 2026-05-01
