import { http } from "@/utils/request"

export const lyric = (id: string | number) => {
  return http.get('/lyric', {
    params: {
      id
    }
  })
}