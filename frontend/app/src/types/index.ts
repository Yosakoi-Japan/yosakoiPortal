// 型定義ファイル
export type Event = {
  id: string
  title: string
  area: string
  startDate: string
  endDate: string
  description: string
  teamCount?: number
  nearestStation?: string
  parking?: string
  contact?: string
  additionalInfo?: string
}
