<template>
  <div class="home">
    <el-button type="primary" @click="showBaseInfo">
      查看核心基础信息
    </el-button>
    <el-button type="primary" @click="getAllTracingList">
      获取最新采集数据
    </el-button>

    <div class="content">
      <div>
        <div>action 字段解释</div>
        <div>
          navigate - 网页通过点击链接,地址栏输入,表单提交,脚本操作等方式加载
        </div>
        <div>reload - 网页通过“重新加载”按钮或者location.reload()方法加载</div>
        <div>back_forward - 网页通过“前进”或“后退”按钮加载</div>
        <div>reserved - 任何其他来源的加载</div>
      </div>
      <c-table
        :data="pvConfig.data"
        tableHeight="400"
        :config="pvConfig.table.config"
        :pagination="pvConfig.pagination"
        @pageChange="pageChange"
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
        <!-- <template v-slot:operate="{ scope }">
          <div class="table-operate">
            <el-button
              link
              type="primary"
              size="small"
              @click="handlerMore(scope.row)"
            >
              查看
            </el-button>
          </div>
        </template> -->
      </c-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// 所有的 eventType
// export enum SEDNEVENTTYPES {
//   PV = 'pv', // 路由
//   ERROR = 'error', // 错误
//   PERFORMANCE = 'performance', // 资源
//   CLICK = 'click', // 点击
//   DWELL = 'dwell', // 页面卸载
//   CUSTOM = 'custom', // 手动触发事件
//   INTERSECTION = 'intersection' // 曝光采集
// }

export default {
  data() {
    return {
      baseInfo: {},
      tracingList: [],

      pvConfig: {
        data: [],
        table: {
          config: [
            { label: '序号', prop: 'index', width: '50', isTemplate: true },
            { label: '事件ID', prop: 'eventId' },
            { label: '事件类型', prop: 'eventType', width: '100' },
            { label: '当前页面URL', prop: 'triggerPageUrl', width: '200' },
            { label: '上级页面URL', prop: 'referer', width: '200' },
            { label: '页面标题', prop: 'title' },
            { label: '发送时间', prop: 'sendTime', isTemplate: true },
            { label: '事件发生时间', prop: 'triggerTime', isTemplate: true },
            { label: '页面加载来源', prop: 'action' }
            // {
            //   prop: 'operate',
            //   width: '100',
            //   label: '操作',
            //   isTemplate: true
            // }
          ]
        },
        pagination: {
          page: 1,
          pageSize: 5,
          total: 0
        }
      }
    }
  },
  mounted() {
    this.getBaseInfo()
  },
  methods: {
    getBaseInfo() {
      axios.get('/getBaseInfo').then(res => {
        this.baseInfo = res.data.data
      })
    },
    getAllTracingList() {
      axios
        .get('/getAllTracingList', { params: { eventType: 'pv' } })
        .then(res => {
          this.pvConfig.data = res.data.data
        })
    },
    showBaseInfo() {
      if (this.baseInfo) {
        const displayInfo = Object.keys(this.baseInfo).reduce((pre, key) => {
          const value = JSON.stringify(this.baseInfo[key])
          pre += `<div class='pop-line'><div>${key}: </div><span>${value}</span></div>`
          return pre
        }, '')
        this.$alert(displayInfo, '核心基础信息', {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          closeOnClickModal: true
        })
      }
    },
    pageChange(val) {
      this.pagination.page = val
      this.getAllTracingList()
    }
  }
}
</script>

<style lang="scss">
.pop-line {
  display: flex;
  align-items: center;
  & > div {
    width: 100px;
  }
  & > span {
    flex: 1;
  }
}
</style>
