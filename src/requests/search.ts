import { http } from "@/utils/request"

export const search = (keywords: string, type: number) => {
  return http.get('/cloudsearch', {
    params: {
      keywords,
      type
    }
  })
}