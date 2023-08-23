import { http } from "@/utils/request"

export const searchDefault = () => {
  return http.get('/search/default')
}