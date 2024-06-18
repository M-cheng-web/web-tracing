import fs from 'fs'
import path from 'path'
import http from 'http'

import {
  getServerURL,
  replaceLast,
  startServer,
  launchPuppeteer
} from './utils'
import { Browser, Page } from 'puppeteer'

describe('err', () => {
  vi.setConfig({ testTimeout: 30_000, hookTimeout: 30_000 })

  let code: string
  let serverURL: string
  let server: http.Server
  let browser: Browser

  beforeAll(async () => {
    server = await startServer()
    serverURL = getServerURL(server)
    browser = await launchPuppeteer()

    const bundlePath = path.resolve(__dirname, '../dist/index.iife.js')
    code = fs.readFileSync(bundlePath, 'utf8')
  })

  afterAll(async () => {
    browser && (await browser.close())
    server && server.close()
  })

  const baseInfo = {
    appCode: '',
    appName: 'cxh',
    clientHeight: 1080,
    clientWidth: 1920,
    vendor: 'Google Inc.'
  }

  function getHtml(fileName: string) {
    const filePath = path.resolve(__dirname, `./html/${fileName}`)
    const html = fs.readFileSync(filePath, 'utf8')
    return replaceLast(
      html,
      '</body>',
      `
    <script>
      ${code}
    </script>
    </body>
    `
    )
  }

  async function loadTestPage() {
    const page: Page = await browser.newPage()
    const htmlName = 'performance.html'
    await page.goto(`${serverURL}/${htmlName}`)
    const html = getHtml(`${htmlName}`)
    await page.setContent(html)
    await page.waitForFunction(() => {
      return document.readyState === 'complete'
    })
    return page
  }

  function assertInitiatorType(
    data: any,
    initiatorType: 'script' | 'link' | 'img'
  ) {
    expect(data).toMatchObject({
      baseInfo,
      eventInfo: [
        {
          eventId: 'resource',
          eventType: 'performance',
          initiatorType: initiatorType
        }
      ]
    })
  }

  it('firstResource performance should be captured correctly', async () => {
    const page = await loadTestPage()
    const webTracingData = (await page.evaluate(
      `window.__WebTracingData__`
    )) as any[]

    expect(webTracingData).toMatchObject({
      baseInfo,
      eventInfo: [
        {
          eventId: 'page',
          eventType: 'performance'
        }
      ]
    })
  })

  it('async script performance should be captured correctly', async () => {
    const page = await loadTestPage()
    await page.click('.script-button')
    await page.waitForFunction(() => {
      return (window as any).WebTracingTestVar !== undefined
    })
    const webTracingData = await page.evaluate(`window.__WebTracingData__`)
    assertInitiatorType(webTracingData, 'script')
  })

  it('async link performance should be captured correctly', async () => {
    const page = await loadTestPage()
    await page.click('.link-button')
    await page.waitForFunction(() => {
      const element = document.querySelector('#web-tracing-test-id')!
      const style = window.getComputedStyle(element)
      return style.color === 'rgb(255, 0, 0)'
    })
    const webTracingData = await page.evaluate(`window.__WebTracingData__`)
    assertInitiatorType(webTracingData, 'link')
  })

  it('async img performance should be captured correctly', async () => {
    const page = await loadTestPage()
    await page.click('.img-button')
    await page.waitForSelector('#performance-img-div img')
    const webTracingData = await page.evaluate(`window.__WebTracingData__`)
    assertInitiatorType(webTracingData, 'img')
  })
})
