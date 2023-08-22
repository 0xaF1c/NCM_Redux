import { http } from "@/utils/request"

export const artistDetail = (id: string | number) => {
  return http.get('/artist/detail', {
    params: {
      id
    }
  })
}