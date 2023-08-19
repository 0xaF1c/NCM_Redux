import { http } from "@/utils/request"

export const recommendSongs = () => {
  return http.get(`/recommend/songs`)
}