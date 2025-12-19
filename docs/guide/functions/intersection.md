# Intersection
捕获目标元素的曝光事件,主要原理是创建 `IntersectionObserver` 实例

::: warning
监听阈值(threshold)解释：阀值默认为0.5，当为0.5时代表滚动超过图片达到一半时即为曝光结束
同理当为0.5时，代表滚动视图能看到图片一半时即为曝光开始
:::

触发事件时给后台的对象
| 属性名称       | 值           | 说明                   |
| -------------- | ------------ | ---------------------- |
| eventType      | intersection | 事件类型               |
| target         |              | 被监听的元素(无效参数) |
| threshold      |              | 监听阈值               |
| params         |              | 附加参数               |
| observeTime    |              | 开始监听时间           |
| showTime       |              | 元素开始被曝光的时间   |
| showEndTime    |              | 元素结束被曝光的时间   |
| sendTime       |              | 发送时间               |
| triggerPageUrl |              | 页面地址               |


``` js
// 真实场景产生的事件对象
{
  eventType: 'intersection',
  target: { _prevClass: 'mb' },
  threshold: 0.5,
  observeTime: 1689734412090,
  params: { name: 1111, targetName: 'target' },
  showTime: 1689734412098,
  showEndTime: 1689734414097,
  sendTime: 1689734415104
  triggerPageUrl: 'http://localhost:6656/#/intersection',
}
```

## 使用说明
sdk初始化时不提供此功能，只能在页面针对某个元素进行监听

::: tip
[vue2完整示例代码](https://github.com/M-cheng-web/web-tracing/blob/main/examples/vue2/src/views/intersection/index.vue)

[vue3完整示例代码](https://github.com/M-cheng-web/web-tracing/blob/main/examples/vue3/src/views/intersection/index.vue)

[react完整示例代码](https://github.com/M-cheng-web/web-tracing/blob/main/examples/react/src/views/intersection/index.tsx)
:::


``` js
import {
  intersectionObserver,
  intersectionUnobserve,
  intersectionDisconnect
} from '@web-tracing/vue2'

const target = document.querySelector(`#xxx`)

// 对元素开始监听
intersectionObserver({
  target,
  threshold: 0.5, // 曝光的临界点 (0.5表示移入窗口一半算做开始曝光、移出窗口一半算结束曝光)
  params: { name: 1111, targetName: str } // 附带的额外参数
})

// 对元素结束监听
intersectionUnobserve(target)

// 结束所有的元素监听
intersectionDisconnect()
```


