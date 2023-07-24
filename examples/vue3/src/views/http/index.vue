<template>
  <div>
    <div class="mb">
      <el-alert type="warning" title="注意" :closable="false" class="mb">
        <div>
          axios的错误请求需要手动加上cache，否则错误会暴露导致错误模块会监听到此错误，从而造成错误的重复
        </div>
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

<script lang="ts" setup>
import axios from 'axios'
import { ref, onMounted, inject } from 'vue'

onMounted(() => {
  // @ts-ignore
  window.getAllTracingList = getAllTracingList
  getAllTracingList()
})

const sendMessage = inject('sendMessage', Function, true)
const selfMessage = inject('selfMessage', Function, true)
const formatDate = inject('formatDate', Function, true)

const tracingInfo = ref({
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
})

function onClickAxiosGet() {
  sendMessage()

  axios.get('/getList', { params: { test: 123 } }).then(res => {
    console.log('axios-res', res)
  })
}
function onClickAxiosPost() {
  sendMessage()

  axios.post('/setList', { test: 123 }).then(res => {
    console.log('axios-res', res)
  })
}
function onClickAxiosError() {
  sendMessage()

  axios
    .get('/getList2', { params: { test: 123 } })
    .then(res => {
      console.log('axios-res', res)
    })
    .catch(err => {
      console.log('axios-err', err)
    })
}
function onClickAxiosPostError() {
  sendMessage()

  axios
    .post('/setList2', { test: 123 })
    .then(res => {
      console.log('axios-res', res)
    })
    .catch(err => {
      console.log('axios-err', err)
    })
}
function onClickXhrGet() {
  sendMessage()

  const xhr = new XMLHttpRequest()
  xhr.open('get', '/getList?test=123')
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log('xhr-res', xhr.responseText)
    }
  }
}
function onClickXhrPost() {
  sendMessage()

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
}
function onClickXhrGetError() {
  sendMessage()

  const xhr = new XMLHttpRequest()
  xhr.open('get', '/getList2?test=123')
  xhr.setRequestHeader('content-type', 'application/json')
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log('xhr-res', xhr.responseText)
    }
  }
}
function onClickXhrPostError() {
  sendMessage()

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
}
function onClickFetchGet() {
  sendMessage()

  fetch(`/getList?test=123`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => {
      console.log('featch-res', res)
    })
}
function onClickFetchPost() {
  sendMessage()

  fetch('/setList', {
    method: 'POST',
    body: JSON.stringify({ test: '测试请求体' }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => {
      console.log('featch-res', res)
    })
}
function onClickFetchGetError() {
  sendMessage()

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
}
function onClickFetchPostError() {
  sendMessage()

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
}
function getAllTracingList() {
  axios
    .get('/getAllTracingList', { params: { eventType: 'performance' } })
    .then(res => {
      const successList = res.data.data.filter(
        (item: any) => item.eventId === 'server'
      )
      axios
        .get('/getAllTracingList', { params: { eventType: 'error' } })
        .then(res => {
          const errorList = res.data.data.filter(
            (item: any) => item.eventId === 'server'
          )
          tracingInfo.value.data = errorList.concat(successList)
          selfMessage('成功查询最新数据 - 请求事件')
        })
    })
}
</script>

<style lang="scss"></style>
