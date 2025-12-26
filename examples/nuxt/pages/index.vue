<template>
  <div class="home">
    <div class="header">
      <h1>Web-Tracing Nuxt3 示例</h1>
      <p>这是一个基于 @web-tracing/nuxt 的示例应用</p>
    </div>

    <div class="content">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>埋点功能</span>
              </div>
            </template>
            <el-space direction="vertical" :size="16">
              <el-button type="primary" @click="handleClick"
                >点击埋点测试</el-button
              >
              <el-button type="success" @click="handlePerformance"
                >性能数据查看</el-button
              >
              <el-button type="warning" @click="handleError"
                >错误触发测试</el-button
              >
            </el-space>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>页面测试</span>
              </div>
            </template>
            <el-space direction="vertical" :size="16">
              <el-button @click="$router.push('/about')"
                >跳转到关于页面</el-button
              >
              <el-button @click="$router.push('/user/123')"
                >跳转到用户页面</el-button
              >
              <el-button @click="$router.back()">返回上一页</el-button>
            </el-space>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>数据查看</span>
              </div>
            </template>
            <el-space direction="vertical" :size="16">
              <el-button @click="showTracingList">查看埋点列表</el-button>
              <el-button type="danger" @click="clearTracingList"
                >清除埋点数据</el-button
              >
              <el-button type="info" @click="showBaseInfo"
                >查看基础信息</el-button
              >
            </el-space>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 数据展示区域 -->
    <div v-if="showData" class="data-display">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>{{ dataTitle }}</span>
            <el-button type="text" @click="showData = false">关闭</el-button>
          </div>
        </template>
        <pre>{{ JSON.stringify(displayData, null, 2) }}</pre>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

const showData = ref(false);
const dataTitle = ref("");
const displayData = ref<any>(null);

// 页面挂载时自动 PV 埋点
onMounted(() => {
  console.log("Nuxt3 首页加载完成 - 自动进行 PV 埋点");
});

// 点击埋点测试
const handleClick = () => {
  ElMessage.success("点击事件已触发，埋点已记录");
  console.log("用户点击了按钮 - 触发点击埋点");
};

// 性能数据查看
const handlePerformance = () => {
  if (process.client && window.performance) {
    const timing = window.performance.timing;
    const performanceData = {
      页面加载时间: timing.loadEventEnd - timing.navigationStart,
      DOM解析时间: timing.domComplete - timing.domLoading,
      首字节时间: timing.responseStart - timing.navigationStart,
      HTML下载时间: timing.responseEnd - timing.responseStart,
      资源加载数量: window.performance.getEntriesByType("resource").length,
    };

    displayData.value = performanceData;
    dataTitle.value = "性能数据";
    showData.value = true;
  }
};

// 错误触发测试
const handleError = () => {
  try {
    // 故意触发一个错误
    const obj: any = null;
    obj.someProperty.someMethod();
  } catch (error) {
    ElMessage.error("测试错误已触发，错误监控已记录");
    console.error("测试错误:", error);
  }
};

// 查看埋点列表
const showTracingList = async () => {
  try {
    const res = await $fetch("/getAllTracingList", {
      params: { eventType: "click" },
    });
    displayData.value = res;
    dataTitle.value = "埋点列表";
    showData.value = true;
  } catch (error) {
    console.error("查询埋点列表失败:", error);
    ElMessage.error("查询埋点列表失败");
  }
};

// 清除埋点数据
const clearTracingList = async () => {
  try {
    await $fetch("/cleanTracingList", { method: "POST" });
    ElMessage.success("埋点数据已清除");
  } catch (error) {
    console.error("清除埋点数据失败:", error);
    ElMessage.error("清除埋点数据失败");
  }
};

// 查看基础信息
const showBaseInfo = async () => {
  try {
    const res = await $fetch("/getBaseInfo");
    displayData.value = res;
    dataTitle.value = "基础信息";
    showData.value = true;
  } catch (error) {
    console.error("查询基础信息失败:", error);
    ElMessage.error("查询基础信息失败");
  }
};

// 设置页面标题
useHead({
  title: "Web-Tracing Nuxt3 示例 - 首页",
});
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;

  h1 {
    color: #409eff;
    margin-bottom: 10px;
  }

  p {
    color: #666;
    font-size: 14px;
  }
}

.content {
  margin-bottom: 30px;
}

.box-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.data-display {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  .el-card {
    width: 80%;
    max-height: 80vh;
    overflow-y: auto;

    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      font-size: 12px;
      max-height: 60vh;
      overflow-y: auto;
    }
  }
}
</style>
