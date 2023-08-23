import { http } from "@/utils/request"

export const searchSuggest = (keywords: string) => {
  return http.get('/search/suggest', {
    params: {
      keywords
    }
  })
}