import { http } from "@/utils/request"

export const like = (id: string | number, like: boolean) => {
  return http.get('/like', {
    params: {
      id,
      like,
      timerstamp: Date.now()
    }
  })
}