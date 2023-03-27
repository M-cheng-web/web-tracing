import { DEVICE_KEY } from './constant'
import { getCookieByName, uuid } from './methods'

const { screen } = window
const { clientWidth, clientHeight } = document.documentElement
const { width, height, colorDepth, pixelDepth } = screen

let deviceId = getCookieByName(DEVICE_KEY)

if (!deviceId) {
  deviceId = `t_${uuid()}`
  document.cookie = `${DEVICE_KEY}=${deviceId};path=/;`
}

export default {
  clientHeight, // 网页可见区高度
  clientWidth, // 网页可见区宽度
  colorDepth, // 显示屏幕调色板的比特深度
  pixelDepth, // 显示屏幕的颜色分辨率
  deviceId, // id
  screenWidth: width, // 显示屏幕的宽度
  screenHeight: height, // 显示屏幕的高度
  vendor: navigator.vendor, // 浏览器名称
  platform: navigator.platform // 浏览器平台的环境,不是电脑系统的x64这样的(浏览器平台的环境可能是x32)
}
