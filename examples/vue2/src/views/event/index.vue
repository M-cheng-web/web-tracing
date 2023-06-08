<template>
  <div>
    <div
      class="box-div"
      data-warden-title="xxx"
      data-warden-bigTitle="bigTitle"
      width="100%"
      sdfasd
    >
      <div
        style="border: 1px solid red; height: 100px"
        data-warden-test="test"
        data-warden-title="titletitle"
        data-warden-bing="bing"
        data-warden-event-id="ddd"
      >
        <div class="asd">asdasdasd</div>
      </div>
      <div data-warden-id="我是ID">
        <button value="xxxxxx" ref="bun">1111</button>
      </div>
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

export default {
  name: 'app.vue',
  data() {
    return {
      tracingInfo: {
        data: [],
        table: {
          config: [
            { label: '序号', prop: 'index', width: '50', isTemplate: true },
            { label: '事件ID', prop: 'eventId' },
            { label: '事件名', prop: 'title' },
            { label: '事件类型', prop: 'eventType', width: '100' },
            { label: '当前页面URL', prop: 'triggerPageUrl', width: '200' },
            { label: '发送时间', prop: 'sendTime', isTemplate: true },
            { label: '事件发生时间', prop: 'triggerTime', isTemplate: true },
            { label: '事件参数', prop: 'params' },
            { label: '被点击元素的层级', prop: 'elementPath' },
            { label: '被点击元素与屏幕左边距离', prop: 'x' },
            { label: '被点击元素与屏幕上边距离', prop: 'y' }
          ]
        }
      }
    }
  },
  methods: {
    // ------- 查看监控信息 -------
    getAllTracingList() {
      axios
        .get('/getAllTracingList', { params: { eventType: 'click' } })
        .then(res => {
          this.tracingInfo.data = res.data.data
        })
    }
  }
}
</script>

<style>
.box-div {
  border: 1px solid green;
  height: 200px;
  padding: 10px;
}
.asd {
  border: 1px solid rgb(71, 1, 236);
  height: 50px;
}
</style>
