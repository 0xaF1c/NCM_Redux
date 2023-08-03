import { http } from "@/utils/request"

export const getLikeMusic = (id: string) => {
  return http.get(`/likelist?uid=${id}&timerstamp=${Date.now()}`)
}