/// <reference types="vite/client" />
import ParkIcon from 'src/components/park-icon.vue'
import SvgIcon from 'src/components/svg-icon.vue'
import TableList from 'src/components/table-list.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ParkIcon: typeof ParkIcon
    SvgIcon: typeof SvgIcon
    TableList: typeof TableList
  }
}

interface ImportMetaEnv {
  // Auto generate by env-parse
  /**
   * title
   */
  readonly VITE_APP_TITLE: string
  /**
   * app code
   */
  readonly VITE_APP_CODE: string
  /**
   * https://cn.vitejs.dev/config/shared-options.html#base
   */
  readonly VITE_APP_BASE_PATH: string
}
