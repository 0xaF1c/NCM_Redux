import { http } from "../utils/request"

export const banner = () => {
  return http.get(`/banner?type=0`)
}