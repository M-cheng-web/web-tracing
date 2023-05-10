import { DEVICE_KEY, SDK_VERSION } from '../common'
import { _support, getGlobal } from '../utils/global'
import { load } from '../utils/fingerprintjs'
import { getCookieByName, uuid } from '../utils'
import { getSessionId } from '../utils/session'
import { options } from './options'

export class BaseInfo {
  base = {}
  pageId: string
  sdkUserUuid = ''
  private device: any

  constructor() {
    // 当前应用ID,在整个页面生命周期内不变,单页应用路由变化也不会改变,加载SDK时创建,且只创建一次
    this.pageId = uuid()
    this._initSdkUserUuid().then(() => {
      this._initDevice()
      this._initBase()
    })
  }
  private _initDevice() {
    const { screen } = getGlobal()
    const { clientWidth, clientHeight } = document.documentElement
    const { width, height, colorDepth, pixelDepth } = screen
    let deviceId = getCookieByName(DEVICE_KEY)
    if (!deviceId) {
      deviceId = `t_${uuid()}`
      document.cookie = `${DEVICE_KEY}=${deviceId};path=/;`
    }
    this.device = {
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
  }
  private _initBase() {
    // 与一般业务上理解的sessionId做区分,此session与业务无关,单纯就是浏览器端和后端直接的联系
    const sessionId = getSessionId()

    this.base = {
      // 基础数据
      ...this.device,
      sdkUserUuid: this.sdkUserUuid,
      ext: options.ext,
      appName: options.appName,
      appCode: options.appCode,
      pageId: this.pageId,
      sessionId,
      sdkVersion: SDK_VERSION
    }
  }
  private _initSdkUserUuid() {
    return load({})
      .then((fp: any) => fp.get())
      .then((result: any) => {
        const visitorId = result.visitorId
        this.sdkUserUuid = visitorId
      })
  }
}

export let baseInfo: BaseInfo

export function initBase() {
  baseInfo = new BaseInfo()
  _support.baseInfo = baseInfo
}
