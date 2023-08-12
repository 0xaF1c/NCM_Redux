import { PlaylistMatadata, Song } from '@/types'

export function formatPlaylistMatadata(playlistMatadata: any): PlaylistMatadata {
  const {
    id,
    name,
    coverImgUrl,
    userId,
    createTime,
    playCount,
    trackCount,
    tags,
    description
  } = playlistMatadata.playlist
  return {
    id,
    name,
    coverImgUrl,
    userId,
    createTime,
    playCount,
    trackCount,
    tags,
    description
  }
}