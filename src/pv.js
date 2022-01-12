import { emit, pageId } from './base';

let oldURL = window.location.href; // 最后一次的url
let historyLength = window.history.length; // 最后一次history栈的长度

/**
 * 发送数据
 * option 请求参数
 */
function tracePageView(option = {}) {
  const { url = window.location.href, referer = oldURL, actions = '', params } = option;
  let action = actions;
  if (!action && window.history.length < 50) {
    action = historyLength === window.history.length ? 'back_forward' : 'navigation';
    historyLength = window.history.length;
  }
  // 如果option.title为空,则等待框架处理document.title,延迟17ms
  // 为什么是17ms?  一秒60Hz是基准,平均1Hz是17毫秒,只要出来了页面那就有 document.title
  setTimeout(() => {
    emit({
      eventType: 'pv',
      eventId: pageId,
      url,
      referer,
      params,
      title: option.title || document.title,
      action,
      triggerTime: Date.now(),
    });
  }, option.title ? 0 : 17);
  oldURL = url;
  historyLength = window.history.length;
}
/**
 * 路由Pv采集
 * pvHashtag 是否监听hash变化
 */
function init(options = {}) {
  const { pvCore, pvHashtag } = options;
  const referer = document.referrer; // 获取是从哪个页面跳转来的
  if (!pvCore) return;

  let lastIsPop = false; // 最后一次触发路由变化是否为popState触发
  tracePageView({ url: oldURL, referer });

  if (window.history.pushState) {
    // 劫持history.pushState history.replaceState
    const push = window.history.pushState.bind(window.history);
    window.history.pushState = (data, title, url) => {
      lastIsPop = false;
      const result = push(data, title, url);
      tracePageView({ actions: 'navigation' });
      return result;
    };

    const repalce = window.history.replaceState.bind(window.history);
    window.history.replaceState = (data, title, url) => {
      lastIsPop = false;
      const result = repalce(data, title, url);
      tracePageView({ actions: 'navigation' });
      return result;
    };

    // hash变化也会触发popstate事件,而且会先触发popstate事件
    // 可以使用popstate来代替hashchange,如果支持History H5 Api
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event
    window.addEventListener('popstate', () => {
      if (window.location.hash !== '') {
        const oldHost = oldURL.indexOf('#') > 0 // 多页面情况下 history模式刷新还是在pv页面
          ? oldURL.slice(0, oldURL.indexOf('#'))
          : oldURL;
        if (window.location.href.slice(0, window.location.href.indexOf('#')) === oldHost && !pvHashtag) return;
      }
      lastIsPop = true;
      tracePageView();
    });
  }
  // 监听hashchange
  window.addEventListener('hashchange', () => {
    if (pvHashtag && !lastIsPop) tracePageView();
    lastIsPop = false;
  });
}

export default { init, tracePageView };
