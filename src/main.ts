import { createApp } from 'vue'
import { createPinia } from 'pinia'

// element ui
import ElementPlus from 'element-plus'

import i18n from './i18n'

// icon-park
import '@icon-park/vue-next/styles/index.css'

import './styles/main.scss'
import './styles/mixins.scss'
import './styles/tailwind.scss'

import App from './App.vue'
import router from './router'

// svg-icon
import 'virtual:svg-icons-register'
// global component
import SvgIcon from './components/svg-icon.vue'
import ParkIcon from './components/park-icon.vue'

const app = createApp(App)

app.component(SvgIcon.name || 'svg-icon', SvgIcon)
app.component(ParkIcon.name || 'park-icon', ParkIcon)

app.use(createPinia()).use(router).use(ElementPlus).use(i18n)

app.mount('#app')
