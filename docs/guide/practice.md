# 最佳实践

针对不用平台，这边粗略讲解如何快速上手，具体各个配置的含义请翻阅 [使用](../guide/use/declare.md) 文档

也可以直接运行配套的 `示例项目`

## html & js
[完整示例项目 https://github.com/M-cheng-web/web-tracing-examples-js](https://github.com/M-cheng-web/web-tracing-examples-js)

index.html
``` html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>example-vanilla</title>
  </head>
  <body style="height: 2000px">
    <script type="module" src="/main.ts"></script>
    <div id="app"></div>
    <div>
      <div>Event 点击事件捕捉</div>
      <div
        style="border: 1px solid green; height: 200px; padding: 10px"
        class="sss xxx 111 vvv"
        data-warden-title="xxx"
        data-warden-bigTitle="bigTitle"
        width="100%"
        id="222"
        sdfasd
      >
        <div
          style="border: 1px solid red; height: 100px; padding: 10px"
          data-warden-test="test"
          data-warden-title="titletitle"
          data-warden-bing="bing"
          data-warden-event-id="ddd"
        >
          <div style="border: 1px solid rgb(71, 1, 236)">asdasdasd</div>
        </div>
        <div data-warden-id="我是ID">
          <button value="xxxxxx" ref="bun">1111</button>
        </div>
      </div>
    </div>
    <br />

    <div>
      <div>Error 捕捉</div>
      <button id="codeErr">代码错误</button>
      <button id="codeErr" onclick="codeError()">代码错误</button>
      <button id="promiseError" onclick="promiseError()">promiseError</button>
      <button id="consoleErr" onclick="consoleErr()">手动输出错误</button>
    </div>
    <script>
      // ---------------- Error 捕捉 ----------------
      document.getElementById("codeErr")?.addEventListener("click", () => {
        codeError();
      });

      function codeError() {
        const a = {};
        a.split("/");
      }
      function promiseError() {
        const promiseWrap = () =>
          new Promise((resolve, reject) => {
            reject("promise reject");
          });
        promiseWrap().then((res) => {
          console.log("res", res);
        });
      }
      function consoleErr() {
        console.error("consoleErr1", "consoleErr1.1", "consoleErr1.2");
        // console.error(111);
        // console.error(new Error("谢谢谢谢谢"));
      }
    </script>
  </body>
</html>
```

index.js
``` js
import {
  init,
  beforePushEventList,
  beforeSendData,
  afterSendData,
  getBaseInfo,
  getFirstScreen,
  getIPs
} from '@web-tracing/core'

start()

beforePushEventList(data => {
  console.log('-----------beforePushEventList--0', data)
  return data
})

setTimeout(() => {
  beforePushEventList(data => {
    console.log('-----------beforePushEventList1', data)
    return data
  })
  beforePushEventList(data => {
    console.log('-----------beforePushEventList2', data)
    return data
  })
  beforeSendData(data => {
    console.log('-----------beforeSendData1', data)
    return data
  })
  beforeSendData(data => {
    console.log('-----------beforeSendData2', data)
    return data
  })
  afterSendData(data => {
    console.log('-----------afterSendData1', data)
  })
  afterSendData(data => {
    console.log('-----------afterSendData2', data)
  })
  console.log('getBaseInfo', getBaseInfo())
  console.log('getFirstScreen', getFirstScreen())
}, 2000)

// 手动发送错误
setTimeout(() => {
  traceError('自定义错误ID', '自定义错误message', {
    src: '/interface/order',
    params: {
      id: '12121'
    }
  })
}, 3000)

// 手动发送资源事件
setTimeout(() => {
  tracePerformance('自定义ID', {
    params: {
      param1: 'param1222',
      param2: 'param2',
      param3: 'param3'
    }
  })
}, 3000)

// 手动发送点击事件
setTimeout(() => {
  traceCustomEvent('自定义ID', '自定义事件标题', {
    params: {
      params1: 'params1',
      params2: 'params2',
      params3: 'params3'
    }
  })
}, 3000)

// 手动发送pv事件
setTimeout(() => {
  tracePageView({
    url: '自定义URL',
    referer: '自定义上级URL',
    params: { name: '自定义name' },
    actions: 'reserved'
  })
}, 3000)

function start() {
  init({
    dsn: 'http://1.15.224.10:22/trackweb/tra',
    appName: 'cxh',
    debug: true,
    pv: true,
    performance: true,
    error: true,
    event: true,
    // localization: true,
    cacheMaxLength: 10,
    cacheWatingTime: 1000,
    userUuid: 'init_userUuid',

    scopeError: true,

    // tracesSampleRate: 0.5,

    // ignoreErrors: ['111', /^promise/, /.*split is not .* function/],
    // ignoreRequest: ['111', /normal/],

    beforePushEventList(data) {
      // console.log('beforePushEventList-data', data)
      return data
    },
    beforeSendData(data) {
      // console.log('beforeSendData-data', data)
      // return { xx: 2123 }
      // 返回false代表sdk不再发送
      // return false
      return data
    },
    afterSendData(data) {
      // console.log('afterSendData-data', data)
    }
  })
}
```

## vue2
[完整示例项目 https://github.com/M-cheng-web/web-tracing-examples-vue2](https://github.com/M-cheng-web/web-tracing-examples-vue2)

main.js
``` js
import Vue from 'vue'
import App from './App.vue'
import WebTracing from '@web-tracing/vue2'

Vue.use(WebTracing, {
  dsn: '/trackweb',
  appName: 'cxh',
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true,
  // localization: true,
  cacheMaxLength: 10,
  cacheWatingTime: 1000,
  userUuid: 'init_userUuid',

  scopeError: true,

  // tracesSampleRate: 0.5,

  // ignoreErrors: ['111', /^promise/, /.*split is not .* function/],
  ignoreRequest: [/getAllTracingList/, /cleanTracingList/],

  beforePushEventList(data) {
    const arr = ['intersection', 'click']
    data.forEach(item => {
      if (arr.includes(item.eventType)) {
        window.vm.sendMessage()
      }
    })
    return data
  },
  beforeSendData(data) {
    // 返回false代表sdk不再发送
    // axios.post('/trackweb', data)
    // return false
    return data
  },
  afterSendData(data) {
    const { sendType, success, params } = data
    const message = `
      <div class='event-pop'>
        <div class='warning-text'>打开控制台可查看更多详细信息</div>
        <div>发送是否成功: ${success}</div>
        <div>发送方式: ${sendType}</div>
        <div>发送内容(只概括 eventType、eventId)
          ${params.eventInfo.reduce(
            (pre, item, index) => {
              pre += `
              <div class='pop-line'>
                <span>${index + 1}</span>
                <div>${item.eventType}(${sendEventType[item.eventType]})</div>
                <div>${item.eventId}</div>
              </div>`
              return pre
            },
            `<div class='pop-line'>
              <div>eventType</div>
              <div>eventId</div>
            </div>`
          )}
        </div>
      </div>
    `
    alert(message)
  }
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
```

intersection.vue (这里挑一个代表性的功能页面 - 元素曝光检测页面)
``` js
<template>
  <div class="intersection">
    <div>
      <el-button
        class="mb"
        type="danger"
        plain
        @click="_intersectionDisconnect"
      >
        取消所有采集曝光
      </el-button>
    </div>
    <el-button type="success" plain @click="_intersectionObserver('target')">
      采集此图片的曝光
    </el-button>
    <el-button type="danger" plain @click="_intersectionUnobserve('target')">
      取消此图片的曝光采集
    </el-button>
    <div id="target" class="mb">
      <img
        src="https://aecpm.alicdn.com/simba/img/TB183NQapLM8KJjSZFBSutJHVXa.jpg"
      />
    </div>
    <div class="mb">
      <div>----------- 分割线 -----------</div>
      <div>----------- 分割线 -----------</div>
      <div>----------- 分割线 -----------</div>
    </div>
    <el-button type="success" plain @click="_intersectionObserver('target2')">
      采集此图片的曝光
    </el-button>
    <el-button type="danger" plain @click="_intersectionUnobserve('target2')">
      取消此图片的曝光采集
    </el-button>
    <div id="target2" class="mb">
      <img
        src="https://aecpm.alicdn.com/simba/img/TB183NQapLM8KJjSZFBSutJHVXa.jpg"
      />
    </div>

    <el-button type="primary" @click="getAllTracingList">
      获取最新采集数据
    </el-button>
  </div>
</template>

<script>
import axios from 'axios'
import {
  intersectionObserver,
  intersectionUnobserve,
  intersectionDisconnect
} from '@web-tracing/vue2'

export default {
  data() {
    return {
      tracingInfo: {
        data: [],
        table: {
          config: [
            { label: '序号', prop: 'index', width: '50', isTemplate: true },
            { label: '事件类型', prop: 'eventType' },
            { label: '当前页面URL', prop: 'triggerPageUrl', width: '200' },
            // { label: '元素', prop: 'target' },
            { label: '监听阈值', prop: 'threshold' }, // 阀值默认为0.5，当只有比例达到一半时才触发回调函数
            {
              label: '开始监视时间',
              prop: 'observeTime',
              isTemplate: true,
              width: '140'
            },
            {
              label: '开始暴露时间',
              prop: 'showTime',
              isTemplate: true,
              width: '140'
            },
            {
              label: '结束暴露时间',
              prop: 'showEndTime',
              isTemplate: true,
              width: '140'
            },
            {
              label: '事件发送时间',
              prop: 'sendTime',
              isTemplate: true,
              width: '140'
            },
            { label: '参数', prop: 'params', width: '300' }
          ]
        }
      }
    }
  },
  mounted() {
    this.getAllTracingList()
  },
  methods: {
    _intersectionObserver(str) {
      this.sendMessage('成功采集，请滑动页面测试')

      const target = document.querySelector(`#${str}`)
      intersectionObserver({
        target,
        threshold: 0.5, // 曝光的临界点 (0.5表示移入窗口一半算做开始曝光、移出窗口一半算结束曝光)
        params: { name: 1111, targetName: str } // 附带的额外参数
      })
    },
    _intersectionUnobserve(str) {
      this.sendMessage('取消了采集，请滑动页面测试')

      const target = document.querySelector(`#${str}`)
      intersectionUnobserve(target)
    },
    _intersectionDisconnect() {
      this.sendMessage('取消了采集，请滑动页面测试')

      intersectionDisconnect()
    },
    getAllTracingList() {
      axios
        .get('/getAllTracingList', { params: { eventType: 'intersection' } })
        .then(res => {
          const successList = res.data.data
          this.tracingInfo.data = successList
          this.selfMessage('成功查询最新数据 - 曝光采集事件')
        })
    }
  }
}
</script>
```

## vue3
[完整示例项目 https://github.com/M-cheng-web/web-tracing-examples-vue3](https://github.com/M-cheng-web/web-tracing-examples-vue3)

main.ts
``` ts
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import WebTracing from '@web-tracing/vue3'
import router from './router'
import './assets/global.scss'
import initComponents from './components/index'
import { ElNotification } from 'element-plus'

const app = createApp(App)

const sendEventType: any = {
  pv: '路由',
  error: '错误',
  performance: '资源',
  click: '点击',
  dwell: '页面卸载',
  intersection: '曝光采集'
}

app.use(WebTracing, {
  dsn: '/trackweb',
  appName: 'cxh',
  debug: true,
  pv: true,
  performance: true,
  error: true,
  event: true,
  cacheMaxLength: 10,
  cacheWatingTime: 1000,

  // 查询埋点信息、清除埋点信息、获取埋点基础信息 不需要进行捕获
  ignoreRequest: [
    /getAllTracingList/,
    /cleanTracingList/,
    /getBaseInfo/,
    /getSourceMap/
  ],

  // 发送埋点数据后，拉起弹窗提示用户已发送
  afterSendData(data) {
    const { sendType, success, params } = data
    const message = `
      <div class='event-pop'>
        <div class='warning-text'>打开控制台可查看更多详细信息</div>
        <div>发送是否成功: ${success}</div>
        <div>发送方式: ${sendType}</div>
        <div>发送内容(只概括 eventType、eventId)
          ${params.eventInfo.reduce(
            (pre: string, item: any, index: number) => {
              pre += `
              <div class='pop-line'>
                <span>${index + 1}</span>
                <div>${item.eventType}(${sendEventType[item.eventType]})</div>
                <div>${item.eventId}</div>
              </div>`
              return pre
            },
            `<div class='pop-line'>
              <div>eventType</div>
              <div>eventId</div>
            </div>`
          )}
        </div>
      </div>
    `
    ElNotification({
      title: '发送一批数据到服务端',
      message,
      position: 'top-right',
      dangerouslyUseHTMLString: true
    })
    // @ts-ignore
    if (window.getAllTracingList) {
      // @ts-ignore
      window.getAllTracingList()
    }
  }
})

app.use(router)
app.use(initComponents)
app.use(ElementPlus)
app.mount('#app')
```

err.vue (这里挑一个代表性的功能页面 - 错误检测页面)
``` ts
<template>
  <div class="err">
    <el-tabs v-model="activeName">
      <el-tab-pane label="普通错误事件" name="first">
        <div class="mb">
          <el-button id="codeErr" type="danger" plain @click="codeError">
            代码错误
          </el-button>
          <el-button type="danger" plain @click="promiseError">
            Promise-错误
          </el-button>
          <el-button type="danger" plain @click="consoleErr">
            console-错误
          </el-button>
          <el-button type="danger" plain @click="sendBizErr">
            手动上报自定义错误
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资源错误事件" name="second">
        <div class="mb resource">
          <el-button type="danger" plain @click="showImgTrue = true">
            加载错误图片
          </el-button>
          <img v-if="showImgTrue" src="https://www.baidu.com/as.webp" />
          <el-button type="success" plain @click="showImgFalse = true">
            加载正常图片
          </el-button>
          <img
            v-if="showImgFalse"
            src="https://cdn.staticaly.com/gh/M-cheng-web/image-provider@main/web-tracing/Annapurna-Ranges-2560x1440.tq4fx9hd9gg.webp"
          />
        </div>
        <div class="mb resource">
          <el-button type="danger" plain @click="showAudioTrue = true">
            加载错误音频
          </el-button>
          <audio
            v-if="showAudioTrue"
            src="https://someaudio.wav"
            controls
          ></audio>
          <el-button type="success" plain @click="showAudioFalse = true">
            加载正常音频
          </el-button>
          <audio
            v-if="showAudioFalse"
            controls
            src="https://www.cambridgeenglish.org/images/153149-movers-sample-listening-test-vol2.mp3"
          ></audio>
        </div>
        <div class="mb resource">
          <el-button type="danger" plain @click="showVideoTrue = true">
            加载错误视频
          </el-button>
          <video
            v-if="showVideoTrue"
            src="https://str39/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4"
          ></video>
          <!-- controls="controls" -->
          <el-button type="success" plain @click="showVideoFalse = true">
            加载正常视频
          </el-button>
          <video
            v-if="showVideoFalse"
            src="https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4"
          ></video>
        </div>
      </el-tab-pane>
      <el-tab-pane label="批量错误事件" name="third">
        <div class="mb">
          <el-button type="danger" plain @click="batchErrorA(10)">
            立即触发代码错误-10条
          </el-button>
          <el-button type="danger" plain @click="batchErrorA(100)">
            立即触发代码错误-100条
          </el-button>
        </div>

        <div class="mb">
          <el-button type="danger" plain @click="batchErrorAT(20)">
            异步触发代码错误-20条
          </el-button>
          <el-button type="danger" plain @click="batchErrorAT(100)">
            异步触发代码错误-100条
          </el-button>
        </div>

        <div class="mb">
          <el-button type="danger" plain @click="batchErrorB(10)">
            立即触发【reject-10条 + 代码错误-10条 + console.error-10条】
          </el-button>
          <el-button type="danger" plain @click="batchErrorB(20)">
            立即触发【reject-20条 + 代码错误-20条 + console.error-20条】
          </el-button>
        </div>

        <div class="mb">
          <el-button type="danger" plain @click="batchErrorC(10)">
            异步触发【reject-10条 + 代码错误-10条 + console.error-10条】
          </el-button>
          <el-button type="danger" plain @click="batchErrorD()">
            异步触发无限错误
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

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
      <template v-slot:batchErrorLastHappenTime="{ scope }">
        {{ `${formatDate(scope.row.batchErrorLastHappenTime)}` }}
      </template>
      <template v-slot:actions="{ scope }">
        <el-button type="primary" @click="lookRecordscreen(scope.row)">
          查看错误录屏
        </el-button>
        <!-- <el-button type="primary" @click="lookSourceMap(scope.row)">
          查看错误源文件
        </el-button> -->
      </template>
    </c-table>

    <el-dialog
      v-model="errDialogVisible"
      width="1024px"
      top="10vh"
      :show-close="false"
    >
      <div id="recordscreen" v-if="errDialogVisible"></div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { traceError, unzipRecordscreen } from '@web-tracing/vue3'
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'
import { ref, reactive, onMounted, inject, nextTick } from 'vue'
// import { findCodeBySourceMap } from '../../utils/sourcemap'

const formatDate = inject('formatDate', Function, true)
const sendMessage = inject('sendMessage', Function, true)
const emitMessage = inject('emitMessage', Function, true)
const selfMessage = inject('selfMessage', Function, true)

onMounted(() => {
  // @ts-ignore
  window.getAllTracingList = getAllTracingList
  getAllTracingList()
})

const activeName = ref('first')
const showImgTrue = ref(false)
const showImgFalse = ref(false)
const showAudioTrue = ref(false)
const showAudioFalse = ref(false)
const showVideoTrue = ref(false)
const showVideoFalse = ref(false)
const errDialogVisible = ref(false)

const tracingInfo = reactive({
  data: [],
  table: {
    config: [
      { label: '序号', prop: 'index', width: '50', isTemplate: true },
      { label: '事件ID', prop: 'eventId' },
      { label: '事件类型', prop: 'eventType', width: '100' },
      { label: '当前页面URL', prop: 'triggerPageUrl', width: '160' },
      {
        label: '事件发送时间',
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
      { label: '完整错误信息', prop: 'errStack', width: '140' },
      { label: '错误行', prop: 'line' },
      { label: '错误列', prop: 'col' },
      { label: '是否为批量错误', prop: 'batchError' },
      {
        label: '批量错误最后发生时间',
        prop: 'batchErrorLastHappenTime',
        width: '140',
        isTemplate: true
      },
      { label: '批量错误-错误个数', prop: 'batchErrorLength' },
      { label: '资源请求链接', prop: 'requestUrl', width: '100' },
      { label: '参数', prop: 'params' },
      {
        label: '操作',
        prop: 'actions',
        width: '300',
        isTemplate: true
      }
    ]
  }
})

function codeError() {
  sendMessage()

  const a = {}
  a.split('/')
}
function promiseError() {
  sendMessage()

  const promiseWrap = () =>
    new Promise((resolve, reject) => {
      reject('promise reject')
    })
  promiseWrap().then(res => {
    console.log('res', res)
  })
}
function consoleErr() {
  sendMessage()

  console.error('consoleErr1', 'consoleErr1.1', 'consoleErr1.2')
}
function sendBizErr() {
  sendMessage()

  traceError({
    eventId: '自定义错误ID',
    errMessage: '自定义错误message',
    src: '/interface/order',
    params: {
      id: '12121'
    }
  })
  emitMessage()
}

// ------- 批量错误 -------
function batchErrorA(num: number) {
  for (let x = 1; x <= num; x++) {
    document.getElementById('codeErr')?.click()
  }
}
function batchErrorAT(num: number) {
  for (let x = 1; x <= num; x++) {
    setTimeout(() => {
      document.getElementById('codeErr')?.click()
    }, x * 300)
  }
}
function batchErrorB(num: number) {
  for (let x = 1; x <= num; x++) {
    document.getElementById('codeErr')?.click()
    consoleErr()
    promiseError()
  }
}
function batchErrorC(num: number) {
  for (let x = 1; x <= num; x++) {
    setTimeout(() => {
      batchErrorB(1)
    }, x * 300)
  }
}
function batchErrorD() {
  setInterval(() => {
    document.getElementById('codeErr')?.click()
  }, 200)
}

function lookRecordscreen(row: any) {
  errDialogVisible.value = true
  row.recordscreen = unzipRecordscreen(row.recordscreen)
  nextTick(() => {
    console.log('xxx', document.getElementById('recordscreen'))
    new rrwebPlayer({
      target: document.getElementById('recordscreen')!,
      props: {
        events: row.recordscreen,
        UNSAFE_replayCanvas: true
      }
    })
  })
}

// ------- 查看错误 -------
function getAllTracingList() {
  axios
    .get('/getAllTracingList', { params: { eventType: 'error' } })
    .then(res => {
      tracingInfo.data = res.data.data
      selfMessage('成功查询最新数据 - 错误事件')
    })
}
</script>
```