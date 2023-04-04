/**
 * 接口错误状态
 */
export enum SpanStatus {
  Ok = 'ok',
  DeadlineExceeded = 'deadline_exceeded',
  Unauthenticated = 'unauthenticated',
  PermissionDenied = 'permission_denied',
  NotFound = 'not_found',
  ResourceExhausted = 'resource_exhausted',
  InvalidArgument = 'invalid_argument',
  Unimplemented = 'unimplemented',
  Unavailable = 'unavailable',
  InternalError = 'internal_error',
  UnknownError = 'unknown_error',
  Cancelled = 'cancelled',
  AlreadyExists = 'already_exists',
  FailedPrecondition = 'failed_precondition',
  Aborted = 'aborted',
  OutOfRange = 'out_of_range',
  DataLoss = 'data_loss',
}

/**
 * 用户行为
 */
export enum BREADCRUMBTYPES {
  HTTP = 'Http',
  CLICK = 'Click',
  RESOURCE = 'Resource_Error',
  CODEERROR = 'Code_Error',
  ROUTE = 'Route',
  CUSTOM = 'Custom',
}

/**
 * 状态
 */
export enum STATUS_CODE {
  ERROR = 'error',
  OK = 'ok',
}

/**
 * 事件类型
 */
export enum EVENTTYPES {
  ERROR = 'error',
  CONSOLEERROR = 'consoleError',
  UNHANDLEDREJECTION = 'unhandledrejection',

  XHR = 'xhr',
  FETCH = 'fetch',
  CLICK = 'click',
  HISTORY = 'history',
  HASHCHANGE = 'hashchange',
  RESOURCE = 'resource',
  DOM = 'dom',
  VUE = 'vue',
  REACT = 'react',
  CUSTOM = 'custom',
  PERFORMANCE = 'performance',
  RECORDSCREEN = 'recordScreen',
  WHITESCREEN = 'whiteScreen', // 白屏
}

export enum HTTPTYPE {
  XHR = 'xhr',
  FETCH = 'fetch',
}

export enum HTTP_CODE {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
}

export enum EMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

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