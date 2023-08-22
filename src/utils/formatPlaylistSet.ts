import { PlaylistSet } from "@/types";

export function formatPlaylistSet(playlist: any): PlaylistSet {
  return playlist.map((item: any) => ({
    name: item.name,
    id: item.id,
    subscribed: item.subscribed,
    description: item.description,
    tags: item.tags,
    playCount: item.playCount,
    coverImgUrl: item.coverImgUrl,
  }))
}
export function formatPlaylistSetWithAlbum(playlist: any): PlaylistSet {
  return playlist.map((item: any) => ({
    name: item.name,
    id: item.id,
    subscribed: undefined,
    description: item.description,
    tags: item.tags,
    playCount: undefined,
    picUrl: item.picUrl,
  }))
}
export function formatPlaylistSetWithResources(playlist: any): PlaylistSet {
  return playlist.map((item: any) => ({
    name: item.name,
    id: item.id,
    subscribed: undefined,
    description: item.creator.description,
    tags: item.creator.expertTags,
    playCount: item.playcount,
    picUrl: item.picUrl,
  }))
}