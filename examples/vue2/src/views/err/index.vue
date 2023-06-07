<template>
  <div class="err">
    <div class="err-btns">
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
    <div class="err-btns">
      <!-- 资源的错误加载没有明确字段表示，但会在err模块被监听捕获，所以要在管理端筛选 -->
      <div class="scope">
        <el-button type="danger" plain @click="showImg = true">
          加载错误图片
        </el-button>
        <img v-if="showImg" src="https://m9t5vg1g0.webp" />
        <!-- src="https://cdn.staticaly.com/gh/M-cheng-web/image-provider@main/web-tracing/Annapurna-Ranges-2560x1440.tq4fx9hd9gg.webp" -->
      </div>
      <div class="scope">
        <el-button type="danger" plain @click="showAudio = true">
          加载错误音频
        </el-button>
        <audio v-if="showAudio" src="https://someaudio.wav"></audio>
        <!-- https://www.cambridgeenglish.org/images/153149-movers-sample-listening-test-vol2.mp3 -->
      </div>
      <div class="scope">
        <el-button type="danger" plain @click="showVideo = true">
          加载错误视频
        </el-button>
        <video
          v-if="showVideo"
          src="https://str39/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4"
          controls="controls"
        ></video>
        <!-- https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4 -->
      </div>
    </div>

    <div>------------- 批量错误 -------------</div>
    <div style="margin-bottom: 20px">
      tip: 开启了批量错误【scopeError:
      true】会导致所有错误有2s延迟，针对批量错误还会有20s的轮询
    </div>
    <div style="margin-bottom: 20px">
      判断是否为批量错误:
      <br />
      1. 先把所有错误都放入 a栈
      <br />
      2. 每次发生错误后防抖 2s查 a栈是否有批量错误(批量错误:
      errMessage、errType相同且发生个数大于等于5)
      <br />
      <div style="padding-left: 20px">
        1. 如果为批量错误则合并这些错误并加入[时间区间参数、发生个数参数]后放入
        b栈
      </div>
      <br />
      <div style="padding-left: 20px">2. 不为批量错误则发送这些错误</div>
      <br />
      3. 每次推入错误到b栈后延迟 20s查 b栈并发送这些错误
      <br />
      4. 在这个过程中，如果用户关闭了网页，会统一把 a栈、b栈内的数据发送
      <br />
      5.
      在这个过程中，a栈每满50个错误也会强制触发a栈和b栈的错误处理（处理结果为直接发送批量错误）
    </div>
    <div>
      <el-button type="danger" plain @click="batchErrorA(10)">
        立即触发代码错误-10条
      </el-button>
      <el-button type="danger" plain @click="batchErrorA(100)">
        立即触发代码错误-100条
      </el-button>
      <br />
      <br />
      <el-button type="danger" plain @click="batchErrorAT(20)">
        异步触发代码错误-20条
      </el-button>
      <el-button type="danger" plain @click="batchErrorAT(100)">
        异步触发代码错误-100条
      </el-button>
      <br />
      <br />
      <el-button type="danger" plain @click="batchErrorB(10)">
        立即触发[reject-10条 + 代码错误-10条 + console.error-10条]
      </el-button>
      <br />
      <el-button type="danger" plain @click="batchErrorB(20)">
        立即触发[reject-20条 + 代码错误-20条 + console.error-20条]
      </el-button>
      <br />
      <br />
      <el-button type="danger" plain @click="batchErrorC(10)">
        异步触发[reject-10条 + 代码错误-10条 + console.error-10条]
      </el-button>
      <br />
      <br />
      <el-button type="danger" plain @click="batchErrorD()">
        异步触发无限错误
      </el-button>
    </div>

    <br />
    <div>------------- 查看错误 -------------</div>
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
import { traceError } from '@web-tracing/core'

export default {
  data() {
    return {
      showImg: false,
      showAudio: false,
      showVideo: false,
      tracingInfo: {
        data: [],
        table: {
          config: [
            { label: '序号', prop: 'index', width: '50', isTemplate: true },
            { label: '事件ID', prop: 'eventId' },
            { label: '事件类型', prop: 'eventType', width: '100' },
            { label: '当前页面URL', prop: 'url', width: '200' },
            { label: '发送时间', prop: 'sendTime', isTemplate: true },
            { label: '事件发生时间', prop: 'triggerTime', isTemplate: true },
            { label: '错误信息', prop: 'errMessage' },
            { label: '完整错误信息', prop: 'errStack' },
            { label: '错误行', prop: 'line' },
            { label: '错误列', prop: 'col' },
            { label: '参数', prop: 'params' }
          ]
        }
      }
    }
  },
  methods: {
    codeError() {
      const a = {}
      a.split('/')
    },
    promiseError() {
      const promiseWrap = () =>
        new Promise((resolve, reject) => {
          reject('promise reject')
        })
      promiseWrap().then(res => {
        console.log('res', res)
      })
    },
    consoleErr() {
      console.error('consoleErr1', 'consoleErr1.1', 'consoleErr1.2')
      // console.error(111);
      // console.error(new Error("谢谢谢谢谢"));
    },
    sendBizErr() {
      traceError('自定义错误ID', '自定义错误message', {
        src: '/interface/order',
        params: {
          id: '12121'
        }
      })
    },

    // ------- 批量错误 -------
    batchErrorA(num) {
      for (let x = 1; x <= num; x++) {
        document.getElementById('codeErr').click()
      }
    },
    batchErrorAT(num) {
      for (let x = 1; x <= num; x++) {
        setTimeout(() => {
          document.getElementById('codeErr').click()
        }, x * 300)
      }
    },
    batchErrorB(num) {
      for (let x = 1; x <= num; x++) {
        document.getElementById('codeErr').click()
        this.consoleErr()
        this.promiseError()
      }
    },
    batchErrorC(num) {
      for (let x = 1; x <= num; x++) {
        setTimeout(() => {
          this.batchErrorB(1)
        }, x * 300)
      }
    },
    batchErrorD() {
      setInterval(() => {
        document.getElementById('codeErr').click()
      }, 200)
    },

    // ------- 查看错误 -------
    getAllTracingList() {
      axios
        .get('/getAllTracingList', { params: { eventType: 'error' } })
        .then(res => {
          this.tracingInfo.data = res.data.data
        })
    }
  }
}
</script>

<style scoped lang="scss">
.err {
  .err-btns {
    margin-bottom: 20px;
    .scope {
      margin-bottom: 20px;
    }
  }
  img {
    display: block;
    width: 200px;
    height: 200px;
  }
  video {
    display: block;
    width: 500px;
    height: 500px;
  }
}
</style>
