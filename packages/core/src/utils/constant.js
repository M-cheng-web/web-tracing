const DEVICE_KEY = '_warden_device_id'; // deviceKey - 固定

const SESSION_KEY = '_warden_session_id'; // sessionKey(一个站点只允许运行一个埋点程序) - 固定

const SURVIVIE_MILLI_SECONDS = 1800000; // session存活时长(30minutes) - 固定

const MAX_CACHE_LEN = 5; // 最大缓存数

const MAX_WAITING_TIME = 5000; // 最大等待时间

const DEBUG_LOG = false; // 是否输出采集信息

export {
  DEVICE_KEY,
  SESSION_KEY,
  SURVIVIE_MILLI_SECONDS,
  MAX_CACHE_LEN,
  MAX_WAITING_TIME,
  DEBUG_LOG,
}