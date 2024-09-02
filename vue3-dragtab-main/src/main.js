import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import DragTab from '@/components/index'
import $mutil from 'vue3-mutil'

createApp(App).use(router).use(DragTab).use($mutil).mount('#app')
