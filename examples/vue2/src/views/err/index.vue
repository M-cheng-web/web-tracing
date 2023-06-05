<template>
  <div class="err">
    <div class="err-btns">
      <el-button type="danger" plain @click="codeError">代码错误</el-button>
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
  </div>
</template>

<script>
import { traceError } from '@web-tracing/core'

export default {
  data() {
    return {
      showImg: false,
      showAudio: false,
      showVideo: false
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
