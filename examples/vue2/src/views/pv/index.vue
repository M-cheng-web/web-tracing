<template>
  <div class="pv">
    <div>
      <div>action 字段解释</div>
      <div>
        navigate - 网页通过点击链接,地址栏输入,表单提交,脚本操作等方式加载
      </div>
      <div>reload - 网页通过“重新加载”按钮或者location.reload()方法加载</div>
      <div>back_forward - 网页通过“前进”或“后退”按钮加载</div>
      <div>reserved - 任何其他来源的加载</div>
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

export default {
  data() {
    return {
      tracingInfo: {
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
            { label: '页面加载来源', prop: 'action' }
          ]
        }
      }
    }
  },
  methods: {
    getAllTracingList() {
      // 资源和请求，每触发一次就要发一个事件，当错误时，应该再发个error事件，或者其他？等想法方案统一一下
      axios
        .get('/getAllTracingList', { params: { eventType: 'pv' } })
        .then(res => {
          const successList = res.data.data
          this.tracingInfo.data = successList
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.pv {
}
</style>
