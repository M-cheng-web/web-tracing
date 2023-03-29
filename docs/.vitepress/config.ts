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
    logo: '/logo.svg',
    nav: nav(),

    // sidebar: {
    //   '/guide/': GuideSidebar,
    // } as DefaultTheme.Sidebar,

    editLink: {
      pattern: 'https://github.com/FastUse/morehook/tree/main/packages/:path',
      text: 'Suggest changes to this page'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/FastUse/morehook' }
    ],

    // 这里后续一定要去申请
    // algolia: {
    //   appId: '8J64VVRP8K',
    //   apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
    //   indexName: 'vitepress'
    // },

    // lastUpdatedText: '最后更新',

    // docFooter: {
    //   prev: '上一页',
    //   next: '下一页'
    // },
    // outlineTitle: 'This',

    // footer: {
    //   message: 'Released under the MIT License.',
    // },
  },
  head: [
    ['link', { rel: 'icon', href: 'logo.svg' }],
  ]
})

// 顶部栏
function nav(): DefaultTheme.NavItem[] {
  return [
    { text: '开始', link: '/guide/introduce', activeMatch: '/guide/' },
    { text: '搜索', link: '/functions', activeMatch: '/functions/' },
    {
      text: version,
      link: ''
      // items: [
      //   {
      //     text: 'Changelog',
      //     link: 'https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md'
      //   },
      //   {
      //     text: 'Contributing',
      //     link: 'https://github.com/vuejs/vitepress/blob/main/.github/contributing.md'
      //   }
      // ]
    }
  ]
}
