import { init } from '../index'
import { _support } from '../src/utils/global'
import { PromiseRejectionEvent } from './utils/pollify'

describe('err', () => {
  beforeAll(() => {
    init({
      dsn: 'http://unit-test.com',
      appName: 'unit-test',
      error: true,
      recordScreen: false,
      ignoreErrors: [/^ignore/]
    })
  })

  function proxyEmit() {
    const testResult = { error: null, spy: vi.fn() }
    _support.sendData.emit = (e: any) => {
      testResult.spy()
      testResult.error = e
    }
    return testResult
  }

  it('code error should be captured correctly', () => {
    const testResult = proxyEmit()
    const errorEvent = new window.ErrorEvent('error', {
      filename: 'test.js',
      lineno: 10,
      colno: 20,
      error: new Error('code error')
    })
    window.dispatchEvent(errorEvent)
    expect(testResult.spy).toHaveBeenCalledTimes(1)
    expect(testResult.error).toMatchObject({
      line: 10,
      col: 20,
      eventId: 'code',
      eventType: 'error',
      errMessage: 'code error'
    })
  })

  it('unhandledrejection error should be captured correctly', () => {
    const testResult = proxyEmit()
    const errorEvent = new PromiseRejectionEvent('unhandledrejection', {
      reason: 'unhandledrejection error',
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      promise: Promise.reject('unhandledrejection error').catch(() => {})
    })
    window.dispatchEvent(errorEvent)
    expect(testResult.spy).toHaveBeenCalledTimes(1)
    expect(testResult.error).toMatchObject({
      eventId: 'reject',
      eventType: 'error',
      errMessage: 'unhandledrejection error'
    })
  })

  it('console error should be captured correctly', () => {
    const testResult = proxyEmit()
    console.error('console error')
    expect(testResult.spy).toHaveBeenCalledTimes(1)
    expect(testResult.error).toMatchObject({
      eventId: 'console.error',
      eventType: 'error',
      errMessage: 'console error'
    })
  })

  it('option ignoreErrors should work', () => {
    const testResult = proxyEmit()
    const errorEvent = new window.ErrorEvent('error', {
      filename: 'test.js',
      lineno: 10,
      colno: 20,
      error: new Error('ignore error')
    })
    window.dispatchEvent(errorEvent)
    expect(testResult.spy).toHaveBeenCalledTimes(0)
  })
})
