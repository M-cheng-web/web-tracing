import { isValidKey, getLocationHref } from '../utils'
import { debug } from '../utils/debug'
import { getElByAttr, isSimpleEl, getNodeXPath } from '../utils/element'
import { sendData } from './sendData'
import { eventBus } from './eventBus'
import { EVENTTYPES } from '../common'

class RequestTemplateClick {
  eventId = '' // 事件ID
  eventType = '' // 事件类型
  title = '' // 事件名
  url = '' // 当前页面URL
  x = -1 // 被点击元素与屏幕左边距离
  y = -1 // 被点击元素与屏幕上边距离
  params = {} // 事件参数
  elementPath = '' // 被点击元素的层级
  triggerTime = -1 // 事件发生时间
  constructor(config = {}) {
    Object.keys(config).forEach(key => {
      if (isValidKey(key, config)) {
        this[key] = config[key] || null
      }
    })
  }
}

/**
 * 监听 - 点击事件
 */
function clickCollection() {
  eventBus.addEvent({
    type: EVENTTYPES.CLICK,
    callback: (e: MouseEvent) => {
      const _config = new RequestTemplateClick({ eventType: 'click' })
      debug('caught click event: ', e)

      // 获取被点击的元素到最外层元素组成的数组
      const path: HTMLElement[] = e.composedPath()
        ? (e.composedPath() as HTMLElement[])
        : e.target
        ? getNodePath(e.target as HTMLElement)
        : []

      // 检查被点击的元素以及其父级元素是否有这些属性(从内到外)
      const target = path.find(
        el =>
          el.hasAttribute &&
          (el.hasAttribute('data-warden-container') ||
            el.hasAttribute('data-warden-event-id') ||
            el.hasAttribute('data-warden-title'))
      )

      if (!target) return

      const { scrollTop, scrollLeft } = document.documentElement // html距离上和左侧的距离(一般都是0)
      const { top, left } = (e.target as HTMLElement).getBoundingClientRect() // 元素距离html的距离
      _config.x = left + scrollLeft
      _config.y = top + scrollTop
      _config.triggerTime = Date.now() // 点击时间
      _config.url = getLocationHref() // 当前页面的url
      _config.title = extractTitleByTarget(target) // 获取title属性
      _config.eventId = extractDataByPath(path) // 提取数据事件ID
      _config.params = extractParamsByPath(path) // 提取数据参数
      _config.elementPath = getNodeXPath(target).slice(-128) // 长度限制128字符
      sendData.emit(_config)
    }
  })
}

/**
 * 获取目标元素到最外层元素组成的数组
 */
function getNodePath(
  node: HTMLElement,
  options = { includeSelf: true, order: 'asc' }
) {
  if (!node) return []
  const { includeSelf, order } = options
  let parent = includeSelf ? node : node.parentElement
  let result: HTMLElement[] = []
  while (parent) {
    result = order === 'asc' ? result.concat(parent) : [parent].concat(result)
    parent = parent.parentElement
  }
  return result
}

/**
 * 获取title属性(data-warden-title 或者 title)
 */
function extractTitleByTarget(target: HTMLElement) {
  const selfTitle = getNodeTitle(target)
  if (selfTitle) return selfTitle

  // 向上找其父节点
  let container = target.parentElement

  while (container && container !== document.body) {
    if (container.hasAttribute('data-warden-container')) break
    container = container.parentElement
  }
  const superTitle = getNodeTitle(container)
  if (superTitle) return superTitle

  // 自身以及父级都没有拿到 title 值的情况下
  const { tagName } = target
  return !target.hasChildNodes() || tagName.toLowerCase() === 'svg'
    ? handleLeafNode(target)
    : handleNoLeafNode(target)
}
/**
 * 获取元素的 data-warden-title 属性或者 title属性
 */
function getNodeTitle(node: HTMLElement | null) {
  if (node) {
    return node.hasAttribute('data-warden-title')
      ? node.getAttribute('data-warden-title')
      : node.title
  }
  return ''
}
/**
 * 获取 title - 叶子元素的情况下，取其特殊值
 * 叶子元素(也就是不包含其他HTML元素,也不能有文本内容)
 */
function handleLeafNode(target: any) {
  const { tagName, textContent } = target
  if (tagName === 'IMG') return target.getAttribute('alt') || null
  if (tagName === 'svg') {
    const a = [...Array(target.children)].find(item => item.tagName === 'use')
    if (a) return a.getAttribute('xlink:href') || null
  }
  return textContent
}
/**
 * 获取 title - 非叶子元素的情况
 */
function handleNoLeafNode(target: Element) {
  const { tagName, textContent } = target
  if (tagName === 'A') {
    const res = isSimpleEl([...Array.from(target.children)])
    return res ? textContent : target.getAttribute('href') || null
  }
  if (tagName === 'BUTTON') {
    const name = target.getAttribute('name')
    const res = isSimpleEl([...Array.from(target.children)])
    return name || res ? textContent : target.getAttribute('href') || null
  }
  const { length } = [...Array.from(target.children)].filter(() =>
    target.hasChildNodes()
  )
  return length > 0 ? null : textContent
}

/**
 * 提取数据事件ID
 */
function extractDataByPath(list: HTMLElement[] = []) {
  // data-warden-event-id
  const hasIdEl = getElByAttr(list, 'data-warden-event-id')
  if (hasIdEl) return hasIdEl.getAttribute('data-warden-event-id')!

  // title
  const hasTitleEl = getElByAttr(list, 'title')
  if (hasTitleEl) return hasTitleEl.getAttribute('title')!

  // container
  const container = getElByAttr(list, 'data-warden-container')
  if (container) {
    if (container.getAttribute('data-warden-event-id')) {
      return container.getAttribute('data-warden-event-id')!
    }
    if (container.getAttribute('title')) {
      return container.getAttribute('title')!
    }
    const id2 = container.getAttribute('data-warden-container')!
    if (typeof id2 === 'string' && id2) return id2
  }

  // 都没有则以 tagname 去当做ID
  return list[0].tagName.toLowerCase()
}

/**
 * 提取数据参数
 * 如果本身节点没有埋点属性的话会用父级埋点属性
 */
function extractParamsByPath(list: HTMLElement[] = []) {
  const regex = /^data-warden-/
  let target
  let targetIndex = -1

  // 遍历从子节点到body下最大的节点,遍历他们的属性,直到某个节点的属性能通过校验的节点
  for (let index = 0; index < list.length; index++) {
    const el = list[index]
    const attributes = (el && el.attributes && Array.from(el.attributes)) || []
    target = attributes.find(item =>
      item.nodeName.match(regex)
        ? item.nodeName.match(regex)
        : item.nodeName.indexOf('data-warden-container') !== -1
    )
    if (target) {
      targetIndex = index
      break
    }
  }
  if (targetIndex < 0) return {}

  const container = list[targetIndex]
  const attrList = Array.from(container.attributes) || []
  const params: Record<string, any> = {}
  const defaultKey = ['container', 'title', 'event-id']
  attrList.forEach(item => {
    if (item.nodeName.indexOf('data-warden') < 0) return // 过滤非标准命名 如 data-v-fbcf7454
    const key = item.nodeName.replace(regex, '')
    if (defaultKey.includes(key)) return // 过滤sdk自定义属性
    params[key] = item.nodeValue
  })

  return params
}

function initEvent() {
  // 注册点击事件
  clickCollection()
}

/**
 * 主动触发事件上报
 * @param eventId 事件ID
 * @param title 事件标题
 * @param params 自定义配置信息
 * @returns
 */
function handleSendEvent(eventId: string, title: string, params = {}) {
  sendData.emit({
    eventId,
    title,
    params,
    eventType: 'custom',
    triggerTime: Date.now()
  })
}

export { initEvent, handleSendEvent }
