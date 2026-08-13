import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginResult } from '@/types/login'
import type { UpdateProfileParams } from '@/types/member'

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const profile = ref<LoginResult>()

    // 保存会员信息，登录时使用
    const setProfile = (val: LoginResult) => {
      profile.value = val
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }
    // 更新会员头像
    const updateAvatar = (val: string) => {
      profile.value!.avatar = val
    }
    // 更新会员信息
    const updateProfile = (val: UpdateProfileParams) => {
      profile.value!.nickname = val.nickname
    }

    // 记得 return
    return {
      profile,
      setProfile,
      clearProfile,
      updateAvatar,
      updateProfile,
    }
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
