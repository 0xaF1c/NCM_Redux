import { Options, useRequest } from "vue-request"
import { http } from "@/utils/request"

export const getUserStatus = () => {
  return http.get(`/login/status?timerstamp=${Date.now()}`)
}