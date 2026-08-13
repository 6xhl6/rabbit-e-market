<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { CategoryL1 } from '@/types/category'
import CategorySkeleton from './components/CategorySkeleton.vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getCategoryList } from '@/services/category'
import type { Banner } from '@/types/home'
import { getBannerService } from '@/services/home'
import { consumeCategoryNavFromHome } from '@/utils/categoryNav'

const categoryList = ref<CategoryL1[]>([])
const subCategoryList = computed(() => categoryList.value[activeIndex.value]?.children || [])
const bannerData = ref<Banner[]>([])

const getCategoryData = async () => {
  const res = await getCategoryList()
  console.log('分类数据：', res.result)
  categoryList.value = res.result
}
const getBannerData = async () => {
  const res = await getBannerService({ distributionSite: 2 })
  console.log('轮播图数据：', res.result)
  bannerData.value = res.result
}
const activeIndex = ref(0)
const searchText = ref('')

const isFinishLoad = ref(false)
const locateCategory = () => {
  // 数据未加载完成时不处理（首次进入时 onShow 会先于接口返回触发，避免误消费标志）
  if (categoryList.value.length === 0) return
  // 来自首页跳转：定位到指定分类
  if (consumeCategoryNavFromHome()) {
    const categoryId = uni.getStorageSync('categoryId')
    const index = categoryList.value.findIndex((item) => item.id === categoryId)
    if (index !== -1) {
      activeIndex.value = index
      return
    }
  }
  // 从 tabbar 进入（或未命中指定分类）：默认为第一个分类
  activeIndex.value = 0
}
onLoad(() => {
  Promise.all([getCategoryData(), getBannerData()]).then(() => {
    locateCategory()
    isFinishLoad.value = true
  })
})
onShow(() => {
  locateCategory()
})
// 监听一级分类切换，重置滚动位置

const scrollTop = ref(0)
watch(
  () => activeIndex.value,
  () => {
    // 先设一个非零值"欺骗"组件，再在下一帧归零
    scrollTop.value = 1
    nextTick(() => {
      scrollTop.value = 0
    })
  },
)
const handleSearch = () => {
  uni.navigateTo({
    url: '/pages/search/search',
  })
}
</script>

<template>
  <view class="viewport" v-if="isFinishLoad">
    <!-- 搜索框 -->
    <view class="search" @tap="handleSearch">
      <view class="input">
        <text class="icon-search">{{ searchText }}</text>
      </view>
    </view>
    <!-- 分类 -->
    <view class="categories">
      <!-- 左侧：一级分类 -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in categoryList"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex }"
          @tap="activeIndex = index"
        >
          <text class="name">{{ item.name }}</text>
        </view>
      </scroll-view>
      <!-- 右侧：二级分类 -->
      <scroll-view class="secondary" scroll-y :scroll-top="scrollTop">
        <!-- 焦点图 -->
        <CustomSwiper class="banner" :bannerData="bannerData" />
        <!-- 内容区域 -->
        <view class="panel" v-for="item in subCategoryList" :key="item.id">
          <view class="title">
            <text class="name">{{ item.name }}</text>
            <navigator class="more" hover-class="none">全部</navigator>
          </view>
          <view class="section">
            <navigator
              v-for="goodsItem in item.goods"
              :key="goodsItem.id"
              class="goods"
              hover-class="none"
              :url="`/pages/goods/goods?id=${goodsItem.id}`"
            >
              <image class="image" :src="goodsItem.picture"></image>
              <view class="name ellipsis">{{ goodsItem.name }}</view>
              <view class="price">
                <text class="symbol">¥</text>
                <text class="number">{{ goodsItem.price }}</text>
              </view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
  <CategorySkeleton v-else />
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search {
  padding: 0 30rpx 20rpx;
  background-color: #fff;

  .input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64rpx;
    padding-left: 26rpx;
    color: #8b8b8b;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: #f3f4f4;
  }
}

.icon-search {
  &::before {
    margin-right: 10rpx;
  }
}

/* 分类 */
.categories {
  flex: 1;
  min-height: 400rpx;
  display: flex;
}

/* 一级分类 */
.primary {
  overflow: hidden;
  width: 180rpx;
  flex: none;
  background-color: #f6f6f6;

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96rpx;
    font-size: 26rpx;
    color: #595c63;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 42rpx;
      bottom: 0;
      width: 96rpx;
      border-top: 1rpx solid #e3e4e7;
    }
  }

  .active {
    background-color: #fff;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 8rpx;
      height: 100%;
      background-color: #27ba9b;
    }
  }
}

.primary .item:last-child::after,
.primary .active::after {
  display: none;
}

/* 二级分类 */
.secondary {
  background-color: #fff;

  .carousel {
    height: 200rpx;
    margin: 0 30rpx 20rpx;
    border-radius: 4rpx;
    overflow: hidden;
  }

  .panel {
    margin: 0 30rpx 0rpx;
  }

  .title {
    height: 60rpx;
    line-height: 60rpx;
    color: #333;
    font-size: 28rpx;
    border-bottom: 1rpx solid #f7f7f8;

    .more {
      float: right;
      padding-left: 20rpx;
      font-size: 24rpx;
      color: #999;
    }
  }

  .more {
    &::after {
      font-family: 'erabbit' !important;
      content: '\e6c2';
    }
  }

  .section {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx 0;

    .goods {
      width: 150rpx;
      margin: 0rpx 30rpx 20rpx 0;

      &:nth-child(3n) {
        margin-right: 0;
      }

      image {
        width: 150rpx;
        height: 150rpx;
      }

      .name {
        padding: 5rpx;
        font-size: 22rpx;
        color: #333;
      }

      .price {
        padding: 5rpx;
        font-size: 18rpx;
        color: #cf4444;
      }

      .number {
        font-size: 24rpx;
        margin-left: 2rpx;
      }
    }
  }
}
</style>
