import { init } from '../index'
import { _support, _global } from '../src/utils/global'
import { JSDOM } from 'jsdom'

describe('err', () => {
  beforeAll(() => {
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test</title>
      </head>
      <body>
        <div
          data-warden-title="test-title"
          data-warden-event-id="test-event-id"
        >
          <div data-warden-id="test-warden-id">
            <button id="btn">test</button>
          </div>
        </div>
      </body>
      </html>
    `)
    // @ts-expect-error: expected
    _global.document = dom.window.document
    init({
      dsn: 'http://unit-test.com',
      appName: 'unit-test',
      event: true,
      recordScreen: false
    })
  })

  function proxyEmit() {
    const testResult = { info: null, spy: vi.fn() }
    _support.sendData.emit = (e: any) => {
      testResult.spy()
      testResult.info = e
    }
    return testResult
  }

  it('event should be captured correctly', async () => {
    const testResult = proxyEmit()

    const button = document.getElementById('btn')!
    button.click()
    expect(testResult.spy).toHaveBeenCalledTimes(1)
    expect(testResult.info).toMatchObject({
      eventId: 'test-event-id',
      eventType: 'click',
      title: 'test-title',
      elementPath: 'div',
      params: {
        id: 'test-warden-id'
      }
    })
  })
})
