import { http } from "../utils/request"

export const getUserStatus = () => {
  return http.get(`/login/status?timerstamp=${Date.now()}`)
}