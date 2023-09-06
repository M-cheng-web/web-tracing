import { useState } from 'react'
import ErrorComponent from './ErrorComponent'

function App() {
  const [isShow, setIsShow] = useState(false)

  const handleThrowError = () => {
    const a = b + 1
  }

  const handlePromiseError = () => {
    Promise.resolve().then(() => {
      const a = c + 1
    })
  }

  return (
    <>
      <button onClick={handleThrowError}>代码异常</button>
      <button onClick={handlePromiseError}>promise 异常</button>
      <button onClick={() => setIsShow(!isShow)}>组件渲染异常</button>
      {isShow ? <ErrorComponent /> : null}
    </>
  )
}

export default App
