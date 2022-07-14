import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Maska from 'maska'

Vue.use(Maska)

/* import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; */


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
