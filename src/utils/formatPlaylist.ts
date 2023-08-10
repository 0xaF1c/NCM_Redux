import { Playlist, Song } from '@/types'

export function formatPlaylist(playlist: any): Playlist {
  return playlist.map((item: any): Song => {
    return {
      album: item.al,
      alias: item.alia,
      artists: item.ar,
      dt: item.dt,
      id: item.id,
      name: item.name,
      tns: item.tns,
    }
  })
}