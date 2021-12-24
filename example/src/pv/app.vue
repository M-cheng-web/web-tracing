<template>
  <div id="app">
    <p>单页应用切换路由</p>
    <div id="nav">
      <router-link to="/pv-foo">foo</router-link>
      <router-link to="/pv-bar">bar</router-link>
    </div>
    <router-view />
  </div>
</template>
