import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Registar from '../components/Registar.vue'
import Profile from '../components/Profile.vue'
import Duels from '../components/Duels.vue'
import MyDuels from '../components/MyDuels.vue'
import Items from '../components/Items.vue'
import DoDuels from '../components/DoDuels.vue'
import Results from '../components/MyResults.vue'
import Home from '../components/Home.vue'
import AddDuel from '../components/AddDuel.vue'
import Game from '../components/Game.vue'
import VueSession from 'vue-session'

Vue.use(VueRouter)
Vue.use(VueSession)
const noAuthenticationRequired = (to, from, next) => {
  next()
}

// Limpa o local storage
const noAuthenticationRequiredLogin = (to, from, next) => {
  window.localStorage.clear()
  next()
}

// Verifica se o utilizador está logado
const requiresAuthentication = (to, from, next) => {
  if(window.localStorage.getItem('token') != null)
        return next()
      else
        next('/login')
}

  const routes = [
    {
      path: '*',
      beforeEnter: noAuthenticationRequired,
      component: Home
    },
    {
      path: '/myduels',
      name: 'myduels',
      beforeEnter: requiresAuthentication,
      component: MyDuels
    },
    {
      path: '/game',
      name: 'game',
      beforeEnter: requiresAuthentication,
      component: Game
    },
    {
      path: '/duels',
      name: 'duels',
      beforeEnter: noAuthenticationRequired,
      component: Duels
    },
    {
      path: '/results',
      name: 'results',
      beforeEnter: requiresAuthentication,
      component: Results,
    },
    {
      path: '/adduel',
      name: 'adduel',
      beforeEnter: requiresAuthentication,
      component: AddDuel,
    },
    {
      path: '/myduels/items/:slug',
      name: 'items',
      beforeEnter: requiresAuthentication,
      component: Items,
      props: true,
    },
    {
      path: '/doduels/:slug',
      name: 'doduels',
      beforeEnter: requiresAuthentication,
      component: DoDuels,
      props: true,
    },
    {
      path: '/',
      name: 'Home',
      beforeEnter: noAuthenticationRequired,
      component: Home
    },
    {
      path: '/profile',
      name: 'Profile',
      beforeEnter: requiresAuthentication,
      component: Profile
    },
    {
      path: '/login',
      name: 'Login',
      beforeEnter: noAuthenticationRequiredLogin,
      component: Login
    },
    {
      path: '/registar',
      name: 'Registar',
      beforeEnter: noAuthenticationRequired,
      component: Registar
    }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
