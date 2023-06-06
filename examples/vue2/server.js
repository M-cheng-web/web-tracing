import express from 'express'
const app = express()
// import { join } from 'path'
// import { readFile } from 'fs'
import pkg from 'body-parser'
// import { json as _json } from 'co-body'

const { json, urlencoded } = pkg

app.use(json({ limit: '100mb' }))
app.use(
  urlencoded({
    limit: '100mb',
    extended: true,
    parameterLimit: 50000
  })
)

app.all('*', function (res, req, next) {
  req.header('Access-Control-Allow-Origin', '*')
  req.header('Access-Control-Allow-Headers', 'Content-Type')
  req.header('Access-Control-Allow-Methods', '*')
  req.header('Content-Type', 'application/json;charset=utf-8')
  next()
})

app.get('/getList', (req, res) => {
  res.send({
    code: 200,
    data: [1, 2, 3]
  })
})
app.post('/setList', (req, res) => {
  res.send({
    code: 200,
    meaage: '设置成功'
  })
})

app.listen(3351, () => {
  console.log('Server is running at http://localhost:3351')
})
