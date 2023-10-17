import { http } from "../utils/request"

export const recordRecentSong = () => {
  return http.get('/record/recent/song')
}