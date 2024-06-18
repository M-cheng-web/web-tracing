import fs from 'fs'
import path from 'path'
import http from 'http'

import { getServerURL, startServer, launchPuppeteer, getHtml } from './utils'
import { Browser, Page } from 'puppeteer'

describe('err', () => {
  vi.setConfig({ testTimeout: 30_000, hookTimeout: 30_000 })

  let code: string
  let serverURL: string
  let server: http.Server
  let browser: Browser

  beforeAll(async () => {
    server = await startServer(3031)
    serverURL = getServerURL(server)
    browser = await launchPuppeteer()

    const bundlePath = path.resolve(__dirname, '../dist/index.iife.js')
    code = fs.readFileSync(bundlePath, 'utf8')
  })

  afterAll(async () => {
    browser && (await browser.close())
    server && server.close()
  })

  async function loadTestPage() {
    const page: Page = await browser.newPage()
    const htmlName = 'recordscreen.html'
    await page.goto(`${serverURL}/${htmlName}`)
    const html = getHtml(`${htmlName}`, code)
    await page.setContent(html)
    await page.waitForFunction(() => {
      return document.readyState === 'complete'
    })
    return page
  }

  it('error recordscreen should be captured correctly', async () => {
    const page = await loadTestPage()
    await page.click('.code-error-button')
    const webTracingData = await page.evaluate(`window.__WebTracingData__`)
    expect(
      (webTracingData as any).eventInfo[0].recordscreen
    ).not.toBeUndefined()
  })
})
