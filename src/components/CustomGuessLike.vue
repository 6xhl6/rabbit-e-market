<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Guess } from '@/types/home'
import type { PageParams } from '@/types/global'
import { getGuessService } from '@/services/home'
const pageParams = ref<Required<PageParams>>({
  page: 1,
  pageSize: 10,
})
const finish = ref(false)
const isLoading = ref(false)
const isLastPage = ref(false)

const guessData = ref<Guess[]>([])
const getGuessData = async (showLoading = true): Promise<boolean> => {
  // 加载锁 + 已全部结束，不再处理
  if (finish.value || isLoading.value) return false

  // 已是最后一页，用户再次触底 → 提示"没有更多了"
  if (isLastPage.value) {
    finish.value = true
    uni.showToast({ title: '没有更多了', icon: 'none' })
    return false
  }

  isLoading.value = true
  if (showLoading) {
    uni.showLoading({ title: '加载中' })
  }
  const res = await getGuessService(pageParams.value)
  guessData.value.push(...res.result.items)
  if (showLoading) {
    uni.hideLoading()
  }
  if (pageParams.value.page < res.result.pages) {
    pageParams.value.page++
  } else {
    // 最后一页加载完毕，不立即提示，等用户再次触底才显示"没有更多了"
    isLastPage.value = true
  }
  isLoading.value = false
  return true
}
const resetGuessData = async () => {
  pageParams.value.page = 1
  guessData.value = []
  finish.value = false
  isLastPage.value = false
  await getGuessData()
}
defineExpose({
  getMore: getGuessData,
  reset: resetGuessData,
  finish,
})
onMounted(() => {
  // 挂载时静默加载，不显示 loading toast
  getGuessData(false)
})
</script>

<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">猜你喜欢</text>
  </view>
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="item in guessData"
      :key="item.id"
      :url="`/pages/goods/goods?id=${item.id}`"
    >
      <image class="image" mode="aspectFill" :src="item.picture"></image>
      <view class="name"> {{ item.name }}</view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ item.price }}</text>
      </view>
    </navigator>
  </view>
  <view class="loading-text">
    {{ finish ? '没有更多了' : isLoading ? '正在加载...' : '' }}
  </view>
</template>

<style lang="scss">
:host {
  display: block;
}

/* 分类标题 */
.caption {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  color: #262626;

  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 28rpx 0 30rpx;

    &::before,
    &::after {
      content: '';
      width: 20rpx;
      height: 20rpx;
      background-image: url(@/static/images/bubble.png);
      background-size: contain;
      margin: 0 10rpx;
    }
  }
}

/* 猜你喜欢 */
.guess {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;

  .guess-item {
    width: 345rpx;
    padding: 24rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }

  .image {
    width: 304rpx;
    height: 304rpx;
  }

  .name {
    height: 75rpx;
    margin: 10rpx 0;
    font-size: 26rpx;
    color: #262626;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .price {
    line-height: 1;
    padding-top: 4rpx;
    color: #cf4444;
    font-size: 26rpx;
  }

  .small {
    font-size: 80%;
  }
}

// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
