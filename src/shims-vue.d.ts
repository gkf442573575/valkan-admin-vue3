import SvgIcon from './components/svg-icon.vue'
import ParkIcon from './components/park-icon.vue'

import TableList from './components/table-list'
import SearchHeader from './components/search-header'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    'svg-icon': typeof SvgIcon
    'park-icon': typeof ParkIcon
    'table-list': typeof TableList
    'search-header': typeof SearchHeader
  }
}
