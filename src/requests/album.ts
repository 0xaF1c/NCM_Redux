import { http } from "@/utils/request"

export const album = (id: string | number) => {
  return http.get('/album', {
    params: {
      id
    }
  })
}