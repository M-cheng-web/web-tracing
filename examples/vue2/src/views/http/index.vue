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
      <el-button type="success" plain @click="onClickAxios">
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
            { label: '请求方式', prop: 'requestMethod' },
            { label: '当前页面URL', prop: 'triggerPageUrl', width: '200' },
            { label: '请求返回代码', prop: 'responseStatus', width: '100' },
            { label: '请求消耗时间', prop: 'duration', width: '100' },
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
            { label: '错误信息', prop: 'errMessage' },
            { label: '事件参数', prop: 'params' }
          ]
        }
      }
    }
  },
  mounted() {
    this.getAllTracingList()
  },
  methods: {
    onClickAxios() {
      axios.get('/getList', { params: { test: 123 } }).then(res => {
        console.log('axios-res', res)
      })
    },
    onClickAxiosPost() {
      axios.post('/setList', { body: { test: 123 } }).then(res => {
        console.log('axios-res', res)
      })
    },
    onClickAxiosError() {
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
      const xhr = new XMLHttpRequest()
      const params = { username: 'example', password: '123456' }
      xhr.open('get', '/getList?test=123')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send(JSON.stringify(params))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log('xhr-res', xhr.responseText)
        }
      }
    },
    onClickXhrPost() {
      const xhr = new XMLHttpRequest()
      const params = { username: 'example', password: '123456' }
      xhr.open('post', '/setList')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send(JSON.stringify(params))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log('xhr-res', xhr.responseText)
        }
      }
    },
    onClickXhrGetError() {
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
      const params = { username: 'example', password: '123456' }
      const xhr = new XMLHttpRequest()
      xhr.open('post', '/setList2')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send(JSON.stringify(params))
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log('xhr-res', xhr.responseText)
        }
      }
    },
    onClickFetchGet() {
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
              this.$message({
                message: '成功查询最新数据 - 请求事件',
                type: 'success',
                duration: 1000
              })
            })
        })
    }
  }
}
</script>

<style lang="scss"></style>
