<template>
  <div class="user-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户详情页</span>
        </div>
      </template>
      
      <div class="user-info">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户ID">
            {{ id }}
          </el-descriptions-item>
          <el-descriptions-item label="用户名">
            User {{ id }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag type="success">活跃</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="注册时间">
            {{ new Date().toLocaleDateString() }}
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="user-actions">
          <h3>用户操作</h3>
          <el-space :size="16">
            <el-button type="primary" @click="viewProfile">查看资料</el-button>
            <el-button type="success" @click="editProfile">编辑资料</el-button>
            <el-button type="warning" @click="sendMessage">发送消息</el-button>
            <el-button @click="viewHistory">查看历史</el-button>
          </el-space>
        </div>
        
        <div class="simulation-area">
          <h3>埋点模拟区域</h3>
          <el-space :size="16" direction="vertical">
            <el-button @click="simulatePageView">模拟页面浏览</el-button>
            <el-button @click="simulateClick">模拟点击事件</el-button>
            <el-button @click="simulateApiCall">模拟API调用</el-button>
            <el-button type="danger" @click="simulateError">模拟错误</el-button>
          </el-space>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 获取路由参数
const route = useRoute()
const id = ref(route.params.id)

// 页面挂载时自动 PV 埋点
onMounted(() => {
  console.log(`用户页面加载完成 - 用户ID: ${id.value} - 自动进行 PV 埋点`)
})

// 查看资料
const viewProfile = () => {
  ElMessage.success(`查看用户 ${id.value} 的资料`)
  console.log(`查看用户资料: ${id.value}`)
}

// 编辑资料
const editProfile = () => {
  ElMessage.info(`编辑用户 ${id.value} 的资料`)
  console.log(`编辑用户资料: ${id.value}`)
}

// 发送消息
const sendMessage = () => {
  ElMessage.success(`向用户 ${id.value} 发送消息`)
  console.log(`发送消息给用户: ${id.value}`)
}

// 查看历史
const viewHistory = () => {
  ElMessage.info(`查看用户 ${id.value} 的历史记录`)
  console.log(`查看用户历史: ${id.value}`)
}

// 模拟页面浏览
const simulatePageView = () => {
  ElMessage.success('模拟页面浏览事件')
  console.log('模拟页面浏览事件')
}

// 模拟点击事件
const simulateClick = () => {
  ElMessage.success('模拟点击事件')
  console.log('模拟点击事件')
}

// 模拟API调用
const simulateApiCall = () => {
  ElMessage.info('模拟API调用')
  
  fetch('/api/user/' + id.value)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      console.log('API调用成功:', data)
      ElMessage.success('API调用成功')
    })
    .catch(error => {
      console.error('API调用失败:', error)
      ElMessage.error('API调用失败')
    })
}

// 模拟错误
const simulateError = () => {
  try {
    // 故意触发错误
    throw new Error('这是一个模拟的错误事件')
  } catch (error) {
    console.error('模拟错误:', error)
    ElMessage.error('模拟错误已被记录')
  }
}

// 设置页面标题
useHead({
  title: `Web-Tracing Nuxt3 示例 - 用户${id.value}`
})

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  id.value = newId
  console.log(`用户ID变化: ${newId}`)
})
</script>

<style lang="scss" scoped>
.user-detail {
  padding: 20px;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

.user-info {
  .user-actions {
    margin: 30px 0;
    
    h3 {
      margin-bottom: 15px;
      color: #303133;
    }
  }
  
  .simulation-area {
    margin-top: 30px;
    
    h3 {
      margin-bottom: 15px;
      color: #303133;
    }
  }
}
</style>