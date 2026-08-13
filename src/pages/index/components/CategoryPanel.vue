<script setup lang="ts">
// 类目面板
import type { Category } from '@/types/home'
import { markCategoryNavFromHome } from '@/utils/categoryNav'
const props = defineProps<{
  categoryData: Category[]
}>()
const setSwitchParams = (item: Category) => {
  uni.setStorageSync('categoryId', item.id)
  markCategoryNavFromHome()
}
</script>

<template>
  <view class="category">
    <navigator
      class="category-item"
      hover-class="none"
      :url="`/pages/category/category`"
      v-for="item in categoryData"
      :key="item.id"
      open-type="switchTab"
      @tap="setSwitchParams(item)"
    >
      <image class="icon" :src="item.icon"></image>
      <text class="text">{{ item.name }}</text>
    </navigator>
  </view>
</template>

<style lang="scss">
/* 前台类目 */
.category {
  margin: 20rpx 0 0;
  padding: 10rpx 0;
  display: flex;
  flex-wrap: wrap;
  min-height: 328rpx;

  .category-item {
    width: 150rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    /* H5 下 navigator 编译后内部会包一层 a.navigator-wrap，且该元素由运行时生成、
       不带 scoped 属性，必须用 :deep() 穿透作用域才能命中 */
    :deep(.navigator-wrap) {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .icon {
      width: 100rpx;
      height: 100rpx;
    }

    .text {
      font-size: 25rpx;
      color: #666;
    }
  }
}
</style>
