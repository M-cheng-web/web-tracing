<template>
<div>
  app.vue
  <br><br>
  <button @click="addScript">插入Script</button>
  <button @click="addLink">插入Link</button>
  <button @click="addCSS">插入引用其他资源的CSS文件</button>
  <button @click="addImg">插入Img</button>
  <button @click="addLocalImg">插入Base64图片</button>
  <button @click="addXHR">发送XMLHTTPRequest</button>
  <button @click="addErrXHR">发送异常的XMLHTTPRequest</button>
  <br><br>
</div>
</template>

<script>
export default {
  name: 'bar',
  methods: {
    addScript() {
      const script = document.createElement('script');
      script.src = 'http://172.15.4.131:4873/-/static/vendors.064cfdd8107ff39d68ca.js';
      document.head.appendChild(script);
    },
    addLink() {
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = 'http://172.15.4.131:4873/-/static/0.style.b3d2b69b057068c678ca.css';
      document.head.appendChild(link);
    },
    addCSS() {
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = '/a.css';
      document.head.appendChild(link);
    },
    addImg() {
      const img = document.createElement('img');
      const size = Math.ceil(Math.random() * 100);
      img.src = `https://p2.music.126.net/vB84V9nQ5PpwGt6oDuhxqg==/7984653441988970.jpg?param=${size}y${size}`;
      document.body.appendChild(img);
    },
    addLocalImg() {
      const img = document.createElement('img');
      document.body.appendChild(img);
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAMAAAD+dOxOAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACEFBMVEU3R09BSE3/aAD/VyIAAAA3R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R083R080R1A0R1A1R08yR1AwRlA1R081R1A1R081R081R080R1A2R082R08vRlH4ViT/Whr/Whn/Wxb/WB7/WB//VyL/Wxj/XRD/Xg//XBX/WRv/XRH/XBX/WB7/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/VyL/ViH/VR//VSD/ViD+az39pYn8qY79qI78qpD+h2H+glv71cr9mHj9lnb9l3f+fFP+dEn8w7H/WiX/Uhv/Uxz+aDj7zr/9imX+fVT+flX+cET/WCP/XCj9qI38vqr8u6f8u6b8x7f8x7b/XSr/WCT/WSX+f1f8wK3/Wib+flb+hV//VB78tqD/VB/9iWX8vqv/Ux39m3z8rJP8xbT9oIP9jWn7z8L9jmr/YzL+f1j9o4f9mHn+cUQAAABiXhJiAAAAcXRSTlMAAAAAAAoJDQgdJREGARBWhZNAlNBUd3NLmmxr0dU9Pq0L6N3DtwIvOEYaFUk+V1lMLYNbAwIJCgkLCwsJCAgJCggIAji7xcRD9C/nH9sTzAkDp5N9aFT8QfYw7iDi4wZbpdf+5a9eAhlFgNaqYycFG/l+tLAAAAABYktHRASPaNlRAAAACXBIWXMAAAB4AAAAeACd9VpgAAAAB3RJTUUH5QISCDAI1QMDnAAAAUpJREFUGNNjYGBlY+fg5OJm5+HlY2NnAAJ+AUEhYRFRMXEJSX4pkIC0jKycvIKioJKyirSqvBoDo7qGppa2DpOunr6BoZGxCYOpmbmFpZWFtY2tnb2Do5Mzg4urmzscuLm6MHh4FiIBTw8GL+/ComIoKCn09mLw8S0tK6+oBIGq6kJfHwY//+Ka2rp6EGhoLPT3YwhwLWlqbmkFgbaSQtcAhsCgovaOzq5uIOjpLQwKZGAOLuzrnzBx4sRJk6dMLQxmZmAOAdo2bfr06YUzZs4qDAEKhBaWzJ5TUlg4t3NeYWEoUCAsfP6ChX3FcxctXlIcHgYUiIgsal86c9nyJStWFkdGAAWiogsLV61eM2/tupbC6CigQExsIcjxhUCHF8bFAAXiExKTIkEeS05JTYsHCjAzp2dkZrlm5+Tm5QM5DCzMYGBdEA+mWQDainMpZaFBiAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0xOVQwMzozOToxNSswMDowMFrQJhgAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDEtMDhUMjA6MDc6NTUrMDA6MDAY1ESzAAAAIHRFWHRzb2Z0d2FyZQBodHRwczovL2ltYWdlbWFnaWNrLm9yZ7zPHZ0AAABjdEVYdHN2Zzpjb21tZW50ACBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIM5IkAsAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADcwNHxxE5sAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTAxnG5jJwAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTQ2OTc4MDc1s6i/GQAAABJ0RVh0VGh1bWI6OlNpemUAMjkxNjhCM09TOQAAAFp0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2RhdGEvd3d3cm9vdC93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vZmlsZXMvMTIxLzEyMTAxOTAucG5no98usQAAAABJRU5ErkJggg==';
    },
    addXHR() {
      const xhr = new XMLHttpRequest();
      xhr.open('get', `/index.html?t=${Date.now()}`);
      xhr.send();
    },
    addErrXHR() {
      const xhr = new XMLHttpRequest();
      xhr.open('post', '/not-found');
      xhr.send(JSON.stringify({}));
    },
  },
};
</script>
<style>

</style>
