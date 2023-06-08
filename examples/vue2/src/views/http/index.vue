<template>
  <div>
    <div class="group">
      <el-button type="primary" plain @click="onClickAxios">
        axios正常请求
      </el-button>
      <el-button type="danger" plain @click="onClickAxiosError">
        axios异常请求
      </el-button>
      <div>
        axios的错误请求需要手动加上
        cache，否则错误会暴露导致错误模块会监听到此错误，从而造成错误的重复
      </div>
    </div>
    <div class="group">
      <el-button type="primary" plain @click="onClickXhr">
        xhr正常请求
      </el-button>
      <el-button type="danger" plain @click="onClickXhrError">
        xhr异常请求
      </el-button>
    </div>
    <div class="group">
      <el-button type="primary" plain @click="onClickFetch">
        Fetch正常请求
      </el-button>
      <el-button type="danger" plain @click="onClickFetchError">
        Fetch异常请求
      </el-button>
    </div>

    <br />
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
            { label: '事件类型', prop: 'eventType', width: '100' },
            { label: '事件名', prop: 'title' },
            { label: '当前页面URL', prop: 'url', width: '200' },
            { label: '发送时间', prop: 'sendTime', isTemplate: true },
            { label: '事件发生时间', prop: 'triggerTime', isTemplate: true },
            { label: '事件参数', prop: 'params' },
            { label: '被点击元素的层级', prop: 'elementPath' },
            { label: '被点击元素与屏幕左边距离', prop: 'x' },
            { label: '被点击元素与屏幕上边距离', prop: 'y' }
          ]
        }
      }
    }
  },
  methods: {
    onClickAxios() {
      axios.get('/getList').then(res => {
        console.log('axios-res', res)
      })
    },
    onClickAxiosError() {
      axios
        .get('/getList2')
        .then(res => {
          console.log('axios-res', res)
        })
        .catch(err => {
          console.log('axios-err', err)
        })
    },
    onClickXhr() {
      const xhr = new XMLHttpRequest()
      xhr.open('get', '/getList')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log('xhr-res', xhr.responseText)
        }
      }
    },
    onClickXhrError() {
      const xhr = new XMLHttpRequest()
      xhr.open('get', '/getList2')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          console.log('xhr-res', xhr.responseText)
        }
      }
    },
    onClickFetch() {
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
    onClickFetchError() {
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
          this.tracingInfo.data = res.data.data
        })
    }
  }
}
</script>

<style lang="scss">
.group {
  margin-bottom: 30px;
}
</style>
