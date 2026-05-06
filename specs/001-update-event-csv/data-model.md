# データモデル: イベントデータソース更新

## 概要

この機能では、旧イベントデータセットを `yosakoi_event.csv` に置き換え、アプリケーション側の
データモデルを新しいヘッダー構成に合わせる。`event_id`、`event_name`、`Status`、
`official_url`、`start_date`、`end_date`、`location`、`description`、`youtube_url`、
`latitude`、`longitude`、`map_url`、`updated_at` を必須項目とし、それ以外を任意項目として扱う。
`note` カラムは削除予定のため参照しない。

## エンティティ: RawEventCsvRow

`frontend/app/src/assets/data/yosakoi_event.csv` を 1 行分 parse した生データ。

### フィールド

| 項目 | 型 | 必須 | 備考 |
|------|------|------|------|
| `event_id` | string | はい | ルーティングと検索の正規識別子 |
| `event_name` | string | はい | 一覧・詳細で表示する名称 |
| `Status` | string | はい | 公開状態や承認状態 |
| `image_url` | string | いいえ | 任意の画像 URL |
| `official_url` | string | はい | 詳細ページで示す公式情報 URL |
| `start_date` | string | はい | 開始日。`yyyy-mm-dd` 形式 |
| `end_date` | string | はい | 終了日。`yyyy-mm-dd` 形式 |
| `location` | string | はい | 人が読む開催地表記 |
| `team_count` | string | いいえ | 範囲や文章を含みうる参加チーム数表記 |
| `nearest_station` | string | いいえ | 最寄り駅案内 |
| `parking_info` | string | いいえ | 駐車場やアクセス補足 |
| `description` | string | はい | イベント概要 |
| `youtube_url` | string | はい | 動画 URL またはチャンネル URL |
| `latitude` | string | はい | 緯度の元データ |
| `longitude` | string | はい | 経度の元データ |
| `map_url` | string | はい | 地図遷移先 URL |
| `updated_at` | string | はい | 元データ更新日。内部管理用 |

### バリデーションルール

- `event_id`、`event_name`、`Status`、`official_url`、`start_date`、`end_date`、`location`、
  `description`、`youtube_url`、`latitude`、`longitude`、`map_url`、`updated_at` のいずれかが欠ける行は不正とみなし、表示対象から除外する。
- 任意項目が空の場合は、アプリ側 view model では未設定のまま扱う。
- `start_date` と `end_date` は `yyyy-mm-dd` 形式であること。
- 緯度と経度は、両方とも数値として解釈できること。
- `team_count` は、明示的に数値要約へ変換する設計を採らない限り、表示用文字列として扱う。
- `note` は参照対象に含めない。

## エンティティ: EventRecord

一覧と詳細の描画に使う、正規化済みのイベントオブジェクト。

### フィールド

| 項目 | 型 | 必須 | 変換元 |
|------|------|------|------|
| `id` | string | はい | `event_id` |
| `title` | string | はい | `event_name` |
| `officialWebsite` | string | はい | `official_url` |
| `period` | string | はい | `start_date` と `end_date` から生成 |
| `area` | string | はい | `location` |
| `description` | string | はい | `description` |
| `status` | string | はい | `Status` |
| `imageUrl` | string | いいえ | `image_url` |
| `teamCountText` | string | いいえ | `team_count` |
| `nearestStation` | string | いいえ | `nearest_station` |
| `parking` | string | いいえ | `parking_info` |
| `youtubeUrl` | string | はい | `youtube_url` |
| `youtubeVideoId` | string | いいえ | `youtube_url` から埋め込み可能時のみ抽出 |
| `latitude` | number | はい | `latitude` を数値化 |
| `longitude` | number | はい | `longitude` を数値化 |
| `mapUrl` | string | はい | `map_url` |
| `updatedAt` | string | はい | `updated_at` |

### 導出ルール

- `period` は `start_date` と `end_date` が同じ場合は単日表記、異なる場合は期間表記とする。
- `mapUrl` は CSV 上の必須値をそのまま使う。
- `youtubeVideoId` は、安全に埋め込み可能な URL と判定できたときだけ設定する。
- `updatedAt` は内部管理用に保持し、利用者向け画面表示には使わない。

## エンティティ: EventListItem

トップページのカード一覧に使う部分集合。

### フィールド

| 項目 | 型 | 必須 |
|------|------|------|
| `id` | string | はい |
| `title` | string | はい |
| `area` | string | はい |
| `description` | string | はい |
| `period` | string | はい |

## エンティティ: DetailDisclaimer

各イベント詳細ページに表示する固定の注意文。

### フィールド

| 項目 | 型 | 必須 | 備考 |
|------|------|------|------|
| `message` | string | はい | AI 収集データに誤りがありうることを示す |
| `actionLabel` | string | はい | 公式ページ確認を促す文言 |

## エンティティ: TermsDisclaimer

利用規約ページに追記する固定の免責文言。

### フィールド

| 項目 | 型 | 必須 | 備考 |
|------|------|------|------|
| `accuracyNotice` | string | はい | データ誤りの可能性を示す |
| `liabilityNotice` | string | はい | 損失責任を負わないことを示す |

## 関係

- 1 つの `RawEventCsvRow` は、0 件または 1 件の `EventRecord` になる。
- 1 つの `EventRecord` から、1 つの `EventListItem` を作る。
- 1 つの `EventRecord` は `/event/{event_id}` という 1 つのルートで参照される。
- 1 つの `DetailDisclaimer` は、すべての `EventRecord` 詳細画面で表示される。

## 状態メモ

- データセット行の状態は実質的に `valid` または `excluded` のどちらか。
- 詳細ルートの解決結果は `loaded` または `not found` のどちらか。
- 任意の補足項目は、`image_url`、`team_count`、`nearest_station`、`parking_info` に限る。
