import { createApp } from 'vue'
import { createPinia } from 'pinia'

// element ui
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// icon-park
import '@icon-park/vue-next/styles/index.css'

import './styles/main.scss'
import './styles/mixins.scss'

import App from './App.vue'
import router from './router'

// svg-icon
import 'virtual:svg-icons-register'
// global component
import SvgIcon from './components/svg-icon.vue'
import ParkIcon from './components/park-icon.vue'
import TableList from './components/table-list.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(ElementPlus, {
  locale: zhCn
})

app.component(SvgIcon.name || 'svg-icon', SvgIcon)
app.component(ParkIcon.name || 'park-icon', ParkIcon)
app.component(TableList.name || 'vk-table-list', TableList)

app.mount('#app')
