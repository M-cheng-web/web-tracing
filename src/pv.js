import { emit, pageId } from './base';

let oldURL = window.location.href; // 最后一次的url
let historyLength = window.history.length; // 最后一次history栈的长度

// 为什么从初始页面跳进来的时候 会是那样的url? ???????????????????

/**
 * 发送数据
 * option 请求参数
 */
function tracePageView(option = {}) {
  // 参数处理
  const {
    url = window.location.href, referer = oldURL, actions = '', params,
  } = option;
  let action = actions;
  if (!action && window.history.length < 50) {
    action = historyLength === window.history.length ? 'back_forward' : 'navigation';
    historyLength = window.history.length;
  }
  // 如果option.title为空,则等待框架处理document.title,延迟17ms
  setTimeout(() => { // 为什么要延迟17 ???????????
    emit({
      eventType: 'pv',
      eventId: pageId,
      url,
      referer,
      params,
      title: option.title || document.title,
      operateAction: action,
      triggerTime: `${Date.now()}`,
    });
  }, option.title ? 0 : 17);
  oldURL = url;
  historyLength = window.history.length; // 更新historyLength
}
/**
 * 路由Pv采集
 * option.hashtag true=>监听hash变化; false=>不监听hash变化
 */
function init(options = {}) {
  const { pv = true, hashtag = false } = options;
  const referer = document.referrer; // 获取是从哪个页面跳转来的
  if (!pv) return; // 关闭自动采集pv

  let lastIsPop = false; // 最后一次触发路由变化是否为popState触发
  tracePageView({ url: oldURL, referer });

  if (window.history.pushState) {
    // 劫持history.pushState history.replaceState
    const push = window.history.pushState.bind(window.history);
    window.history.pushState = (data, title, url) => {
      console.log('pushState');
      lastIsPop = false;
      const result = push(data, title, url);
      tracePageView({ actions: 'navigation' });
      return result;
    };

    const repalce = window.history.replaceState.bind(window.history);
    window.history.replaceState = (data, title, url) => {
      console.log('replaceState');
      lastIsPop = false;
      const result = repalce(data, title, url);
      tracePageView({ actions: 'navigation' });
      return result;
    };

    // hash变化也会触发popstate事件,而且会先触发popstate事件 ??????????? 并不会
    // 可以使用popstate来代替hashchange,如果支持History H5 Api
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event
    window.addEventListener('popstate', () => { // 只有history路由会触发这个 hash路由不会触发这个
      console.log('popstate', window.location.hash);
      if (window.location.hash !== '') { // 为什么还要加这个  这个肯定是 '' ????????????
        const oldHost = oldURL.indexOf('#') > 0 // 多页面情况下 history模式刷新还是在pv页面
          ? oldURL.slice(0, oldURL.indexOf('#'))
          : oldURL;
        if (window.location.href.slice(0, window.location.href.indexOf('#')) === oldHost && !hashtag) return;
      }
      lastIsPop = true;
      tracePageView();
    });
  }
  // 监听hashchange
  window.addEventListener('hashchange', () => {
    console.log('hashchange');
    // 如果上次改变未触发popState(列如锚点)且允许记录hashchange 则用hashchange记录
    if (hashtag && !lastIsPop) tracePageView();
    lastIsPop = false;
  });
}

export default { init, tracePageView };
