<template>
  <div class="intersection">
    <el-button @click="_intersectionDisconnect">取消所有采集曝光</el-button>
    <el-button @click="_intersectionObserver('target')">
      采集图片的曝光
    </el-button>
    <el-button @click="_intersectionUnobserve('target')">
      取消采集曝光
    </el-button>
    <div id="target">
      <img
        src="https://aecpm.alicdn.com/simba/img/TB183NQapLM8KJjSZFBSutJHVXa.jpg"
      />
    </div>
    <br />
    <el-button @click="_intersectionObserver('target2')">
      采集图片的曝光
    </el-button>
    <el-button @click="_intersectionUnobserve('target2')">
      取消采集曝光
    </el-button>
    <div id="target2">
      <img
        src="https://aecpm.alicdn.com/simba/img/TB183NQapLM8KJjSZFBSutJHVXa.jpg"
      />
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
      <template v-slot:observeTime="{ scope }">
        {{ `${formatDate(scope.row.observeTime)}` }}
      </template>
      <template v-slot:showTime="{ scope }">
        {{ `${formatDate(scope.row.showTime)}` }}
      </template>
      <template v-slot:showEndTime="{ scope }">
        {{ `${formatDate(scope.row.showEndTime)}` }}
      </template>
    </c-table>
  </div>
</template>

<script>
import axios from 'axios'
import {
  intersectionObserver,
  intersectionUnobserve,
  intersectionDisconnect
} from '@web-tracing/core'

export default {
  data() {
    return {
      //     target: Element
      // threshold: number
      // observeTime: number // sdk开始监视的时间
      // showTime?: number // sdk检测到的开始时间
      // showEndTime?: number // sdk检测到的结束时间
      // params?: AnyObj

      tracingInfo: {
        data: [],
        table: {
          config: [
            { label: '序号', prop: 'index', width: '50', isTemplate: true },
            { label: '事件类型', prop: 'eventType' },
            { label: '当前页面URL', prop: 'triggerPageUrl', width: '200' },
            { label: '元素', prop: 'target' },
            { label: '监听阈值', prop: 'threshold' }, // 阀值默认为0.5，当只有比例达到一半时才触发回调函数
            {
              label: '开始监视时间',
              prop: 'observeTime',
              isTemplate: true,
              width: '200'
            },
            {
              label: '开始暴露时间',
              prop: 'showTime',
              isTemplate: true,
              width: '200'
            },
            {
              label: '结束暴露时间',
              prop: 'showEndTime',
              isTemplate: true,
              width: '200'
            },
            { label: '参数', prop: 'params', width: '300' }
          ]
        }
      }
    }
  },
  methods: {
    _intersectionObserver(str) {
      const target = document.querySelector(`#${str}`)
      intersectionObserver({
        target,
        threshold: 0.5, // 曝光的临界点 (0.5表示移入窗口一半算做开始曝光、移出窗口一半算结束曝光)
        params: { name: 1111, targetName: str } // 附带的额外参数
      })
    },
    _intersectionUnobserve(str) {
      const target = document.querySelector(`#${str}`)
      intersectionUnobserve(target)
    },
    _intersectionDisconnect() {
      intersectionDisconnect()
    },
    getAllTracingList() {
      // 资源和请求，每触发一次就要发一个事件，当错误时，应该再发个error事件，或者其他？等想法方案统一一下
      axios
        .get('/getAllTracingList', { params: { eventType: 'intersection' } })
        .then(res => {
          const successList = res.data.data
          this.tracingInfo.data = successList
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.intersection {
}
</style>
