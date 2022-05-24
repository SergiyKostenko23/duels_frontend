<template>
  <div>
    <title>Duels</title>
    <navigation :key="$route.path"/>
    <div id="app">
      <router-view style="margin-top: 53px;"></router-view>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Vue2Filters from 'vue2-filters'
import Login from '@/components/Login.vue'
import Navigation from '@/components/Navigation.vue'
import VueSession from 'vue-session'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Paginate from 'vuejs-paginate2'

Vue.component('paginate', Paginate)
Vue.use(VueAxios, axios)
Vue.use(Vue2Filters)
Vue.use(require('vue-cookies'))
Vue.use(VueSession)
export default {
  name: 'app',
  components: {
    Navigation
  },
  data() {
    return {
      componentKey: 0
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: rgba(199, 193, 193, 0.867);
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
