export type Artist = {
  id: number
  name: string
  alias: Array<string> // 别名
  tns: Array<string> // 译名
}
export type Album = {
  id: number
  name: string
  picUrl: string
  tns: Array<string> // 译名
}
export type Song = {
  id: number
  name: string // 歌曲原名
  alias: Array<string> // 别名
  tns: Array<string> // 译名
  dt: number
  artists: Array<Artist>
  album: Album
}
export type Playlist = Array<Song>

export type PlaylistItem = {
  name: string
  id: number
  subscribed: string // 订阅状态 true表示订阅的 false表示自己的
  description: string
  tags: Array<string>
  playCount: number
  coverImgUrl: string
}

export type PlaylistMatadata = {
  id: number
  name: string
  coverImgUrl: string
  userId: number
  createTime: number
  playCount: number // 播放数
  trackCount: number // 歌曲数
  tags: Array<string>
  description: string
}

export type PlaylistSet = Array<PlaylistItem>