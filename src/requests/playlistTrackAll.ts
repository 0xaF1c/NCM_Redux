import { http } from "../utils/request"

export const playlistTrackAll = (id: string | number, limit?: number, offset?: number) => {
  return http.get('/playlist/track/all', {
    params: {
      id,
      limit,
      offset,
      timerstamp: Date.now()
    }
  })
}