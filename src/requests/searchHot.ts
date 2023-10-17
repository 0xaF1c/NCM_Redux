import { http } from "../utils/request"

export const searchHot = () => {
  return http.get('/search/hot')
}