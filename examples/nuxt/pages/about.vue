<template>
  <div class="about">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>关于页面</span>
        </div>
      </template>

      <div class="about-content">
        <h2>@web-tracing/nuxt 模块</h2>
        <p>这是一个专门为 Nuxt3 框架设计的埋点监控模块。</p>

        <h3>主要特性：</h3>
        <ul>
          <li>✅ 自动页面浏览量统计 (PV)</li>
          <li>✅ 性能监控</li>
          <li>✅ 错误监控</li>
          <li>✅ 事件监听</li>
          <li>✅ 请求拦截</li>
          <li>✅ 资源加载监控</li>
          <li>✅ 路由变化监控</li>
          <li>✅ 曝光采集</li>
          <li>✅ 录屏功能(可选)</li>
          <li>✅ 完全支持 Nuxt3 SSR</li>
        </ul>

        <div class="actions">
          <el-button type="primary" @click="$router.push('/')"
            >返回首页</el-button
          >
          <el-button @click="testFeatures">测试功能</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";

// 页面挂载时自动 PV 埋点
onMounted(() => {
  console.log("关于页面加载完成 - 自动进行 PV 埋点");
});

// 测试各种功能
const testFeatures = () => {
  ElMessage.success("功能测试完成，请查看控制台埋点数据");

  // 模拟一些用户交互
  setTimeout(() => {
    console.log("模拟用户交互");
  }, 1000);

  // 模拟网络请求
  setTimeout(() => {
    fetch("/api/test")
      .then((response) => response.json())
      .then((data) => {
        console.log("API请求成功:", data);
      })
      .catch((error) => {
        console.error("API请求失败:", error);
      });
  }, 2000);
};

// 设置页面标题
useHead({
  title: "Web-Tracing Nuxt3 示例 - 关于",
});
</script>

<style lang="scss" scoped>
.about {
  padding: 20px;
}

.card-header {
  font-weight: bold;
  font-size: 18px;
}

.about-content {
  h2 {
    color: #409eff;
    margin-bottom: 20px;
  }

  h3 {
    color: #303133;
    margin: 20px 0 10px 0;
  }

  p {
    color: #606266;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  ul {
    margin: 0 0 20px 20px;

    li {
      margin-bottom: 8px;
      line-height: 1.5;
    }
  }

  .actions {
    margin-top: 30px;

    .el-button {
      margin-right: 15px;
    }
  }
}
</style>
