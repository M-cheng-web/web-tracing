// ---------------- Error 捕捉 ----------------
document.getElementById('codeErr')?.addEventListener('click', () => {
  codeError()
})

function codeError() {
  const a = {}
  a.split('/')
}
function promiseError() {
  const promiseWrap = () =>
    new Promise((resolve, reject) => {
      reject('promise reject')
    })
  promiseWrap().then(res => {
    console.log('res', res)
  })
}
function consoleErr() {
  console.error('consoleErr1', 'consoleErr1.1', 'consoleErr1.2')
  // console.error(111);
  // console.error(new Error("谢谢谢谢谢"));
}
