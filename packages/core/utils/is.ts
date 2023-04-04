function isType(type: any) {
  return function (value: any): boolean {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
}

export const isNumber = isType('Number')
export const isString = isType('String')
export const isBoolean = isType('Boolean')
export const isNull = isType('Null')
export const isUndefined = isType('Undefined')
export const isSymbol = isType('Symbol')
export const isFunction = isType('Function')
export const isObject = isType('Object')
export const isArray = isType('Array')
export const isProcess = isType('process')
export const isWindow = isType('Window')

/**
 * 检测变量类型
 * @param type
 */
export const variableTypeDetection = {
  isNumber: isType('Number'),
  isString: isType('String'),
  isBoolean: isType('Boolean'),
  isNull: isType('Null'),
  isUndefined: isType('Undefined'),
  isSymbol: isType('Symbol'),
  isFunction: isType('Function'),
  isObject: isType('Object'),
  isArray: isType('Array'),
  isProcess: isType('process'),
  isWindow: isType('Window'),
};

export function isError(error: Error): boolean {
  switch (Object.prototype.toString.call(error)) {
    case '[object Error]':
      return true;
    case '[object Exception]':
      return true;
    case '[object DOMException]':
      return true;
    default:
      return false;
  }
}

/**
 * 检查是否是空对象
 */
export function isEmptyObject(obj: object): boolean {
  return variableTypeDetection.isObject(obj) && Object.keys(obj).length === 0;
}

export function isEmpty(wat: any): boolean {
  return (
    (variableTypeDetection.isString(wat) && wat.trim() === '') || wat === undefined || wat === null
  );
}

export function isExistProperty(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
