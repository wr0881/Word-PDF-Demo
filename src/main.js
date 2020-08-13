// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import uploader from 'vue-simple-uploader'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './http';

Vue.config.productionTip = false

import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(iView)

//Vue.use(uploader)
Vue.use(ElementUI)
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
