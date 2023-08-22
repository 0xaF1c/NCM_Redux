import { http } from "@/utils/request"

export const artistAlbum = (id: string | number) => {
  return http.get('/artist/album', {
    params: {
      id
    }
  })
}