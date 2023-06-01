import { Watcher } from './watcher'

export class Dep {
  // set结构可以自动去重,因为不可避免有些依赖会被重复添加
  // 例如有两个计算属性是依赖于dataA,第一遍计算出那两个计算属性时,dataA的dep是收集了他俩的watcher
  // 但是当其中一个计算属性重新计算时(比如另外一个依赖项改动了会影响此计算属性重新计算),会再次调取dataA
  // 的get拦截,也就是会再次触发 dep.addSub(),如果不加重复过滤这样的场景会一直递增下去,然后当dataA发生
  // 更改时遍历其subs,届时有太多不需要遍历的watcher,很大概率卡死
  subs = new Set<Watcher>()
  static target: Watcher | undefined // 全局唯一收集容器
  addSub() {
    if (Dep.target) this.subs.add(Dep.target)
  }
  notify() {
    // 在某个属性发生变化时会执行其 dep.notify(),用来通知依赖这个属性的所有 watcher
    this.subs.forEach(function (watcher: any) {
      watcher.proxy.dirty = true // 标明数据脏了,当再次使用到这个值会重新计算
      watcher.update()
    })
  }
}
