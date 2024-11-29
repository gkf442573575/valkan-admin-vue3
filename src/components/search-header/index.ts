import { withInstall } from '@/utils/install'

import _SearchHeader from './index.vue'

export interface SearchColItem {
  key: string
  type: 'input' | 'select' | 'date' | 'dateTime' | 'slot'
  label?: string
  labelWidth?: string | number
  placeholder?: string
  senior?: boolean
  options?: any
}

export type SearchHeaderInstance = InstanceType<typeof _SearchHeader>

export const SearchHeader = withInstall(_SearchHeader)

export default SearchHeader
