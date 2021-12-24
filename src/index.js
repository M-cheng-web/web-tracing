const base = require('./base').default;
const pv = require('./pv').default;
const http = require('./http-request').default;
const err = require('./err').default;
const { default: event, traceCustomEvent } = require('./event');
const performance = require('./performance').default;

const traceIns = window[process.env.LIBRARY_NAME];

// 重复加载脚本的情况下,后面的脚本不生效,只启动第一个加载进来的脚本
if (traceIns) {
  module.exports = traceIns;
} else {
  module.exports = {
    init: (options = {}) => {
      const { performance: tracePerformance = false } = options;

      typeof tracePerformance === 'boolean'
        ? options.performance = { server: tracePerformance, resource: tracePerformance}
        : options.performance = { server: Boolean(tracePerformance.server), resource: Boolean(tracePerformance.resource) };

      // 全部启动
      // base.init(options);
      // event.init(options);
      // pv.init(options);
      // http.init(options);
      // err.init(options);
      // performance.init(options);
    },
    // setCustomerId: base.setCustomerId,
    // setUserUuid: base.setUserUuid,

    // 主动上报方法
    // traceError: err.traceError,
    // tracePerformance: performance.tracePerformance,
    traceEvent: traceCustomEvent,
    // tracePageView: pv.tracePageView,
  };
}
