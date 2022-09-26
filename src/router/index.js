import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login'
import service from '../views/service'
import index from '../views/service/index'
import awards from '../views/service/awards'
import classes from '../views/service/class'
import from from '../views/service/from'
import info from '../views/service/info'
import sex from '../views/service/sex'
import superman from '../views/service/superman'
import teacher from '../views/service/teacher'
import togo from '../views/service/togo'
import building from '../views/service/photo/building'
import campus from '../views/service/photo/campus'
import graduation from '../views/service/photo/graduation'
import life from '../views/service/photo/life'
import position from '../views/service/photo/position'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: login
}, {
  path: '/service',
  component: service,
  redirect: '/service/index',
  children: [{
    path: '/service/index',
    name: 'index',
    component: index
  }, {
    path: '/service/awards',
    name: 'awards',
    component: awards
  }, {
    path: '/service/class',
    name: 'class',
    component: classes
  }, {
    path: '/service/from',
    name: 'from',
    component: from
  }, {
    path: '/service/info',
    name: 'info',
    component: info
  }, {
    path: '/service/sex',
    name: 'sex',
    component: sex
  }, {
    path: '/service/teacher',
    name: 'teacher',
    component: teacher
  }, {
    path: '/service/superman',
    name: 'superman',
    component: superman
  }, {
    path: '/service/togo',
    name: 'togo',
    component: togo
  }, {
    path: '/service/building',
    name: 'building',
    component: building
  }, {
    path: '/service/campus',
    name: 'campus',
    component: campus
  }, {
    path: '/service/graduation',
    name: 'graduation',
    component: graduation
  }, {
    path: '/service/life',
    name: 'life',
    component: life
  }, {
    path: '/service/position',
    name: 'position',
    component: position
  }]
}]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (localStorage.getItem('btapex')) {
      next()
    } else {
      next({ path: '/login' })
    }
  }
})

export default router
