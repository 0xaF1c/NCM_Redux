import { http } from "@/utils/request"

export const playlistTrackAll = (id: string | number) => {
  return http.get(`/playlist/track/all?id=${id}`)
}