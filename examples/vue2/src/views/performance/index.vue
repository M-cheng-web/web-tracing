<template>
  <div>
    <div class="group badge badge-pill badge-primary">
      Performance 异步加载资源
    </div>
    <div class="group">
      <el-button type="primary" plain @click="performanceAddScript">
        插入正确Script
      </el-button>
      <el-button type="danger" plain @click="performanceAddScriptError">
        插入错误Script
      </el-button>
      <div>
        tip: 加载错误的资源会产生两个事件【1.资源本身的加载情况 2.报错情况】
      </div>
    </div>
    <el-button class="group" type="primary" plain @click="performanceAddLink">
      插入Link
    </el-button>
    <div class="group">
      <el-button type="primary" plain @click="performanceAddImg">
        插入Img
      </el-button>
      <el-button type="primary" plain @click="performanceAddLocalImg">
        插入Base64图片(不涉及请求所以无需采集)
      </el-button>
      <div id="performance-img-div" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'bar',
  methods: {
    performanceAddScript() {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/lodash'
      document.head.appendChild(script)
    },
    performanceAddScriptError() {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/lodash22'
      document.head.appendChild(script)
    },
    performanceAddLink() {
      const link = document.createElement('link')
      link.type = 'text/css'
      link.rel = 'stylesheet'
      link.href = 'https://ahooks.js.org/useExternal/bootstrap-badge.css'
      document.head.appendChild(link)
    },
    performanceAddImg() {
      const img = document.createElement('img')
      img.src = `https://cdn.staticaly.com/gh/M-cheng-web/image-provider@main/blog/Annapurna-Ranges-2560x1440.5r9m9t5vg1g0.webp`
      const div = document.getElementById('performance-img-div')
      div.style =
        'width: 400px; height: 400px; overflow: hidden; margin-top: 20px'
      div.appendChild(img)
    },
    performanceAddLocalImg() {
      const img = document.createElement('img')
      img.src =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAMAAAD+dOxOAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACEFBMVEU3R09BSE3/aAD/VyIAAAA3R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R080R1A0R1A1R08yR1AwRlA1R081R1A1R081R081R080R1A2R082R08vRlH4ViT/Whr/Whn/Wxb/WB7/WB//VyL/Wxj/XRD/Xg//XBX/WRv/XRH/XBX/WB7/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/ViH/VR//VSD/ViD+az39pYn8qY79qI78qpD+h2H+glv71cr9mHj9lnb9l3f+fFP+dEn8w7H/WiX/Uhv/Uxz+aDj7zr/9imX+fVT+flX+cET/WCP/XCj9qI38vqr8u6f8u6b8x7f8x7b/XSr/WCT/WSX+f1f8wK3/Wib+flb+hV//VB78tqD/VB/9iWX8vqv/Ux39m3z8rJP8xbT9oIP9jWn7z8L9jmr/YzL+f1j9o4f9mHn+cUQAAABiXhJiAAAAcXRSTlMAAAAAAAoJDQgdJREGARBWhZNAlNBUd3NLmmxr0dU9Pq0L6N3DtwIvOEYaFUk+V1lMLYNbAwIJCgkLCwsJCAgJCggIAji7xcRD9C/nH9sTzAkDp5N9aFT8QfYw7iDi4wZbpdf+5a9eAhlFgNaqYycFG/l+tLAAAAABYktHRASPaNlRAAAACXBIWXMAAAB4AAAAeACd9VpgAAAAB3RJTUUH5QISCDAI1QMDnAAAAUpJREFUGNNjYGBlY+fg5OJm5+HlY2NnAAJ+AUEhYRFRMXEJSX4pkIC0jKycvIKioJKyirSqvBoDo7qGppa2DpOunr6BoZGxCYOpmbmFpZWFtY2tnb2Do5Mzg4urmzscuLm6MHh4FiIBTw8GL+/ComIoKCn09mLw8S0tK6+oBIGq6kJfHwY//+Ka2rp6EGhoLPT3YwhwLWlqbmkFgbaSQtcAhsCgovaOzq5uIOjpLQwKZGAOLuzrnzBx4sRJk6dMLQxmZmAOAdo2bfr06YUzZs4qDAEKhBaWzJ5TUlg4t3NeYWEoUCAsfP6ChX3FcxctXlIcHgYUiIgsal86c9nyJStWFkdGAAWiogsLV61eM2/tupbC6CigQExsIcjxhUCHF8bFAAXiExKTIkEeS05JTYsHCjAzp2dkZrlm5+Tm5QM5DCzMYGBdEA+mWQDainMpZaFBiAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0xOVQwMzozOToxNSswMDowMFrQJhgAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDEtMDhUMjA6MDc6NTUrMDA6MDAY1ESzAAAAIHRFWHRzb2Z0d2FyZQBodHRwczovL2ltYWdlbWFnaWNrLm9yZ7zPHZ0AAABjdEVYdHN2Zzpjb21tZW50ACBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIM5IkAsAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADcwNHxxE5sAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTAxnG5jJwAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTQ2OTc4MDc1s6i/GQAAABJ0RVh0VGh1bWI6OlNpemUAMjkxNjhCM09TOQAAAFp0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2RhdGEvd3d3cm9vdC93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vZmlsZXMvMTIxLzEyMTAxOTAucG5no98usQAAAABJRU5ErkJggg=='
      const div = document.getElementById('performance-img-div')
      div.style =
        'width: 100px; height: 100px; overflow: hidden; margin-top: 20px'
      div.appendChild(img)
    }
  }
}
</script>

<style lang="scss">
.group {
  margin-bottom: 30px;
}
</style>
