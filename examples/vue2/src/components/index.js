/**
 * @Description: 项目级别公共组件注册
 */

import Vue from 'vue'

export function setupComponent() {
  const modulesFiles = import.meta.globEager('./*.vue')

  for (const path in modulesFiles) {
    const componentName = modulesFiles[path].default.name
    Vue.component(componentName, modulesFiles[path].default)
  }
}
