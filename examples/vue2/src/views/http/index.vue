<template>
  <div>
    <div class="mb">
      <el-alert type="warning" title="注意" :closable="false" class="mb">
        <template slot>
          <div>
            axios的错误请求需要手动加上cache，否则错误会暴露导致错误模块会监听到此错误，从而造成错误的重复
          </div>
        </template>
      </el-alert>
      <el-button type="success" plain @click="onClickAxiosGet">
        axios正常请求-get
      </el-button>
      <el-button type="success" plain @click="onClickAxiosPost">
        axios正常请求-post
      </el-button>
      <el-button type="danger" plain @click="onClickAxiosError">
        axios异常请求-get
      </el-button>
      <el-button type="danger" plain @click="onClickAxiosPostError">
        axios异常请求-post
      </el-button>
    </div>
    <div class="mb">
      <el-button type="success" plain @click="onClickXhrGet">
        xhr正常请求-get
      </el-button>
      <el-button type="success" plain @click="onClickXhrPost">
        xhr正常请求-post
      </el-button>
      <el-button type="danger" plain @click="onClickXhrGetError">
        xhr异常请求-get
      </el-button>
      <el-button type="danger" plain @click="onClickXhrPostError">
        xhr异常请求-post
      </el-button>
      <el-button type="success" plain @click="onClickXhrGetImg">
        xhr请求图片
      </el-button>
    </div>
    <div class="mb">
      <el-button type="success" plain @click="onClickFetchGet">
        Fetch正常请求-get
      </el-button>
      <el-button type="success" plain @click="onClickFetchPost">
        Fetch正常请求-post
      </el-button>
      <el-button type="danger" plain @click="onClickFetchGetError">
        Fetch异常请求-get
      </el-button>
      <el-button type="danger" plain @click="onClickFetchPostError">
        Fetch异常请求-post
      </el-button>
      <el-button type="success" plain @click="onClickFetchGetImg">
        Fetch请求图片
      </el-button>
    </div>

    <el-button type="primary" @click="getAllTracingList">
      获取最新采集数据
    </el-button>
    <c-table
      :data="tracingInfo.data"
      tableHeight="400"
      :config="tracingInfo.table.config"
    >
      <template v-slot:index="{ scope }">
        {{ `${scope.index + 1}` }}
      </template>
      <template v-slot:sendTime="{ scope }">
        {{ `${formatDate(scope.row.sendTime)}` }}
      </template>
      <template v-slot:triggerTime="{ scope }">
        {{ `${formatDate(scope.row.triggerTime)}` }}
      </template>
    </c-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      tracingInfo: {
        data: [],
        table: {
          config: [
            { label: '序号', prop: 'index', width: '50', isTemplate: true },
            { label: '事件ID', prop: 'eventId' },
            { label: '事件类型', prop: 'eventType' },
            { label: '请求地址', prop: 'requestUrl', width: '200' },
            { label: '请求类型', prop: 'requestType' },
            { label: '请求方式', prop: 'requestMethod' },
            { label: '事件参数', prop: 'params', width: '180' },
            { label: '当前页面URL', prop: 'triggerPageUrl', width: '200' },
            { label: '请求返回代码', prop: 'responseStatus', width: '100' },
            { label: '请求消耗时间(ms)', prop: 'duration', width: '120' },
            {
              label: '发送时间',
              prop: 'sendTime',
              isTemplate: true,
              width: '140'
            },
            {
              label: '事件发生时间',
              prop: 'triggerTime',
              isTemplate: true,
              width: '140'
            },
            { label: '错误信息', prop: 'errMessage' }
          ]
        }
      }
    }
  },
  mounted() {
    this.getAllTracingList()
  },
  methods: {
    onClickAxiosGet() {
      this.sendMessage()

      axios.get('/getList', { params: { test: 123 } }).then(res => {
        console.log('axios-res', res)
      })
    },
    onClickAxiosPost() {
      this.sendMessage()

      axios.post('/setList', { test: 123 }).then(res => {
        console.log('axios-res', res)
      })
    },
    onClickAxiosError() {
      this.sendMessage()

      axios
        .get('/getList2', { params: { test: 123 } })
        .then(res => {
          console.log('axios-res', res)
        })
        .catch(err => {
          console.log('axios-err', err)
        })
    },
    onClickAxiosPostError() {
      this.sendMessage()

      axios
        .post('/setList2', { test: 123 })
        .then(res => {
          console.log('axios-res', res)
        })
        .catch(err => {
          console.log('axios-err', err)
        })
    },
    onClickXhrGet() {
      this.sendMessage()

      const xhr = new XMLHttpRequest()
      xhr.open('get', '/getList?test=123')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log('xhr-res', xhr.responseText)
        }
      }
    },
    onClickXhrPost() {
      this.sendMessage()

      const xhr = new XMLHttpRequest()
      const body = { username: 'example', password: '123456' }
      xhr.open('post', '/setList')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send(JSON.stringify(body))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log('xhr-res', xhr.responseText)
        }
      }
    },
    onClickXhrGetError() {
      this.sendMessage()

      const xhr = new XMLHttpRequest()
      xhr.open('get', '/getList2?test=123')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log('xhr-res', xhr.responseText)
        }
      }
    },
    onClickXhrPostError() {
      this.sendMessage()

      const body = { username: 'example', password: '123456' }
      const xhr = new XMLHttpRequest()
      xhr.open('post', '/setList2')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send(JSON.stringify(body))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log('xhr-res', xhr.responseText)
        }
      }
    },
    onClickXhrGetImg() {
      // 创建一个新的 XMLHttpRequest 对象
      var xhr = new XMLHttpRequest()

      // 初始化一个 GET 请求到指定的 URL
      xhr.open(
        'GET',
        'https://tse1-mm.cn.bing.net/th/id/OIP-C.jdP04yEoxG10mcywseQj7gAAAA?w=140&h=180&c=7&r=0&o=5&dpr=2&pid=1.7',
        true
      )

      // 设置 responseType 为 "arraybuffer" 来接收二进制数据
      xhr.responseType = 'arraybuffer'

      // 定义 onload 事件处理器
      xhr.onload = function () {
        if (xhr.status === 200) {
          // 如果请求成功
          // 获取 ArrayBuffer 对象
          // var arrayBuffer = xhr.response
          console.log('请求成功')

          // 可以使用 Blob 和 URL.createObjectURL 来创建一个临时链接查看图片
          // var blob = new Blob([arrayBuffer], { type: 'image/jpeg' })
          // var imageUrl = URL.createObjectURL(blob)

          // // 在页面上显示图片
          // var imgElement = document.createElement('img')
          // imgElement.src = imageUrl
          // document.body.appendChild(imgElement) // 将图片添加到文档中
        } else {
          console.error('请求失败，状态码：', xhr.status)
        }
      }

      // 发送请求
      xhr.send()
    },
    onClickFetchGetImg() {
      // URL of the image
      const imageUrl =
        'https://tse1-mm.cn.bing.net/th/id/OIP-C.jdP04yEoxG10mcywseQj7gAAAA?w=140&h=180&c=7&r=0&o=5&dpr=2&pid=1.7'

      // 使用 fetch 发起 GET 请求
      fetch(imageUrl)
        .then(response => {
          // 确保请求成功
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          // 获取响应体作为 ArrayBuffer
          return response.arrayBuffer()
        })
        .then(arrayBuffer => {
          // 创建 Blob 对象
          const blob = new Blob([arrayBuffer], { type: 'image/jpeg' })

          // 创建对象 URL
          const imageUrl = URL.createObjectURL(blob)

          // 创建 img 元素并设置 src 属性
          const imgElement = document.createElement('img')
          imgElement.src = imageUrl

          // 将图片添加到文档中
          document.body.appendChild(imgElement)
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error)
        })
    },
    onClickFetchGet() {
      this.sendMessage()

      fetch(`/getList?test=123`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res)
        .then(res => {
          console.log('featch-res', res)
        })
    },
    onClickFetchPost() {
      this.sendMessage()

      fetch('/setList', {
        method: 'POST',
        body: JSON.stringify({ test: '测试请求体' }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res)
        .then(res => {
          console.log('featch-res', res)
        })
    },
    onClickFetchGetError() {
      this.sendMessage()

      const params = new URLSearchParams()
      params.append('page', '1')
      params.append('limit', '10')

      fetch(`/getList2?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res)
        .then(res => {
          console.log('featch-res', res)
        })
    },
    onClickFetchPostError() {
      this.sendMessage()

      fetch('/setList2', {
        method: 'POST',
        body: JSON.stringify({ test: '测试请求体' }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res)
        .then(res => {
          console.log('featch-res', res)
        })
    },
    getAllTracingList() {
      axios
        .get('/getAllTracingList', { params: { eventType: 'performance' } })
        .then(res => {
          const successList = res.data.data.filter(
            item => item.eventId === 'server'
          )
          axios
            .get('/getAllTracingList', { params: { eventType: 'error' } })
            .then(res => {
              const errorList = res.data.data.filter(
                item => item.eventId === 'server'
              )
              this.tracingInfo.data = errorList.concat(successList)
              this.selfMessage('成功查询最新数据 - 请求事件')
            })
        })
    }
  }
}
</script>

<style lang="scss"></style>
