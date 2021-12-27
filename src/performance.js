import { emit } from './base';

// 兼容判断
const supported = {
  performance: !!window.performance,
  getEntriesByType: !!(window.performance && performance.getEntriesByType),
  PerformanceObserver: 'PerformanceObserver' in window,
  MutationObserver: 'MutationObserver' in window,
  PerformanceNavigationTiming: 'PerformanceNavigationTiming' in window,
};

// 资源属性
const performanceEntryAttrs = {
  initiatorType: '',
  transferSize: 0,
  encodedBodySize: 0,
  decodedBodySize: 0,
  duration: 0,
  redirectStart: 0,
  redirectEnd: 0,
  startTime: 0,
  fetchStart: 0,
  domainLookupStart: 0,
  domainLookupEnd: 0,
  connectStart: 0,
  connectEnd: 0,
  requestStart: 0,
  responseStart: 0,
  responseEnd: 0,
  workerStart: 0,
};

/**
 * 格式化性能记录,小数位数保留最多两位,等于0的字段不传输,标记为undefined
 */
function normalizePerformanceRecord(e) {
  Object.keys(e).forEach((p) => {
    const v = e[p];
    if (typeof v === 'number') e[p] = v === 0 ? undefined : parseFloat(v.toFixed(2));
  });
  return e;
}

/**
 * 发送页面追踪资源加载性能数据
 * 支持getEntriesByType的情况下才追踪
 */
function traceResourcePerformance(performance) {
  // 排除xmlhttprequest类型,服务器有响应便会记录,包括404的请求,转由http-request模块负责记录请求数据,区分请求状态
  // 同时也会排除一些其他类型,比如在引入一个script后会触发一次性能监控,它的类型是beacon,这一次的要排除
  const observerTypeList = ['img', 'script', 'link', 'audio', 'video', 'css'];
  const entries = performance.getEntriesByType('resource');
  const records = [];

  entries.forEach((entry) => {
    const { initiatorType = '' } = entry; // initiatorType: 通过某种方式请求的资源,比如script,link

    // 只记录observerTypeList中列出的资源类型请求,不在列表中则跳过
    if (observerTypeList.indexOf(initiatorType.toLowerCase()) < 0) return;

    const value = {};
    const attrKeys = Object.keys(performanceEntryAttrs);
    attrKeys.forEach((attr) => { value[attr] = entry[attr] });

    records.push(normalizePerformanceRecord({
      ...value,
      eventType: 'performance',
      eventId: 'resource',
      src: entry.name,
      triggerTime: `${Date.now()}`, // 非绝对精确,以拿到performance对象的时间来近似计算
      url: window.location.href,
    }));
  });
  if (records.length) emit(records);
  return records;
}

/**
 * 监听异步资源加载信息
 */
function observeAsyncInfo() {
  const observer = new PerformanceObserver(traceResourcePerformance);
  observer.observe({ entryTypes: ['resource'] });
}

/**
 * 监听异步插入的script、link、img,DOM更新操作记录
 */
function observeSourceInsert() {
  console.log('observeSourceInsert');
  const tags = ['img', 'script', 'link'];
  // 检测异步插入的script、link、img,会有一些延迟,一些连接建立、包体大小的数据会丢失,精度下降
  // MutationObserver DOM3 Events规范,是个异步监听,只有在全部DOM操作完成之后才会调用callback
  const observer = new MutationObserver((mutationsList) => {
    console.log('mutationsList', mutationsList);
    for (let i = 0; i < mutationsList.length; i += 1) {
      const startTime = Date.now();
      const { addedNodes = [] } = mutationsList[i];
      const records = [];
      addedNodes.forEach((node) => {
        const { nodeName } = node;
        if (tags.indexOf(nodeName.toLowerCase()) !== -1) {
          node.addEventListener('load', () => {
            const endTime = Date.now();
            records.push(normalizePerformanceRecord({ // 没有其他的时间属性,只记录能获取到的
              eventType: 'performance',
              eventId: 'resource',
              src: node.src || node.href,
              duration: endTime - startTime,
              triggerTime: `${Date.now()}`,
              url: window.location.href,
            }));
          });
        }
      });
      emit(records);
    }
  });
  observer.observe(window.document, {
    subtree: true, // 目标以及目标的后代改变都会观察
    childList: true, // 表示观察目标子节点的变化，比如添加或者删除目标子节点，不包括修改子节点以及子节点后代的变化
    // attributes: true, // 观察属性变动
    // attributeFilter: ['src', 'href'], // 要观察的属性
  });
  // observer.disconnect();
}

/**
 * 兼容-异步资源
 */
function observeAsyncResource() {
  if (supported.PerformanceObserver) {
    observeAsyncInfo(); // 监听异步资源加载性能数据 chrome≥52
  } else if (supported.MutationObserver) {
    observeSourceInsert(); // 监听资源、DOM更新操作记录 chrome≥26 ie11
  }
}

/**
 * 页面资源加载性能数据
 */
function observeResource() {
  traceResourcePerformance(window.performance);
  observeAsyncResource();
}

/**
 * 发送首次页面性能数据
 */
function observeNavigationTiming() {
  const times = {};
  const { performance } = window;
  let t = performance.timing;

  times.fmp = 0; // 首屏时间 (渲染节点增量最大的时间点)
  if (supported.getEntriesByType) {
    const paintEntries = performance.getEntriesByType('paint');
    if (paintEntries.length) times.fmp = paintEntries[paintEntries.length - 1].startTime;

    // 优先使用 navigation v2  https://www.w3.org/TR/navigation-timing-2/
    if (supported.PerformanceNavigationTiming) {
      const nt2Timing = performance.getEntriesByType('navigation')[0];
      if (nt2Timing) t = nt2Timing;
    }
  }

  // 从开始发起这个页面的访问开始算起,减去重定向跳转的时间,在performanceV2版本下才进行计算,v1版本的fetchStart是时间戳而不是相对于访问起始点的相对时间
  if (times.fmp && supported.PerformanceNavigationTiming) times.fmp -= t.fetchStart;

  // 白屏时间 (从请求开始到浏览器开始解析第一批HTML文档字节的时间差)
  // times.fpt = t.responseEnd - t.fetchStart;

  times.tti = t.domInteractive - t.fetchStart; // 首次可交互时间

  times.ready = t.domContentLoadedEventEnd - t.fetchStart; // HTML加载完成时间

  times.loadon = t.loadEventStart - t.fetchStart; // 页面完全加载时间

  times.firstbyte = t.responseStart - t.domainLookupStart; // 首包时间

  times.dns = t.domainLookupEnd - t.domainLookupStart; // dns查询耗时

  times.appcache = t.domainLookupStart - t.fetchStart; // dns缓存时间

  times.tcp = t.connectEnd - t.connectStart; // tcp连接耗时

  times.ttfb = t.responseStart - t.requestStart; // 请求响应耗时

  times.trans = t.responseEnd - t.responseStart; // 内容传输耗时

  times.dom = t.domInteractive - t.responseEnd; // dom解析耗时

  times.res = t.loadEventStart - t.domContentLoadedEventEnd; // 同步资源加载耗时

  times.ssllink = t.connectEnd - t.secureConnectionStart; // SSL安全连接耗时

  times.redirect = t.redirectEnd - t.redirectStart; // 重定向时间

  times.unloadTime = t.unloadEventEnd - t.unloadEventStart; // 上一个页面的卸载耗时

  emit(normalizePerformanceRecord({
    ...times,
    eventType: 'performance',
    eventId: 'page',
    url: window.location.href,
  }));
}

export default {
  init({ performanceFirstResource, performanceCore }) {
    if (!performanceFirstResource && !performanceCore) return;

    // 初始化方法可能在onload事件之后才执行,此时不会触发load事件了,检查document.readyState属性来判断onload事件是否会被触发
    if (document.readyState === 'complete') {
      if (supported.performance && performanceFirstResource) observeNavigationTiming();
      if (supported.getEntriesByType && performanceCore) observeResource();
    } else {
      window.addEventListener('load', () => {
        if (supported.performance && performanceFirstResource) observeNavigationTiming();
        if (supported.getEntriesByType && performanceCore) observeResource();
      })
    }
  },
  tracePerformance(eventId, options) {
    const record = {
      triggerTime: Date.now(),
      url: window.location.href,
      ...options,
      eventId,
      eventType: 'performance',
    };
    emit(normalizePerformanceRecord(record));
  }
};
