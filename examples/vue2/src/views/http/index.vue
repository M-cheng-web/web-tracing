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
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app.vue',
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
    }
  }
}
</script>

<style lang="scss">
.group {
  margin-bottom: 30px;
}
</style>
