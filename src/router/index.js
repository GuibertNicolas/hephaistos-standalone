import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import axios from 'axios'

function createRouter (state) {
  async function beforeEnter (to, from, next) {
    try {
      const { data: user } = await axios.get('http://localhost:3000/api/v1/me')
      state.user = user
      next()
    } catch (err) {
      console.log('err', err)
      next() // redirect to login if user is not authenticated
    }
  }
  // the function continues in the second panel, not enough space here
  const routes = [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter // notice this new property
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
      path: '/activities',
      name: 'Activities',
      component: () => import('../views/Activities.vue')
    }
    // the rest of what was already there
  ]

  return new VueRouter({
    routes
  })
}
export default createRouter
Vue.use(VueRouter)
