import { Dep } from './dep'
import { computedMap } from './computed'
import { AnyFun, Options, Proxy } from './types'

const targetStack: Watcher[] = []
function pushTarget(_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}
function popTarget() {
  Dep.target = targetStack.pop()
}

export class Watcher {
  vm: any
  computed: boolean
  watch: boolean
  proxy: Proxy
  dep: Dep | undefined
  getter: AnyFun | undefined
  callback: AnyFun | undefined
  constructor(vm: any, options: Options, getter?: AnyFun) {
    const { computed, watch, callback } = options
    this.getter = getter // 获取值函数
    this.computed = computed || false // 是否为计算属性
    this.watch = watch || false // 是否为监听属性
    this.callback = callback // 回调函数,专门给watch用的
    this.proxy = {
      value: '', // 存储这个属性的值,在不需要更新的时候会直接取这个值
      dirty: true // 表示这个属性是否脏了(脏了代表需要重新运算更新这个值)
    }
    this.vm = vm

    if (computed) {
      this.dep = new Dep()
    } else if (watch) {
      this.watchGet()
    } else {
      this.get()
    }
  }
  update() {
    if (this.computed) {
      // 更新计算属性(不涉及渲染)
      this.dep!.notify()
    } else if (this.watch) {
      // 触发watch
      const oldValue = this.proxy.value
      this.watchGet()
      if (oldValue !== this.proxy.value) {
        this.callback && this.callback(this.proxy.value, oldValue)
      }
    } else {
      // 更新data, 触发依赖其的属性更新
      this.get()
    }
  }
  get() {
    // 存入当前上下文到依赖(表示当前是哪个属性在依赖其他属性,这样在其他属性发生变化时就知道应该通知谁了)
    pushTarget(this)

    // 目前只有计算属性才会调用 get 方法
    const value = this.computed ? computedMap.get(this.vm)!.call(this.vm) : ''
    if (value !== this.proxy.value) {
      this.proxy.dirty = false // 标记为不是脏的数据
      this.proxy.value = value // 缓存数据,在数据不脏的时候直接拿这个缓存值
    }
    popTarget() // 取出依赖
    return value
  }
  /**
   * 监听属性专用 - 拿到最新值并添加依赖
   */
  watchGet() {
    pushTarget(this) // 将当前上下文放入 Dep.target
    this.proxy.dirty = false // 设定不为脏数据
    if (this.getter) {
      this.proxy.value = this.getter() // 设定值(在这个过程中就给上了依赖)
    }
    popTarget() // 取出上面放入 Dep.target 的上下文
  }
  /**
   * 计算属性专用 - 添加依赖
   * 其他值用到了这个计算属性就会被记录添加到依赖中
   */
  depend() {
    this.dep!.addSub()
  }
}
