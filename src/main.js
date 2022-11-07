import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './plugins'
import apiServices from './util/request'
import hasPermission from './util/permissions'
import store from './store'
import { sync } from 'vuex-router-sync'
// import VueFileAgent from 'vue-file-agent';
import VueFileAgentStyles from 'vue-file-agent/dist/vue-file-agent.css';
// import VueApexCharts from 'vue-apexcharts'
import CKEditor from '@ckeditor/ckeditor5-vue2'

Vue.use(CKEditor);
/* CHART COMPONENT */
// Vue.use(VueApexCharts)
// Vue.component('apexchart', VueApexCharts)

/* FILE UPLOAD COMPONENT */
// Vue.use(VueFileAgent);

/* FUNCION QUE DETERMINA PERMISO DE USUARIO */
Vue.use(hasPermission);

Vue.config.productionTip = false

Vue.prototype.$api = apiServices;

sync(store, router)

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App),
}).$mount('#app')
