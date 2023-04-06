import { name, version } from '../package.json'

export const SDK_VERSION = version;

export const SDK_NAME = name;

export const DEVICE_KEY = '_webtracing_device_id'; // 设备ID Key - 私有属性

export const SESSION_KEY = '_webtracing_session_id'; // 会话ID Key(一个站点只允许运行一个埋点程序) - 私有属性

export const SURVIVIE_MILLI_SECONDS = 1800000; // 会话 session存活时长(30minutes) - 私有属性

export const MAX_CACHE_LEN = 5; // 最大缓存数

export const MAX_WAITING_TIME = 5000; // 最大等待时间

export const DEBUG_LOG = true; // 是否输出采集信息