import { http } from "../utils/request"

export const personalized = () => {
  return http.get(`/personalized`)
}