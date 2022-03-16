import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/signature-pad'
import './plugins/base'
import './plugins/helper'
import './plugins/chartist'
import './plugins/vue-session'
import './plugins/vee-validate'
import './plugins/vuetify-google-autocomplete'
import vuetify from './plugins/vuetify'
import i18n from './i18n'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
