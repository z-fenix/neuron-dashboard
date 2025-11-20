import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

import '@/styles/ui-variables.scss'
import '@/styles/reset.scss'
import '@/styles/colors.scss'
import '@/styles/common.scss'
import '@/styles/kuiper.scss'
import '@/styles/index.scss'

import '@/assets/fonts/iconfont.css'
import '@/assets/fonts/iconfont'

createApp(App).use(i18n).use(ElementPlus).use(store).use(router).mount('#neuron-dashboard')
