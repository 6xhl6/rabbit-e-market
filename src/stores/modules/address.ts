import type { Address } from '@/types/member'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useAddressStore = defineStore(
  'address',
  () => {
    const selectedAddress = ref<Address>()
    const setSelectedAddress = (address: Address) => {
      selectedAddress.value = address
    }
    return { selectedAddress, setSelectedAddress }
  },
  {
    persist: {
      storage: {
        setItem: uni.setStorageSync,
        getItem: uni.getStorageSync,
      },
    },
  },
)
export default useAddressStore
