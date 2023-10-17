
export type FormatTimerstampCallback = (
  h: number,
  m: number,
  s: number,
  ms: number
) => string

export function formatTimerstamp(t: number, cb: FormatTimerstampCallback | null) {
  const date = new Date(t)
  const h = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()


  if (cb != null) {
    return cb(h, m, s, date.getMilliseconds())
  } else {
    return `${h}:${m}:${s}`
  }
}