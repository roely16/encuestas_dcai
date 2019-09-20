import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Encuesta from './views/Encuesta.vue'
import EditarEncuesta from './views/EditarEncuesta.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/nueva_encuesta',
      name: 'nueva_encuesta',
      component: Encuesta
    },
    {
      path: '/editar_encuesta',
      name: 'editar_encuesta',
      component: EditarEncuesta, 
      props: true
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
