/**
 * 会话控制,此会话只和具体的浏览器相关,与业务无关,和业务意义上的登录态没有任何关联,只是用于追踪同一个浏览器上访问页面的动作
 */
import { getCookieByName, uuid } from './index';
import { SURVIVIE_MILLI_SECONDS, SESSION_KEY } from '../common'

/**
 * 刷新会话存续期
 */
function refreshSession() {
  const id = getCookieByName(SESSION_KEY) || `s_${uuid()}`;
  const expires = new Date(Date.now() + SURVIVIE_MILLI_SECONDS);
  document.cookie = `${SESSION_KEY}=${id};path=/;max-age=1800;expires=${expires.toUTCString()}`;
  return id;
}

/**
 * 获取sessionid
 */
function getSessionId() {
  return getCookieByName(SESSION_KEY) || refreshSession();
}

refreshSession(); // 初始化

export {
  getSessionId,
  refreshSession,
};
