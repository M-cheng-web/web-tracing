<template>
  <div class="home">
    <el-button type="primary" @click="showBaseInfo">
      查看核心基础信息
    </el-button>
    <div>
      所有的事件类型:
      <div v-for="(value, key) in sendEventType">{{ `${key}: ${value}` }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      baseInfo: {},
      tracingList: [],
      sendEventType: {
        pv: '路由',
        error: '错误',
        performance: '资源',
        click: '点击',
        dwell: '页面卸载',
        intersection: '曝光采集'
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
