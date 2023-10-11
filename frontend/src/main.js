import './assets/styles.css'
import 'bootstrap/dist/css/bootstrap.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft, faHouse } from '@fortawesome/free-solid-svg-icons'

library.add(faArrowLeft, faHouse)

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.use(router)
.mount('#app')
