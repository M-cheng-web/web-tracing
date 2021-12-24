<template>
  <div>
    <div>
      <!-- <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg3.mu" /> -->
    </div>
    <div>
      <!-- <audio src="someaudio.wav"></audio> -->
    </div>
    <div>
      <!-- <video src="movie.ogg" controls="controls"/> -->
    </div>
    <div>
      <button @click="sendBizErr">上报自定义错误</button>
    </div>
  </div>
</template>

<script>
import err from '../../../src/err';

export default {
  created() {
    window.sss();
  },
  mounted() {
    // vue内的代码报错会触发两次报错, 一个是vue的报错,一个是console.error的报错
    // 这种场景下vue的报错并不会 e instanceof Error

    // vue无法捕获异步的错误
    // setTimeout(() => {
    //   window.createAsyncError();
    // }, 1000);
    // window.createError();
  },
  methods: {
    in() {
      if (window.Promise) {
        return new Promise((resolve) => {
          // 一段耗时的异步操作
          // eee.eew();
          resolve('成功'); // 数据处理完成
          // eslint-disable-next-line prefer-promise-reject-errors
          // throw new Error('custom');
        }).then(
          (res) => { console.log(res); }, // 成功
        );
      }
    },
    sendBizErr() {
      err.traceError('biz', '业务异常', {
        src: '/interface/order',
        params: {
          id: '12121',
        },
      });
    },
  },
};
</script>
