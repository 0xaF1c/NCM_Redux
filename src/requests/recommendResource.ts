import { http } from "@/utils/request"

export const recommendResource = () => {
  return http.get(`/recommend/resource`)
}