if (typeof window === 'undefined' && typeof global !== 'undefined') {
  ;(global as any).window = global
  ;(global as any).self = global
  if (!(global as any).requestAnimationFrame) {
    ;(global as any).requestAnimationFrame = (callback: any) =>
      setTimeout(callback, 0)
  }
  if (!(global as any).cancelAnimationFrame) {
    ;(global as any).cancelAnimationFrame = (id: any) => clearTimeout(id)
  }
}
