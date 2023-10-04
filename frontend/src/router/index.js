import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EncryptView from '../views/EncryptView.vue'
import DecryptView from '../views/DecryptView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/EncryptView',
      name: 'encrypt',
      component: EncryptView    
    },
    {
      path: '/DecryptView',
      name: 'decrypt',
      component: DecryptView    
    },
   
  ]
})

export default router
