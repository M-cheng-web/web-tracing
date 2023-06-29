<template>
  <div>
    <div
      class="box-a mb"
      data-warden-title="xxx"
      data-warden-bigTitle="bigTitle"
      sdfasd
    >
      <div
        class="box-b"
        data-warden-test="test-1"
        data-warden-title="titletitle-1"
        data-warden-bing="bing-1"
        data-warden-event-id="ddd-1"
      >
        <div class="box-c">我是最里面的内容 - 1</div>
      </div>
      <div
        class="box-b-btn"
        data-warden-id="我是ID"
        data-warden-test="test-btn"
      >
        <el-button value="xxxxxx" type="primary">点我一个试试</el-button>
        <el-button value="yyyyyy" type="primary">再点我一个试试</el-button>
      </div>
      <div
        class="box-b"
        data-warden-test="test-2"
        data-warden-title="titletitle-2"
        data-warden-bing="bing-2"
        data-warden-event-id="ddd-2"
      >
        <div class="box-c">我是最里面的内容 - 2</div>
      </div>
    </div>

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

<script lang="ts" setup>
import axios from 'axios'
import { ref, onMounted, inject } from 'vue'

const formatDate = inject('formatDate', Function, true)
const selfMessage = inject('selfMessage', Function, true)

onMounted(() => {
  // @ts-ignore
  window.getAllTracingList = getAllTracingList
  getAllTracingList()
})

const tracingInfo = ref({
  data: [],
  table: {
    config: [
      { label: '序号', prop: 'index', width: '50', isTemplate: true },
      { label: '事件ID', prop: 'eventId' },
      { label: '事件名', prop: 'title' },
      { label: '事件类型', prop: 'eventType' },
      { label: '事件参数', prop: 'params', width: '200' },
      { label: '当前页面URL', prop: 'triggerPageUrl', width: '200' },
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
      { label: '被点击元素的层级', prop: 'elementPath' },
      { label: '被点击元素与屏幕左边距离', prop: 'x', width: '100' },
      { label: '被点击元素与屏幕上边距离', prop: 'y', width: '100' }
    ]
  }
})

function getAllTracingList() {
  axios
    .get('/getAllTracingList', { params: { eventType: 'click' } })
    .then(res => {
      tracingInfo.value.data = res.data.data
      selfMessage('成功查询最新数据 - 点击事件')
    })
}
</script>

<style lang="scss">
.box-a {
  height: 300px;
  padding: 20px;
  border: 1px solid rgba(85, 239, 196, 1);
  box-shadow: inset 0px 0px 20px 0px rgba(85, 239, 196, 1);
  .box-b {
    width: 70%;
    height: 100px;
    padding: 20px;
    border: 1px solid #fab1a0;
    box-shadow: inset 0px 0px 20px 0px #fab1a0;
    .box-c {
      width: 50%;
      height: 50px;
      padding: 10px;
      border: 1px solid #74b9ff;
      box-shadow: inset 0px 0px 20px 0px #74b9ff;
    }
  }
  .box-b-btn {
    margin: 10px 0;
  }
}
</style>
