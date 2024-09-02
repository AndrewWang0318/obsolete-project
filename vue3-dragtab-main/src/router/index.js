import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect:"/Home"
  },
  {
    path: '/About',
    name: 'About',
    component: () => import('@/views/About.vue')
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/Title',
    name: 'Title',
    component: () => import('@/views/Title.vue')
  },
  {
    path: '/Error',
    name: 'Error',
    component: () => import('@/views/Error.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
