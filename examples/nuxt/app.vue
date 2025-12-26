<template>
  <div id="app">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(async () => {
  const { init } = await import("@web-tracing/core");
  init({
    dsn: "/trackweb",
    appName: "nuxt-cxh",
    debug: true,
    pv: true,
    performance: true,
    error: true,
    event: true,
    cacheMaxLength: 10,
    cacheWatingTime: 1000,
    recordScreen: false,
    ignoreRequest: [
      /getAllTracingList/,
      /cleanTracingList/,
      /getBaseInfo/,
      /getSourceMap/,
    ],
    afterSendData(data: any) {
      const { sendType, success, params } = data;
      const sendEventType: any = {
        pv: "路由",
        error: "错误",
        performance: "资源",
        click: "点击",
        dwell: "页面卸载",
        intersection: "曝光采集",
      };

      console.log("埋点数据发送:", {
        发送是否成功: success,
        发送方式: sendType,
        事件列表: params.eventInfo.map((item: any, index: number) => ({
          序号: index + 1,
          类型: `${item.eventType}(${sendEventType[item.eventType]})`,
          ID: item.eventId,
        })),
      });
    },
  });
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
