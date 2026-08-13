<script setup lang="ts">
import PageSkeleton from '@/components/PageSkeleton.vue'
import { onLoad, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { ref } from 'vue'

import type { Banner, Category, Hot, Guess } from '@/types/home'
import type { CustomGuessInstance } from '@/types/component'

import CustomNavBar from './components/CustomNavBar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import { getBannerService, getCategoryService, getHotService } from '@/services/home'

const isLoading = ref(false)

const bannerData = ref<Banner[]>([])
const categoryData = ref<Category[]>([])
const hotData = ref<Hot[]>([])
const guessLikeRef = ref<CustomGuessInstance>()

const getBannerData = async () => {
  const res = await getBannerService()
  bannerData.value = res.result
}
const getCategoryData = async () => {
  const res = await getCategoryService()
  categoryData.value = res.result
  console.log(categoryData.value)
}
const getHotData = async () => {
  const res = await getHotService()
  hotData.value = res.result
}
// 首页数据（banner / 分类 / 热门）
const loadPageData = () => {
  return Promise.all([getBannerData(), getCategoryData(), getHotData()])
}
onLoad(async () => {
  isLoading.value = true
  await loadPageData()
  isLoading.value = false
})
// 下拉刷新
onPullDownRefresh(async () => {
  await Promise.all([loadPageData(), guessLikeRef.value?.reset()])
  uni.stopPullDownRefresh()
})
// 滚动触底
onReachBottom(async () => {
  if (guessLikeRef.value?.finish) return
  // 调用子组件暴露的 getMore 方法，加载更多猜你喜欢数据
  uni.showLoading({
    title: '加载中',
  })
  await guessLikeRef.value?.getMore()
  uni.hideLoading()
})
</script>

<template>
  <!-- 固定导航栏 -->
  <CustomNavBar />
  <PageSkeleton v-if="isLoading" />
  <!-- 首页数据 -->
  <template v-else>
    <CustomSwiper :bannerData="bannerData" />
    <CategoryPanel :categoryData="categoryData" />
    <HotPanel :hotData="hotData" />
    <CustomGuessLike ref="guessLikeRef" />
  </template>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
}
</style>
