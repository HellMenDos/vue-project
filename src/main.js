import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueLogger from 'vuejs-logger';
import router from './router';
import auth from './services/auth';

Vue.config.productionTip = false

Vue.use(VueLogger, {
  isEnabled: true,
  logLevel : process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '|',
  showConsoleColors: true
});

Vue.$auth = new auth();
Vue.prototype.$auth = Vue.$auth;

let $app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default $app
