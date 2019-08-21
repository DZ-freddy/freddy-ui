<template>
  <div id="app">
      <aside class="app-aside">
          <router-link class="active" to="/components/searchSelectorTree">树状多选组件</router-link>
          <router-link to="/components/searchSelectorTree">树状多选组件2</router-link>
      </aside>
      <main class="app-main">
          <router-view/>
      </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
    body { margin: 0; }
  #app {
      position:relative;
      .app-aside {
          width: 200px;
          height: 100vh;
          background: #333333;
          color: #8f8f8f;
          transition-property: color, background-color;
          transition: 3s;
      }
      .app-aside a {
          margin-bottom:2px;
          display: block;
          text-align: center;
          line-height: 32px;
          text-decoration:none;
          color:#8f8f8f;
      }
      .app-aside .active {
          color:#fff;
      }
      .app-aside a:hover {
          color:#fff;
          background: #4175bd;
      }
      .app-main {
          position:absolute;
          top:0;
          left: 200px;
          width: calc(100% - 200px);
          height: 100vh;
      }
  }
</style>
