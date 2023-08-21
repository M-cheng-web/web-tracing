import { defineConfig, DefaultTheme } from 'vitepress'
import { version } from '../../package.json'

export default defineConfig({
  lang: 'zh-CN',
  title: 'web-tracing',
  description: '行为埋点 & 性能采集 & 异常采集 & 请求采集 & 路由采集',

  lastUpdated: true,
  base: '/web-tracing',
  cleanUrls: true,

  themeConfig: {
    logo: 'https://cdn.staticaly.com/gh/M-cheng-web/image-provider@main/web-tracing/icon_5e9950ae4507f.33lqpfzrwzc0.svg',

    nav: [
      { text: '指南', link: '/guide/starting' },
      { text: '关于项目', link: '/guide/spotlight' },
      { text: '示例', link: '/guide/use/demo' },
      { text: version, link: '' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '起步', link: '/guide/starting' },
            { text: '最佳实践', link: '/guide/practice' },
            { text: '关于项目', link: '/guide/spotlight' },
            { text: '设计理念', link: '/guide/idea' },
            { text: '迭代计划', link: '/guide/plan' },
          ]
        },
        {
          text: '使用',
          items: [
            { text: '基础说明', link: '/guide/use/declare' },
            { text: '配置项', link: '/guide/use/options' },
            { text: '数据结构', link: '/guide/use/structure' },
            { text: '示例', link: '/guide/use/demo' },
            { text: '本地运行项目', link: '/guide/use/run' },
          ]
        },
        {
          text: '功能',
          items: [
            { text: '事件采集', link: '/guide/functions/event' },
            { text: '错误采集', link: '/guide/functions/error' },
            { text: '路由采集', link: '/guide/functions/pv' },
            { text: '请求采集', link: '/guide/functions/http' },
            { text: '资源采集', link: '/guide/functions/performance' },
            { text: '曝光采集', link: '/guide/functions/intersection' },
            { text: '导出项', link: '/guide/functions/exports' },
            // { text: '其他', link: '/guide/functions/other' },
          ]
        },
      ],
      // '/analyse/': [
      //   {
      //     text: '技术点分析',
      //     items: [
      //       { text: '基础说明', link: '/analyse/index' },
      //       { text: '架构', link: '/analyse/framework' },
      //     ]
      //   },
      // ],
    },

    editLink: {
      pattern: 'https://github.com/M-cheng-web/web-tracing/blob/main/docs/:path',
      text: 'Suggest changes to this page'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/M-cheng-web/web-tracing' }
    ],

    // 这里后续要去申请
    // algolia: {
    //   appId: '8J64VVRP8K',
    //   apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
    //   indexName: 'vitepress'
    // },

    // lastUpdatedText: '最后更新',

    // outlineTitle: 'This',
  },
  head: [
    ['link', { rel: 'icon', href: 'https://cdn.staticaly.com/gh/M-cheng-web/image-provider@main/web-tracing/icon_5e9950ae4507f.33lqpfzrwzc0.svg' }],
  ]
})