import { getCookieByName, uuid } from './util';

const deviceKey = '_warden_device_id';
const { screen } = window;
const { clientWidth, clientHeight } = document.documentElement;
const { width, height, colorDepth, pixelDepth } = screen;

let deviceId = getCookieByName(deviceKey);

if (!deviceId) {
  deviceId = `t_${uuid()}`;
  document.cookie = `${deviceKey}=${deviceId};path=/;`;
}

// 设备相关的信息
export default {
  clientHeight, // 网页可见区高度
  clientWidth, // 网页可见区宽度
  colorDepth, // 显示屏幕调色板的比特深度
  pixelDepth, // 显示屏幕的颜色分辨率
  deviceId, // id
  screenWidth: width, // 显示屏幕的宽度
  screenHeight: height, // 显示屏幕的高度
  vendor: navigator.vendor, // 浏览器名称
  platform: navigator.platform, // 浏览器平台的环境,不是电脑系统的x64这样的(浏览器平台的环境可能是x32)
};
