/// <reference types="vite/client" />
import ParkIcon from './components/park-icon.vue'
import SvgIcon from './components/svg-icon.vue'
import TableList from './components/table-list.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ParkIcon: typeof ParkIcon
    SvgIcon: typeof SvgIcon
    TableList: typeof TableList
  }
}
