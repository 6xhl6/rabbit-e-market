<script setup lang="ts">
import { ref } from 'vue'
import type { Banner } from '@/types/home'
import { markCategoryNavFromHome } from '@/utils/categoryNav'
const props = defineProps<{
  bannerData: Banner[]
}>()

const activeIndex = ref(0)

const handleChange: UniHelper.SwiperOnChange = (e) => {
  // ! 非空断言，主观上排除空值情况
  activeIndex.value = e.detail!.current
}
const handleClick = (item: Banner) => {
  uni.setStorageSync('categoryId', item.hrefUrl)
  markCategoryNavFromHome()
}
</script>

<template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="true" :interval="3000" @change="handleChange">
      <swiper-item v-for="item in bannerData" :key="item.id">
        <navigator
          url="/pages/category/category"
          hover-class="none"
          class="navigator"
          open-type="switchTab"
          @tap="handleClick(item)"
        >
          <image mode="aspectFill" class="image" :src="item.imgUrl"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="indicator">
      <text
        v-for="(item, index) in bannerData"
        :key="item.id"
        class="dot"
        :class="{ active: index === activeIndex }"
      ></text>
    </view>
  </view>
</template>

<style lang="scss">
/* 轮播图 */
.carousel {
  height: 280rpx;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  background-color: #efefef;

  .indicator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 16rpx;
    display: flex;
    justify-content: center;

    .dot {
      width: 30rpx;
      height: 6rpx;
      margin: 0 8rpx;
      border-radius: 6rpx;
      background-color: rgba(255, 255, 255, 0.4);
    }

    .active {
      background-color: #fff;
    }
  }

  .navigator,
  .image {
    width: 100%;
    height: 100%;
  }
}
</style>
