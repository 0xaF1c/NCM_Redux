import { http } from "../utils/request"

export const getUserPlaylist = (id: string | number) => {
  return http.get(`/user/playlist?uid=${id}`)
}