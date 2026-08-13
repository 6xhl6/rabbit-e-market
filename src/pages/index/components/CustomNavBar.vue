<script setup lang="ts">
import type { SearchParams } from '@/types/search'
import { ref } from 'vue'

// 动态获取不同型号手机安全区域顶部距离
const { safeArea } = uni.getWindowInfo()
console.log(safeArea)
// 扫描二维码
const handleScan = () => {
  uni.scanCode({
    success: (res) => {
      console.log(res)
    },
  })
}
const onSearch = () => {
  uni.navigateTo({ url: '/pages/search/search' })
}
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeArea?.top + 'px' }">
    <!-- logo文字 -->
    <view class="logo">
      <image class="logo-image" src="@/static/images/logo.png"></image>
      <text class="logo-text">新鲜 · 亲民 · 快捷</text>
    </view>
    <!-- 搜索条：点击跳转搜索页 -->
    <view class="search" @tap="onSearch">
      <text class="icon-search"></text>
      <view class="search-input">搜索商品</view>
      <!-- #ifdef MP-WEIXIN -->
      <text class="icon-scan" @tap.stop="handleScan"></text>
      <!-- #endif -->
    </view>
  </view>
</template>

<style lang="scss">
/* 自定义导航条 */
.navbar {
  background-image: url(@/static/images/navigator_bg.png);
  background-size: cover;
  position: sticky;
  top: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    padding-top: 20rpx;

    .logo-image {
      width: 166rpx;
      height: 39rpx;
    }

    .logo-text {
      flex: 1;
      line-height: 28rpx;
      color: #fff;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid #fff;
      font-size: 26rpx;
    }
  }

  .search {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx 0 26rpx;
    height: 64rpx;
    margin: 16rpx 20rpx;
    color: #fff;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: rgba(255, 255, 255, 0.5);
  }

  .icon-search {
    position: absolute;
    left: 20rpx;

    &::before {
      margin-right: 10rpx;
    }
  }

  .icon-scan {
    position: absolute;
    right: 20rpx;
    font-size: 30rpx;
    padding: 15rpx;
  }

  .search-input {
    flex: 1;
    padding-left: 40rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}
</style>
