<template>
  <div
    class="box-div"
    data-warden-title="xxx"
    data-warden-bigTitle="bigTitle"
    width="100%" sdfasd>
    <div
      style="border: 1px solid red"
      data-warden-test="test"
      data-warden-title="titletitle"
      data-warden-bing="bing"
      data-warden-event-id="ddd">
      <!-- <img src="../../public/face.jpg" alt="" /> -->
      <div class="asd">asdasdasd</div>
    </div>
    <div data-warden-id="我是ID">
      <button value="xxxxxx" ref="bun">1111</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'app.vue',
  created() {
    console.log('this.$trace', this.$trace);
  },
  mounted() {
    // console.log('bun', this.$refs.bun);
    // console.log('bun', this.$refs.bun.hasChildNodes());
  },
  methods: {
    test() {
    },
  },
};
</script>

<style>
.box-div {
  border: 1px solid green;
  height: 200px;
  padding: 10px;
}
.asd {
  border: 1px solid rgb(71, 1, 236);

}
</style>
