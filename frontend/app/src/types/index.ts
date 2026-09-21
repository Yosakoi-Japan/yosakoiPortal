export type EventListItem = {
  id: string
  title: string
  area: string
  description: string
  period: string
  startDate: string
  endDate: string
  latitude?: number
  longitude?: number
}

export type MapPlace = {
  name: string
  latitude: number
  longitude: number
}

export type EventDetail = {
  id: string
  title: string
  area: string
  description: string
  period: string
  startDate: string
  endDate: string
  teamCountText?: string
  nearestStation?: string
  parking?: string
  officialWebsite: string
  imageUrl?: string
  youtubeUrl?: string
  youtubeVideoId?: string
  latitude?: number
  longitude?: number
  mapUrl?: string
  venue: string
}

export type AwardWinnerVideo = {
  id: string
  eventId: string
  eventName: string
  awardName: string
  teamName: string
  resultSourceUrl: string
  videoUrl: string
  videoSourceType: string
  youtubeVideoId: string
  publishedAt: string
  expiresAt: string
}
