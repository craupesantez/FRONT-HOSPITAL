import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueTextareaAutosize from 'vue-textarea-autosize'
import moment from 'moment'
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' //Vuesax styles
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key:"AIzaSyD9PncAFCV19m4reGeQsAwYz-3e55dILFY" //"AIzaSyDp3Ud3SixagW8bJOwtosy5bBMB5JRNS_k",
  },
});

Vue.prototype.moment = moment

Vue.use(VueAxios, axios)

Vue.use(Vuesax, {
  // options here
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
