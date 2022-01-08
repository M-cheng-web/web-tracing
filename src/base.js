import { uuid, sendBeacon, map, nextTime } from './util';
import { getSessionId, refreshSession } from './session';
import device from './device';

const settings = { debug: false, hashtag: false };

const MAX_CACHE_LEN = 5; // 最大缓存数
const MAX_WAITING_TIME = 5000; // 最大等待时间

// 当前应用ID,在整个页面生命周期内不变,单页应用路由变化也不会改变,加载SDK时创建,且只创建一次
const pageId = uuid();

// 与一般业务上理解的sessionId做区分,此session与业务无关,单纯就是浏览器端和后端直接的联系
const sessionId = getSessionId();

let requestUrl = process.env.REPORT_URL; // 服务请求地址

// 基本的全局属性
const base = {
  ...device, // 设备信息
  pageId,
  sessionId,
  sdkVersion: process.env.SDK_VERSION, // 版本号
};

let events = []; // 批次队列
let timer = null; // 定时发送定时器

/**
 * 输出信息
 */
export function debug(...args) {
  if (settings.debug) console.log(...args);
}

/**
 * 执行发送埋点信息(支持批次发送)
 */
function send() {
  if (events.length) {
    // 选取首部的部分数据来发送,performance会一次性采集大量数据追加到events中
    const sendEvents = events.slice(0, MAX_CACHE_LEN); // 需要发送的事件
    events = events.slice(MAX_CACHE_LEN); // 剩下待发的事件
    debug('send events', sendEvents);

    const time = Date.now();
    sendBeacon(requestUrl, {
      baseInfo: { ...base, sendTime: time },
      eventInfo: map(sendEvents, (e) => {
        e.sendTime = time; // 设置发送时间

        // 补充type字段,将click、scroll、change、submit事件作为一类存储
        if (e.eventType === 'click' || e.eventType === 'scroll' || e.eventType === 'submit' || e.eventType === 'change') {
          e.type = 'mix';
          return e;
        }

        if (e.eventType === 'performance') {
          // 将性能进行分类,不同类型的性能数据差异较大,分开存放,资源、页面、请求
          switch (e.eventId) {
            case 'resource':
              e.type = 'resourcePerformance';
              break;
            case 'page':
              e.type = 'pagePerformance';
              break;
            case 'server':
              e.type = 'serverPerformance';
              break;
            default:
              break;
          }
          return e;
        }

        e.type = e.eventType; // 其他类型type同eventType
        return e;
      }),
    });

    if (events.length) nextTime(send); // 继续传输剩余内容,在下一个时间择机传输
  }
}

export { pageId };

/**
 * 记录需要发送的埋点数据
 */
export function emit(e, flush = false) {
  events = events.concat(e); // 追加到事件队列里
  refreshSession();
  debug('receive event, waiting to send', e);
  clearTimeout(timer);

  // 满足最大记录数,立即发送,否则定时发送(flush为true代表立即发送)
  events.length >= MAX_CACHE_LEN || flush
    ? send()
    : timer = setTimeout(() => { send(); }, MAX_WAITING_TIME);
}

/**
 * 初始化方法
 */
export function init(options = {}) {
  const {
    requestUrl: _requestUrl,
    appName,
    appCode,
    appVersion,
    ext,
    ...opts
  } = options;
  requestUrl = _requestUrl;
  base.appName = appName;
  base.appCode = appCode;
  base.ext = ext;
  Object.assign(settings, opts);
}

/**
 * 获取配置信息
 */
export function getSetting() {
  return settings;
}
/**
 * 设置额外的 customerId
 * 在触发埋点时会将这个参数带给后端
 */
export function setCustomerId(id) {
  base.customerId = id;
}
/**
 * 设置额外的 userUuid
 * 在触发埋点时会将这个参数带给后端
 */
export function setUserUuid(id) {
  base.userUuid = id;
}

export default {
  init,
  emit,
  getSetting,
  setCustomerId,
  setUserUuid,
  pageId,
};
