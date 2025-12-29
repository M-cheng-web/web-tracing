<template>
  <div class="intersection">
    <el-alert type="warning" title="注意" :closable="false" class="mb">
      <div>
        监听阈值(threshold)解释：阀值默认为0.5，当为0.5时代表滚动超过图片达到一半时即为曝光结束
      </div>
      <div>同理当为0.5时，代表滚动视图能看到图片一半时即为曝光开始</div>
    </el-alert>

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
      <div>----------- 分割线 -----------</div>
      <div>----------- 分割线 -----------</div>
      <div>----------- 分割线 -----------</div>
      <div>----------- 分割线 -----------</div>
      <div>----------- 分割线 -----------</div>
      <div>----------- 分割线 -----------</div>
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
    <c-table
      :data="tracingInfo.data"
      tableHeight="400"
      :config="tracingInfo.table.config"
    >
      <template #index="{ scope }">
        {{ `${scope.index + 1}` }}
      </template>
      <template #observeTime="{ scope }">
        {{ `${formatDate(scope.row.observeTime)}` }}
      </template>
      <template #showTime="{ scope }">
        {{ `${formatDate(scope.row.showTime)}` }}
      </template>
      <template #showEndTime="{ scope }">
        {{ `${formatDate(scope.row.showEndTime)}` }}
      </template>
      <template #sendTime="{ scope }">
        {{ `${formatDate(scope.row.sendTime)}` }}
      </template>
    </c-table>
  </div>
</template>

<script lang="ts" setup>
import { intersectionObserver, intersectionUnobserve, intersectionDisconnect } from '@web-tracing/core'
import { ref, onMounted, inject } from 'vue'

const formatDate = inject('formatDate', Function, true)
const sendMessage = inject('sendMessage', Function, true)
const selfMessage = inject('selfMessage', Function, true)

onMounted(() => {
  // 只在客户端环境下设置 window 对象
  if (import.meta.client) {
    // @ts-ignore
    window.getAllTracingList = getAllTracingList
  }
  getAllTracingList()
})

const tracingInfo = ref({
  data: [],
  table: {
    config: [
      { label: '序号', prop: 'index', width: '50', isTemplate: true },
      { label: '事件类型', prop: 'eventType' },
      { label: '当前页面URL', prop: 'triggerPageUrl', width: '200' },
      { label: '监听阈值', prop: 'threshold' },
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
})

function _intersectionObserver(str: string) {
  sendMessage('成功采集，请滑动页面测试')

  const target = document.querySelector(`#${str}`)!
  intersectionObserver({
    target,
    threshold: 0.5,
    params: { name: 1111, targetName: str }
  })
}
function _intersectionUnobserve(str: string) {
  sendMessage('取消了采集，请滑动页面测试')

  const target = document.querySelector(`#${str}`)!
  intersectionUnobserve(target)
}
function _intersectionDisconnect() {
  sendMessage('取消了采集，请滑动页面测试')

  intersectionDisconnect()
}
function getAllTracingList() {
  $fetch('/getAllTracingList', { params: { eventType: 'intersection' } })
    .then(res => {
      const successList = (res as any).data
      tracingInfo.value.data = successList
      selfMessage('成功查询最新数据 - 曝光采集事件')
    })
}
</script>

<style lang="scss" scoped>
.intersection {
}
</style>
