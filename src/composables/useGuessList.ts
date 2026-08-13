import { ref } from 'vue'

/**
 * 猜你喜欢：管理 CustomGuessLike 组件的引用与触底加载逻辑
 */
export const useGuessList = () => {
  // 猜你喜欢组件实例
  const guessRef = ref<{
    getMore: () => Promise<boolean>
    reset: () => Promise<void>
  }>()
  // 触底加载更多
  const onScrolltolower = () => {
    guessRef.value?.getMore()
  }
  // 重置列表
  const resetGuessList = () => {
    guessRef.value?.reset()
  }
  return { guessRef, onScrolltolower, resetGuessList }
}
