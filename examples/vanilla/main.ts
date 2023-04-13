// document.querySelector('#app').innerHTML = `
//   <div>
//     <a target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

import { init } from '@web-tracing/core'
// import { pad } from '@web-tracing/utils'
// console.log('pad', pad)

init({
  dsn: 'http://1.15.224.10:22/trackweb/tra',
  appName: 'cxh',
  debug: true,
  pv: {
    core: true,
    hashtag: false
  }
  // performance: true
  // error: true,
  // event: true
})
