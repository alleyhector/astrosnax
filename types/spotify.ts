export interface PlaylistProps {
  query?: string
  artist?: string
  genre?: string
}

export interface ExtendedPlaylistProps extends PlaylistProps {
  accessToken: string
}

export interface SpotifySearchResponse {
  tracks: CategoryResponse<TrackItem>
  artists: CategoryResponse<ArtistItem>
  albums: CategoryResponse<AlbumItem>
  playlists: CategoryResponse<PlaylistItem>
  shows: CategoryResponse<ShowItem>
  episodes: CategoryResponse<EpisodeItem>
  audiobooks: CategoryResponse<AudiobookItem>
}

export interface CategoryResponse<T> {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: T[]
}

export interface TrackItem {
  album: AlbumItem
  artists: ArtistItem[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: {
    isrc: string
    ean: string
    upc: string
  }
  external_urls: { spotify: string }
  href: string
  id: string
  is_playable: boolean
  linked_from?: {}
  restrictions?: { reason: string }
  name: string
  popularity: number
  preview_url: string | null
  track_number: number
  type: string
  uri: string
  is_local: boolean
}

export interface AlbumItem {
  album_type: string
  total_tracks: number
  available_markets: string[]
  external_urls: { spotify: string }
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  restrictions?: { reason: string }
  type: string
  uri: string
  artists: ArtistItem[]
}

export interface ArtistItem {
  external_urls: { spotify: string }
  followers?: { href: string | null; total: number }
  genres?: string[]
  href: string
  id: string
  images?: Image[]
  name: string
  popularity?: number
  type: string
  uri: string
}

export interface PlaylistItem {
  collaborative: boolean
  description: string
  external_urls: { spotify: string }
  href: string
  id: string
  images: Image[]
  name: string
  owner: {
    external_urls: { spotify: string }
    followers: { href: string | null; total: number }
    href: string
    id: string
    type: string
    uri: string
    display_name: string
  }
  public: boolean
  snapshot_id: string
  tracks: { href: string; total: number }
  type: string
  uri: string
}

export interface ShowItem {
  available_markets: string[]
  copyrights: { text: string; type: string }[]
  description: string
  html_description: string
  explicit: boolean
  external_urls: { spotify: string }
  href: string
  id: string
  images: Image[]
  is_externally_hosted: boolean
  languages: string[]
  media_type: string
  name: string
  publisher: string
  type: string
  uri: string
  total_episodes: number
}

export interface EpisodeItem {
  audio_preview_url: string
  description: string
  html_description: string
  duration_ms: number
  explicit: boolean
  external_urls: { spotify: string }
  href: string
  id: string
  images: Image[]
  is_externally_hosted: boolean
  is_playable: boolean
  language: string
  languages: string[]
  name: string
  release_date: string
  release_date_precision: string
  resume_point: { fully_played: boolean; resume_position_ms: number }
  type: string
  uri: string
  restrictions?: { reason: string }
}

export interface AudiobookItem {
  authors: { name: string }[]
  available_markets: string[]
  copyrights: { text: string; type: string }[]
  description: string
  html_description: string
  edition: string
  explicit: boolean
  external_urls: { spotify: string }
  href: string
  id: string
  images: Image[]
  languages: string[]
  media_type: string
  name: string
  narrators: { name: string }[]
  publisher: string
  type: string
  uri: string
  total_chapters: number
}

export interface Image {
  url: string
  height: number
  width: number
}
