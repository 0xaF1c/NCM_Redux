import { http } from "@/utils/request"

export const personalFm = () => {
  return http.get(`/personal_fm`)
}