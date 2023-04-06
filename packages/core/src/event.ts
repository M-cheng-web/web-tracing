import { uuid } from '../utils/index';
import { debug } from '../utils/debug';
import { baseInfo } from './base';
import { sendData } from './sendData';
import type { Options } from '../types/option';

class RequestTemplate {
  constructor(config = {}) {
    const list = ['eventType', 'eventId', 'url', 'referer', 'action', 'params', 'millisecond'];
    list.forEach((key) => { this[key] = config[key] || null; });
  }
}
class RequestTemplateClick {
  constructor(config = {}) {
    const list = ['eventType', 'eventId', 'url', 'params', 'title', 'x', 'y'];
    list.forEach((key) => { this[key] = config[key] || null; });
  }
}

/**
 * 是否为简单的标签
 * 只包含下面的arr数组内的标签才是简单的标签
 */
function isSimpleEl(children) {
  if (children.length > 0) {
    const arr = ['em', 'b', 'strong', 'span', 'img', 'i', 'code'];
    const a = children.filter(({ tagName }) => arr.indexOf(tagName.toLowerCase()) >= 0);
    return a.length === children.length;
  }
  return true;
}

/**
 * 获取元素到最外层元素组成的数组
 */
function getNodePath(node, options = {}) {
  if (!node) return [];
  const { includeSelf = true, order = 'asc' } = options;
  let parent = includeSelf ? node : node.parentElement;
  let result = [];
  while (parent) {
    result = order === 'asc' ? result.concat(parent) : [parent].concat(result);
    parent = parent.parentElement;
  }
  return result;
}

/**
 * 获取元素的关系字符串
 * 例如两层div的关系会得到字符串: div>div
 */
function getNodeXPath(node, curPath = '') {
  if (!node) return curPath;
  const parent = node.parentElement;
  let index = 0; // 这个index 暂时没什么用
  const { id } = node;
  const tagName = node.tagName.toLowerCase();
  const path = curPath ? `>${curPath}` : '';
  const indexBrackets = index ? `.${index}` : '';

  if (!parent || parent === window || parent === document.documentElement || parent === document.body) return `${tagName}${path}`;

  if (id) return `#${id}${path}`; // 知道了id 就不需要获取上下级关系了(id是唯一的)

  if (parent.children.length > 1) index = Array.prototype.indexOf.call(parent.children, node);

  return getNodeXPath(parent, `${tagName}${indexBrackets}${path}`);
}

/**
 * 点击事件
 */
function clickCollection() {
  document.addEventListener('click', (e) => { // 点击事件
    const _config = new RequestTemplateClick({ eventType: 'click' });
    debug('caught click event: ', e);
    let { path } = e;
    if (path === undefined) path = e.target ? getNodePath(e.target) : []; // 获取被点击的元素到最外层元素组成的数组

    const target = path.find((el) => // 检查被点击的元素以及其父级元素是否有这些属性(从内到外,只会取第一个检查到的)
      el.hasAttribute && (el.hasAttribute('data-warden-container')
        || el.hasAttribute('data-warden-event-id')
        || el.hasAttribute('data-warden-title')));
    if (!target) return;

    _config.title = extractTitleByTarget(target);
    _config.eventId = extractDataByPath(path);
    _config.params = extractParamsByPath(path);
    _config.elementPath = getNodeXPath(target).slice(-128); // 长度限制128字符
    const { top, left } = e.target.getBoundingClientRect(); // 元素距离html的距离
    const { scrollTop, scrollLeft } = document.documentElement; // html距离上和左侧的距离(一般都是0)
    const x = left + scrollLeft;
    const y = top + scrollTop;
    _config.x = x;
    _config.y = y;
    _config.triggerTime = Date.now(); // 点击时间
    _config.url = window.location.href; // 当前页面的url
    sendData.emit(_config);
  }, true);
}

/**
 * 加载 & 卸载事件
 */
function dwellCollector(eventUnload) {
  const _config = new RequestTemplate({ eventType: 'dwell' });
  window.addEventListener('load', () => { // 加载完成事件
    _config.entryTime = Date.now();
  }, true);

  if (!eventUnload) return;
  window.addEventListener('beforeunload', () => { // 卸载事件
    _config.eventId = uuid();
    _config.url = window.location.href; // 当前页面 url
    _config.referer = document.referrer; // 上级页面 url(从哪个页面跳过来的就是上级页面)
    _config.triggerTime = Date.now(); // 卸载时间
    _config.millisecond = Date.now() - _config.entryTime; // 停留多久
    const mapping = {
      0: 'navigate', // 网页通过点击链接,地址栏输入,表单提交,脚本操作等方式加载
      1: 'reload', // 网页通过“重新加载”按钮或者location.reload()方法加载
      2: 'back_forward', // 网页通过“前进”或“后退”按钮加载
      255: 'reserved', // 任何其他来源的加载
    };
    const { type } = performance.navigation; // 表示加载来源, type为 0,1,2,255
    _config.operateAction = mapping[type] || null;
    sendData.emit(_config, true);
  }, false);
}

/**
 * 提取数据事件ID
 */
function extractDataByPath(list = []) {
  /* data-warden-event-id */
  const hasIdEl = getElByAttr(list, 'data-warden-event-id');
  if (hasIdEl) return hasIdEl.getAttribute('data-warden-event-id');

  /* title */
  const hasTitleEl = getElByAttr(list, 'title');
  if (hasTitleEl) return hasTitleEl.getAttribute('title');

  /* container */
  const container = getElByAttr(list, 'data-warden-container');
  if (container) {
    if (container.getAttribute('data-warden-event-id') || container.getAttribute('title')) {
      return container.getAttribute('data-warden-event-id') || container.getAttribute('title');
    }
    const id2 = container.getAttribute('data-warden-container');
    if (typeof id2 === 'string' && id2) return id2;
  }
  return list[0].tagName.toLowerCase();
}

/**
 * 提取数据参数
 * 如果本身节点没有埋点属性的话会用上一层埋点属性
 */
function extractParamsByPath(list = []) {
  const regex = /^data-warden-/;
  let target;
  let targetIndex;
  try {
    // 遍历从子节点到body下最大的节点,遍历他们的属性,直到某个节点的属性能通过校验的节点
    list.forEach((el, index) => {
      const attributes = el && el.attributes && Array.from(el.attributes) || [];
      target = attributes.find((item) => (item.nodeName.match(regex)
        ? item.nodeName.match(regex)
        : item.nodeName.indexOf('data-warden-container') !== -1));
      if (target) {
        targetIndex = index;
        throw Error();
      }
    });
  } catch (error) {
  }
  if (targetIndex < 0) return {};

  const container = list[targetIndex];
  const attrList = Array.from(container.attributes) || [];
  const params = {};
  attrList.forEach((item) => {
    // 过滤多结构属性 如 data-warden-event-id width
    // if(item.nodeName.split("-").length != 3 )return;
    // 过滤非标准命名 如 data-v-fbcf7454
    if (item.nodeName.indexOf('data-warden') < 0) return;
    const key = item.nodeName.replace(regex, '');
    params[key] = item.nodeValue;
  });

  // 过滤sdk自定义属性
  const defaultKey = ['container', 'title', 'event-id'];
  defaultKey.forEach((item) => { delete params[item]; });
  return params;
}

/**
 * 根据属性查找元素
 */
function getElByAttr(list, key) {
  return list.find((item) => (item.hasAttribute && item.hasAttribute(key)));
}

/**
 * 获取title属性(data-warden-title 或者 title)
 */
function extractTitleByTarget(target = {}) {
  const selfTitle = getNodeTitle(target);
  if (selfTitle) return selfTitle;

  let container = target.parent; // 向上找container

  while (container && container !== document.body) {
    if (container.hasAttribute('data-warden-container')) break;
    container = container.parent;
  }
  const superTitle = getNodeTitle(container);
  if (superTitle) return superTitle;

  const { tagName } = target; // 没有container,没有任何title标记的情况下
  return (!target.hasChildNodes() || tagName.toLowerCase() === 'svg')
    ? handleLeafNode(target)
    : handleNoLeafNode(target);
}

/**
 * 获取元素的 data-warden-title属性或者 title属性
 */
function getNodeTitle(node) {
  if (node) {
    return node.hasAttribute('data-warden-title') ? node.getAttribute('data-warden-title') : node.title;
  }
  return null;
}

/**
 * 点击叶子元素(也就是不包含其他HTML元素,也不能有文本内容)
 */
function handleLeafNode(target) {
  const { tagName, textContent } = target;

  if (tagName === 'IMG') return target.getAttribute('alt') || null;

  if (tagName === 'svg') {
    const a = [...target.children].find((item) => (item.tagName === 'use'));
    if (a) return a.getAttribute('xlink:href') || null;
  }
  return textContent;
}

/**
 * 点击非叶子元素
 */
function handleNoLeafNode(target) {
  const { tagName, textContent } = target;
  if (tagName === 'A') {
    const res = isSimpleEl([...target.children]);
    return res ? textContent : target.getAttribute('href') || null;
  }
  if (tagName === 'BUTTON') {
    const name = target.getAttribute('name');
    const res = isSimpleEl([...target.children]);
    return name || res ? textContent : target.getAttribute('href') || null;
  }
  const { length } = [...target.children].filter(() => target.hasChildNodes());
  return length > 0 ? null : textContent;
}

function initEvent(options: Options) {
  // if (!eventCore && !eventUnload) return;

  if (eventCore) clickCollection();
  dwellCollector(eventUnload);
}

/**
 * 主动触发事件上报
 * @param {*} eventId 事件ID
 * @param {*} title 事件标题
 * @param {*} params 自定义配置信息
 * @returns 
 */
function handleSendEvent(eventId, title, params = {}) {
  sendData.emit({ eventId, title, params, eventType: 'custom', triggerTime: Date.now() });
}

export {
  initEvent,
  handleSendEvent,
};
