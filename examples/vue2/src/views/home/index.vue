<template>
  <div class="home">
    <el-button type="primary" @click="showBaseInfo">
      查看核心基础信息
    </el-button>
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
      tracingList: []
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
