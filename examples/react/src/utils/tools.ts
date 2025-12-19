
export function formatDate(timestamp: number) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1)
  const day = padZero(date.getDate())
  const hour = padZero(date.getHours())
  const minute = padZero(date.getMinutes())
  const second = padZero(date.getSeconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function padZero(num: any) {
  return num.toString().padStart(2, '0')
}
