import { init } from '../index'
import { _support } from '../src/utils/global'

describe('err', () => {
  beforeAll(() => {
    init({
      dsn: 'http://unit-test.com',
      appName: 'unit-test',
      error: true,
      recordScreen: false,
      scopeError: true
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

  it('batch error should be captured correctly', () => {
    const testResult = proxyEmit()
    for (let i = 0; i < 50; i++) {
      const errorEvent = new window.ErrorEvent('error', {
        filename: 'test.js',
        lineno: 10,
        colno: 20,
        error: new Error('code error')
      })
      window.dispatchEvent(errorEvent)
    }
    expect(testResult.spy).toHaveBeenCalledTimes(1)
    expect(testResult.error).toMatchObject([
      {
        line: 10,
        col: 20,
        eventId: 'code',
        eventType: 'error',
        errMessage: 'code error',
        batchError: true
      }
    ])
  })
})
