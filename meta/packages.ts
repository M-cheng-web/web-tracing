export const packages: any[] = [
  // {
  //   name: 'demo',
  //   display: 'Demo', // 展示名
  //   description: 'demo: 项目简介',
  //   keywords: ['关键词1', '关键词2'],
  //   external: ['vue', 'vue-router', 'dayjs'], // 外部依赖
  //   build: false, // 是否打包
  //   iife: false, // 是否打包 iife 格式
  //   cjs: false, // 是否打包 cjs 格式
  //   mjs: false, // 是否打包 mjs/es 格式
  //   dts: false, // 是否打包 ts声明
  //   target: 'es2015', // 打包的兼容性
  //   moduleJs: true, // 是否 main 入口指向 index.mjs
  //   utils: true // 含义：1.不会在文档中看到此分类 2.此分类只会参与打包到npm以及让库内其他包使用
  //   globals: {
  //     // 用到的全局变量名，用于打包
  //     dayjs: 'Dayjs',
  //     'vue-router': 'VueRouter',
  //     'js-cookie': 'JsCookie',
  //     easyqrcodejs: 'Easyqrcodejs'
  //   }
  // },
  {
    name: 'core',
    display: 'WebTracing',
    description:
      '基于 JS 跨平台插件，为前端项目提供【 行为、性能、异常、请求、资源、路由、曝光、录屏 】监控手段',
    keywords: [
      '埋点',
      '性能',
      '异常',
      '性能采集',
      '异常采集',
      '前端埋点',
      '前端性能采集'
    ]
    // external: ['@web-tracing/utils', '@web-tracing/types']
  },
  {
    name: 'vue2',
    display: 'Vue2',
    description:
      '基于 JS 跨平台插件，为前端项目提供【 行为、性能、异常、请求、资源、路由、曝光、录屏 】监控手段 - vue2版本',
    keywords: [
      '埋点',
      '性能',
      '异常',
      '性能采集',
      '异常采集',
      '前端埋点',
      '前端性能采集'
    ],
    iife: false
    // external: ['@web-tracing/core']
  },
  {
    name: 'vue3',
    display: 'Vue3',
    description:
      '基于 JS 跨平台插件，为前端项目提供【 行为、性能、异常、请求、资源、路由、曝光、录屏 】监控手段 - vue3版本',
    keywords: [
      '埋点',
      '性能',
      '异常',
      '性能采集',
      '异常采集',
      '前端埋点',
      '前端性能采集'
    ],
    iife: false
    // external: ['@web-tracing/core']
  }
  // {
  //   name: 'utils',
  //   display: 'Utils',
  //   description: '@web-tracing/utils',
  //   keywords: [
  //     '埋点',
  //     '性能',
  //     '异常',
  //     '性能采集',
  //     '异常采集',
  //     '前端埋点',
  //     '前端性能采集'
  //   ]
  // },
  // {
  //   name: 'types',
  //   display: 'Types',
  //   description: '@web-tracing/types',
  //   keywords: [
  //     '埋点',
  //     '性能',
  //     '异常',
  //     '性能采集',
  //     '异常采集',
  //     '前端埋点',
  //     '前端性能采集'
  //   ]
  // }
]
