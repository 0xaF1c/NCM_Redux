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
  tns: [] // 译名
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