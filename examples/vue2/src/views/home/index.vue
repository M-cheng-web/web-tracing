<template>
  <div class="home">
    <div class="mb">
      所有的事件类型:
      <div v-for="(value, key) in sendEventType" :key="key">
        {{ `${key}: ${value}` }}
      </div>
    </div>
    <div class="mb">
      所有的事件ID(还有一些id是随机字符串的):
      <div v-for="(value, key) in sendEventId" :key="key">
        {{ `${key}: ${value}` }}
      </div>
    </div>

    <el-alert
      type="success"
      title="手动触发事件按钮集"
      :closable="false"
      class="mb"
    >
      <template slot>
        <div>
          这些按钮都会附带 <code>params.source</code> 标记，当前页下方列表会同时展示首页按钮和
          <code>main.js</code> 延迟触发的手动事件。
        </div>
        <div>
          错误事件受当前配置 <code>scopeError: true</code> 影响，通常会比其他事件晚一些显示。
        </div>
      </template>
    </el-alert>

    <div class="manual-actions">
      <el-button type="primary" plain @click="manualTraceCustomEvent">
        手动触发 traceCustomEvent
      </el-button>
      <el-button type="success" plain @click="manualTracePageView">
        手动触发 tracePageView
      </el-button>
      <el-button type="warning" plain @click="manualTracePerformance">
        手动触发 tracePerformance
      </el-button>
      <el-button type="danger" plain @click="manualTraceError">
        手动触发 traceError
      </el-button>
    </div>

    <div class="sdk-actions">
      <el-button type="primary" @click="getAllTracingList">
        获取最新手动事件
      </el-button>
      <el-button @click="_destroyTracing">点击触发 destroyTracing</el-button>
      <el-button @click="_reinitTracing">重新初始化 WebTracing</el-button>
    </div>

    <c-table
      :data="manualTracingInfo.data"
      tableHeight="320"
      :config="manualTracingInfo.table.config"
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
import {
  destroyTracing,
  init,
  traceCustomEvent,
  traceError,
  tracePageView,
  tracePerformance
} from '@web-tracing/vue2'
import { webTracingConfig } from '../../main.js'

const MANUAL_EVENT_SOURCES = [
  'home-manual-actions',
  'main-js-delayed-custom-event'
]

export default {
  data() {
    return {
      sendEventType: {
        pv: '路由',
        error: '错误',
        performance: '资源',
        click: '点击',
        custom: '手动触发',
        dwell: '页面卸载',
        intersection: '曝光采集'
      },
      sendEventId: {
        page: '页面',
        resource: '资源',
        server: '请求',
        code: '错误id - code',
        reject: '错误id - reject',
        'console.error': '错误id - console.error',
        'manual-custom': '首页手动自定义事件',
        'manual-performance': '首页手动性能事件',
        'manual-error': '首页手动错误事件',
        'main-delayed-custom': 'main.js 延迟触发自定义事件'
      },
      manualTracingInfo: {
        data: [],
        table: {
          config: [
            { label: '序号', prop: 'index', width: '60', isTemplate: true },
            { label: '事件类型', prop: 'eventType', width: '120' },
            { label: '事件ID', prop: 'eventId', width: '180' },
            { label: '事件名', prop: 'title', width: '200' },
            { label: '错误信息', prop: 'errMessage', width: '220' },
            { label: '当前页面URL', prop: 'triggerPageUrl', width: '240' },
            { label: '事件参数', prop: 'paramsText', width: '320' },
            {
              label: '发送时间',
              prop: 'sendTime',
              width: '180',
              isTemplate: true
            },
            {
              label: '触发时间',
              prop: 'triggerTime',
              width: '180',
              isTemplate: true
            }
          ]
        }
      }
    }
  },
  mounted() {
    this.getAllTracingList()
  },
  methods: {
    createManualParams(actionName) {
      return {
        source: MANUAL_EVENT_SOURCES[0],
        actionName,
        route: this.$route.fullPath,
        triggerLabel: `${actionName}-${Date.now()}`
      }
    },
    manualTraceCustomEvent() {
      traceCustomEvent(
        {
          eventId: 'manual-custom',
          title: '首页手动触发自定义事件',
          params: this.createManualParams('traceCustomEvent')
        },
        true
      )
      this.sendMessage('已手动触发 traceCustomEvent')
    },
    manualTracePageView() {
      tracePageView(
        {
          title: '首页手动触发PV事件',
          action: 'manual',
          referer: 'manual-trigger',
          params: this.createManualParams('tracePageView')
        },
        true
      )
      this.sendMessage('已手动触发 tracePageView')
    },
    manualTracePerformance() {
      tracePerformance(
        {
          eventId: 'manual-performance',
          title: '首页手动触发性能事件',
          initiatorType: 'manual',
          requestUrl: window.location.href,
          duration: 123.45,
          responseStart: 12.34,
          responseEnd: 123.45,
          responseStatus: 'manual',
          params: this.createManualParams('tracePerformance')
        },
        true
      )
      this.sendMessage('已手动触发 tracePerformance')
    },
    manualTraceError() {
      traceError({
        eventId: 'manual-error',
        errMessage: '首页手动触发错误事件',
        errStack: 'Error: manual trace from /home',
        params: this.createManualParams('traceError')
      })
      this.sendMessage('已手动触发 traceError，错误事件可能会延迟显示')
    },
    getAllTracingList() {
      axios.get('/getAllTracingList').then(res => {
        const list = (res.data.data || [])
          .filter(
            item =>
              item.params &&
              MANUAL_EVENT_SOURCES.includes(item.params.source)
          )
          .sort((a, b) => {
            const aTime = a.sendTime || a.triggerTime || 0
            const bTime = b.sendTime || b.triggerTime || 0
            return bTime - aTime
          })
          .map(item => ({
            ...item,
            paramsText: JSON.stringify(item.params || {})
          }))

        this.manualTracingInfo.data = list
      })
    },
    _destroyTracing() {
      destroyTracing()
      this.sendMessage('destroyTracing 成功')
    },
    _reinitTracing() {
      init(webTracingConfig)
      this.sendMessage('WebTracing 重新初始化成功')
    }
  }
}
</script>

<style lang="scss">
.home {
  .manual-actions,
  .sdk-actions {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;

    .el-button {
      margin-right: 12px;
      margin-bottom: 12px;
      margin-left: 0;
    }
  }
}
</style>
