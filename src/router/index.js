import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index'
import Login from '../views/Login.vue'
import Module from '../views/Module.vue'
import Exercise from '../views/Exercise.vue'

async function beforeEnter (_to, _from, next) {
  if (!store.getters['user/isAuthenticated']) {
    await store.dispatch('user/fetchUser')
  }
  if (store.getters['user/isAuthenticated']) {
    next()
    return
  }
  next('/login')
}

// the function continues in the second panel, not enough space here
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter // notice this new property
  },
  {
    path: '/module/:id',
    name: 'Module',
    component: Module,
    beforeEnter
  },
  {
    path: '/module/:moduleId/session/:sessionId/exercise/:exerciseId',
    name: 'Exercise',
    component: Exercise,
    beforeEnter
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/activities',
    name: 'Activities',
    component: () => import('../views/Activities.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
Vue.use(VueRouter)
