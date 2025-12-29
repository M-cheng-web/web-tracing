<template>
  <div class="err">
    <el-tabs v-model="activeName">
      <el-tab-pane label="普通错误事件" name="first">
        <div class="mb">
          <el-alert
            type="warning"
            title="错误事件的捕获会有延迟，特别是在开启了批量错误的情况下，一般会有2s延迟"
            :closable="false"
            class="mb"
          >
          </el-alert>

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
          <el-button type="danger" plain @click="openX">
            开启错误录屏功能
          </el-button>
          <el-button type="danger" plain @click="closeX">
            关闭错误录屏功能
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资源错误事件" name="second">
        <el-alert
          type="warning"
          title="加载资源如果发生错误会产生两个事件："
          :closable="false"
          class="mb"
        >
          <template #default>
            <div>1.资源本身请求的事件</div>
            <div>
              2.针对此次错误请求的错误事件（目前加载资源的错误无法拿到，例如404）
            </div>
            <div>
              3.资源的错误加载没有明确字段表示，但会在err模块被监听捕获，所以要在管理端筛选
            </div>
          </template>
        </el-alert>
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
        <el-alert
          type="warning"
          title="开启了批量错误【scopeError：true】会导致所有错误有2s延迟，针对批量错误还会有20s的轮询"
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-alert
          type="warning"
          title="具体要查看是否发送了错误可以打开控制台的打印信息"
          :closable="false"
          style="margin-bottom: 20px"
        />
        <el-alert
          type="success"
          title="捕获批量错误原理"
          :closable="false"
          style="margin-bottom: 20px"
        >
          <template #default>
            <div>1. 先把所有错误都放入 a错误栈</div>
            <div>
              2. 每次发生错误后防抖 2s查
              a栈是否有批量错误(批量错误:errMessage、errType相同且发生个数大于等于5)
              <div style="padding-left: 20px">
                1.
                如果为批量错误则合并这些错误并加入[时间区间参数、发生个数参数]后放入
                b栈
              </div>
              <div style="padding-left: 20px">
                2. 不为批量错误则发送这些错误
              </div>
            </div>
            <div>
              3.资源的错误加载没有明确字段表示，但会在err模块被监听捕获，所以要在管理端筛选
            </div>
            <div>4. 每次推入错误到b栈后延迟 20s查 b栈并发送这些错误</div>
            <div>
              5. 在这个过程中，如果用户关闭了网页，会统一把 a栈、b栈内的数据发送
            </div>
            <div>
              6.
              在这个过程中，a栈每满50个错误也会强制触发a栈和b栈的错误处理（处理结果为直接发送批量错误）
            </div>
          </template>
        </el-alert>

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
      <template #index="{ scope }">
        {{ `${scope.index + 1}` }}
      </template>
      <template #sendTime="{ scope }">
        {{ `${formatDate(scope.row.sendTime)}` }}
      </template>
      <template #triggerTime="{ scope }">
        {{ `${formatDate(scope.row.triggerTime)}` }}
      </template>
      <template #batchErrorLastHappenTime="{ scope }">
        {{ `${formatDate(scope.row.batchErrorLastHappenTime)}` }}
      </template>
      <template #actions="{ scope }">
        <el-button type="primary" @click="lookRecordscreen(scope.row)">
          查看错误录屏
        </el-button>
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
import { traceError, unzipRecordscreen, options } from '@web-tracing/core'
import { ref, reactive, onMounted, inject, nextTick } from 'vue'

const formatDate = inject('formatDate', Function, true)
const sendMessage = inject('sendMessage', Function, true)
const emitMessage = inject('emitMessage', Function, true)
const selfMessage = inject('selfMessage', Function, true)

onMounted(() => {
  // 只在客户端环境下设置 window 对象
  if (import.meta.client) {
    // @ts-ignore
    window.getAllTracingList = getAllTracingList
  }
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

  const a: any = {}
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

function openX() {
  if (options.value.recordScreen) {
    emitMessage('已经打开错误录屏了，不用重复打开')
  } else {
    options.value.recordScreen = true
    emitMessage('成功打开错误录屏')
  }
}
function closeX() {
  if (options.value.recordScreen) {
    options.value.recordScreen = false
    emitMessage('关闭成功')
  } else {
    emitMessage('已经关闭错误录屏了，不用重复关闭')
  }
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

async function lookRecordscreen(row: any) {
  errDialogVisible.value = true
  row.recordscreen = unzipRecordscreen(row.recordscreen)

  // 动态导入 rrweb-player，避免 SSR 错误
  if (import.meta.client) {
    const rrwebPlayer = (await import('rrweb-player')).default
    await import('rrweb-player/dist/style.css')

    nextTick(() => {
      new rrwebPlayer({
        target: document.getElementById('recordscreen')!,
        props: {
          events: row.recordscreen,
          UNSAFE_replayCanvas: true
        }
      })
    })
  }
}

// ------- 查看错误 -------
function getAllTracingList() {
  $fetch('/getAllTracingList', { params: { eventType: 'error' } })
    .then((res: any) => {
      tracingInfo.data = (res as any).data
      selfMessage('成功查询最新数据 - 错误事件')
    })
}
</script>

<style scoped lang="scss">
.err {
  :deep(.el-dialog__header),
  :deep(.el-dialog__body) {
    padding: 0;
  }
  .el-tab-pane {
    min-height: 300px;
  }
  .resource {
    display: flex;
    width: 800px;
    .el-button {
      height: 32px;
      margin-right: 10px;
    }
    img {
      display: block;
      width: 200px;
      height: 200px;
      margin-right: 20px;
    }
    video {
      display: block;
      width: 200px;
      height: 200px;
      margin-right: 20px;
    }
    audio {
      display: block;
      width: 200px;
      height: 200px;
      border: 1px solid red;
      margin-right: 20px;
    }
  }
}
</style>
