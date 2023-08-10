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
