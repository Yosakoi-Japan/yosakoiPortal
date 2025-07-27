// TODO: 実際のデータは後ほど決定する（ここに記載なのは理想論）
// 型定義ファイル
// 一覧表示用のイベント型
export type EventListItem = {
  id: string
  title: string
  area: string
  startDate: string
  endDate: string
  description: string
}

// 詳細表示用のイベント型
export type EventDetail = {
  id: string
  title: string
  area: string
  startDate: string
  endDate: string
  description: string
  teamCount?: number
  nearestStation?: string
  parking?: string
  contact?: {
    organization: string
    phoneNumber: string
  }
  additionalInfo?: string
  officialWebsite?: string
  latitude?: number
  longitude?: number
  venue?: string
  youtubeVideoId?: string
}
