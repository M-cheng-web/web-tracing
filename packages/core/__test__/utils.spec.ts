import { getNodeXPath } from '../src/utils/element'

describe('utils', () => {
  it('getNodeXPath should work', () => {
    const element = document.createElement('div')
    element.innerHTML = `
      <div id="wrapper">
        <div></div>
        <div></div>
        <div>
          <div class="target"></div>
        </div>
      </div>
    `
    const target = element.querySelector('.target')!
    expect(getNodeXPath(target)).toBe('#wrapper>div>div')
  })
})
