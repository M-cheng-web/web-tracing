<template>
  <div class="pv">
    <el-alert
      type="warning"
      title="action 字段解释"
      :closable="false"
      class="mb"
    >
      <div>
        navigate - 网页通过点击链接,地址栏输入,表单提交,脚本操作等方式加载
      </div>
      <div>reload - 网页通过“重新加载”按钮或者location.reload()方法加载</div>
      <div>back_forward - 网页通过“前进”或“后退”按钮加载</div>
      <div>reserved - 任何其他来源的加载</div>
    </el-alert>

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
// import { useRouter } from 'vue-router'

const formatDate = inject('formatDate', Function, true)
const selfMessage = inject('selfMessage', Function, true)

// const router = useRouter()

onMounted(() => {
  // @ts-ignore
  window.getAllTracingList = getAllTracingList
  getAllTracingList()

  // setTimeout(() => {
  //   router.replace('/home')
  // }, 2000)
})

const tracingInfo = ref({
  data: [],
  table: {
    config: [
      { label: '序号', prop: 'index', width: '50', isTemplate: true },
      { label: '事件ID', prop: 'eventId' },
      { label: '事件类型', prop: 'eventType' },
      { label: '当前页面URL', prop: 'triggerPageUrl', width: '200' },
      { label: '上级页面URL', prop: 'referer', width: '200' },
      { label: '页面标题', prop: 'title' },
      {
        label: '发送时间',
        prop: 'sendTime',
        width: '200',
        isTemplate: true
      },
      {
        label: '事件触发时间',
        prop: 'triggerTime',
        width: '200',
        isTemplate: true
      },
      { label: '页面加载来源', prop: 'action', width: '100' }
    ]
  }
})

function getAllTracingList() {
  axios.get('/getAllTracingList', { params: { eventType: 'pv' } }).then(res => {
    const successList = res.data.data
    tracingInfo.value.data = successList
    selfMessage('成功查询最新数据 - 页面跳转事件')
  })
}
</script>

<style lang="scss" scoped>
.pv {
}
</style>
