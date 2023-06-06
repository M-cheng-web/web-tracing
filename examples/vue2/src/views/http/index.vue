<template>
  <div>
    <div class="group">
      <el-button type="primary" plain @click="onClickAxios">
        axios正常请求
      </el-button>
      <el-button type="danger" plain @click="onClickAxiosError">
        axios异常请求
      </el-button>
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
      axios.get('/reportData/123')
    },
    onClickAxiosError() {
      axios.post('http://localhost:13132/blackAccountCustScanCaseStatus', {
        body: { id: 11 }
      })
    },
    onClickXhr() {
      const xhr = new XMLHttpRequest()
      xhr.open('get', '/normal')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send()
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // console.log('请求成功', xhr.responseText.slice(0, 10))
        }
      }
    },
    onClickXhrError() {
      const xhr = new XMLHttpRequest()
      xhr.open('post', '/api/order')
      xhr.setRequestHeader('content-type', 'application/json')
      xhr.send()
      xhr.onreadystatechange = function () {
        //
      }
    },
    onClickFetch() {
      // fetch('/api/order', {
      //   method: 'post',
      //   body: JSON.stringify({ id: 123 })
      // })
      fetch(`/index.html?t=${Date.now()}`, {
        method: 'POST',
        body: JSON.stringify({ test: '测试请求体' }),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res)
        .then(() => {
          // console.log('res----res', res)
        })

      // fetch('/normal/post', {
      //   method: 'POST',
      //   body: JSON.stringify({ test: '测试请求体' }),
      //   mode: 'cors',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })
      //   .then(res => res.text())
      //   .then(res => {
      //     console.log('res----res', res)
      //   })
      // .catch(err => console.log('err----err', err))
    },
    onClickFetchError() {
      fetch('/exception/post', {
        method: 'POST',
        body: JSON.stringify({ test: '测试请求体' }),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.text())
        .then(
          res => {
            console.log('res', res)
          },
          err => {
            console.log('err', err)
          }
        )
    }
  }
}
</script>

<style lang="scss">
.group {
  margin-bottom: 30px;
}
</style>
