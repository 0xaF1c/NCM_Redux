/**
 * https://blog.csdn.net/weixin_44109827/article/details/126397196
 */

export function formatSeconds(value) {
  if (isNaN(value)) {
    return '00:00'
  }
  let secondTime = parseInt(value);
  let minuteTime = 0;
  let hourTime = 0;
  if (secondTime >= 60) {
    minuteTime = parseInt(secondTime / 60);
    secondTime = parseInt(secondTime % 60);
    if (minuteTime >= 60) {
      hourTime = parseInt(minuteTime / 60);
      minuteTime = parseInt(minuteTime % 60);
    }
  }
  // 补0
  hourTime = hourTime < 10 ? "0" + hourTime : hourTime;
  minuteTime = minuteTime < 10 ? "0" + minuteTime : minuteTime;
  secondTime = secondTime < 10 ? "0" + secondTime : secondTime;
  let res = minuteTime + ":" + secondTime;
  return res;
}