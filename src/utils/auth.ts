import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()


export const NCM_USER_COOKIE_STORE_KEY = 'user_store_key'


export function isLoggedIn() {
  const storeData = localStorage.getItem(NCM_USER_COOKIE_STORE_KEY)  
  
  if (storeData === '' || storeData === null || cookies.keys().length < 0) {
    return false
  } else {
    if (cookies.keys().length < 0) {
      loginWithLocalStorage()
    }
    return true
  }
}

export function login(cookies: any) {
  if (cookies == '') {
    return
  }
  localStorage.setItem(NCM_USER_COOKIE_STORE_KEY, cookies)
  loginWithLocalStorage()
  setTimeout(() => location.reload(), 500)
}

export function loginWithLocalStorage() {
  const storeData = localStorage.getItem(NCM_USER_COOKIE_STORE_KEY)
  if (storeData !== null) {
    storeData.split(';;').map(cookie => {
      const filter = ["expires", "max-age", "path", "domain", "secure", "samesite", "httponly"]

      const parsed:any = []
      let i = 0

      cookie.split(';').map((row) => {
        const keyValue = row.split('=')
        
        const key: string = keyValue[0].trim();
        const value: string = (keyValue[1] ?? '').trim();
        if (!filter.includes(key.toLowerCase())) {          
          parsed.push({ key, value, options: {}})
          i++
        } else {
          parsed[i-1].options[key] = value
        }

      })
      // set: ( expireTimes, path, secure, sameSite)

      parsed.map((cookie: any) => {
        
        cookies.set(
          cookie.key,
          cookie.value,
          cookie.options['Expires'],
          cookie.options['Path'],
        )
      })
    });
  }
}

export function logout() {
  cookies.keys().forEach(key => cookies.remove(key))
  localStorage.removeItem(NCM_USER_COOKIE_STORE_KEY)
  setTimeout(() => location.reload(), 500)
}
