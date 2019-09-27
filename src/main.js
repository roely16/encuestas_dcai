import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearch, faPlus, faSave, faTimesCircle, faCloudUploadAlt, faEdit, faTrashAlt, faCog, faCloudDownloadAlt, faInfoCircle, faSyncAlt, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSearch, faPlus, faSave, faTimesCircle, faCloudUploadAlt, faEdit, faTrashAlt, faCog, faCloudDownloadAlt, faInfoCircle, faSyncAlt, faHome)
 
Vue.component('font-awesome-icon', FontAwesomeIcon)

import Multiselect from 'vue-multiselect'
Vue.component('multiselect', Multiselect)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
