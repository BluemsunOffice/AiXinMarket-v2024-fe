import { clearAuth } from '@/utils/auth'

export default {
  onBeforeUnmount() {
    clearAuth()
    console.log('Token and role have been removed from localStorage')
  },
}
