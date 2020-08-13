import Vue from 'vue'
import Router from 'vue-router'
import PDFJS from '@/components/PDFJS'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PDFJS',
      component: PDFJS
    }
  ]
})
