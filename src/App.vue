<template>
  <div id="app">
    <paper msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import paper from './components/paper.vue'

export default {
  name: 'app',
  components: {
    paper
  }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
