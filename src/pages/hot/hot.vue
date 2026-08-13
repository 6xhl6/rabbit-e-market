<script setup lang="ts">
import { ref } from 'vue'
import HotSkeleton from './components/HotSkeleton.vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { getHotRecommendService } from '@/services/hot'
import type { HotRecommend } from '@/types/hot'
import type { PageParams } from '@/types/global'

// 热门推荐页 标题和url
const hotMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]
const type = ref('1')
const hotRecommendData = ref<HotRecommend>()
const activeSubTypeId = ref(0)
// 每个 tab 独立的状态：是否正在加载、是否已全部加载
const isLoading = ref(false)
const finishMap = ref<Record<number, boolean>>({})
let currentHot = { type: '1', title: '特惠推荐', url: '/hot/preference' }
type HotParams = PageParams & { subType?: string }
const getHotRecommendData = async (data?: HotParams) => {
  const res = await getHotRecommendService(currentHot.url, data)
  return res
}
onLoad(async (options?: AnyObject) => {
  type.value = (options?.type as string) || '1'
  currentHot = hotMap.find((item) => item.type === type.value)!
  const res = await getHotRecommendData()
  hotRecommendData.value = res.result
  uni.setNavigationBarTitle({
    title: currentHot.title || '',
  })
})

const loadMore = async () => {
  // 正在加载或已全部加载，不再重复请求
  if (isLoading.value || finishMap.value[activeSubTypeId.value]) return

  // 当前选中的子类型
  const currentSubType = hotRecommendData.value?.subTypes[activeSubTypeId.value]
  if (!currentSubType?.goodsItems) return

  // 已到最后一页
  if (currentSubType.goodsItems.page >= currentSubType.goodsItems.pages) {
    finishMap.value[activeSubTypeId.value] = true
    uni.showToast({ title: '没有更多了', icon: 'none' })
    return
  }

  isLoading.value = true
  currentSubType.goodsItems.page++
  const res = await getHotRecommendService(currentHot.url, {
    subType: currentSubType.id,
    page: currentSubType.goodsItems.page,
    pageSize: currentSubType.goodsItems.pageSize,
  })
  const newSubTypes = res.result.subTypes?.[activeSubTypeId.value]
  if (!newSubTypes?.goodsItems) {
    // 接口返回异常，回退页码
    currentSubType.goodsItems.page--
    isLoading.value = false
    return
  }
  currentSubType.goodsItems.items.push(...newSubTypes.goodsItems.items)
  isLoading.value = false
}
</script>

<template>
  <view class="viewport" v-if="hotRecommendData">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="hotRecommendData?.bannerPicture"></image>
    </view>
    <!-- 推荐选项 -->
    <view class="tabs">
      <text
        class="text"
        v-for="(item, index) in hotRecommendData?.subTypes"
        :key="item.id"
        :class="{ active: index === activeSubTypeId }"
        @tap="activeSubTypeId = index"
        >{{ item.title }}</text
      >
    </view>
    <!-- 推荐列表 -->
    <scroll-view
      v-for="(item, index) in hotRecommendData?.subTypes"
      :key="item.id"
      scroll-y
      class="scroll-view"
      v-show="index === activeSubTypeId"
      @scrolltolower="loadMore"
    >
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="goods in item.goodsItems.items"
          :key="goods.id"
          :url="`/pages/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="goods.picture"></image>
          <view class="name ellipsis">{{ goods.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text">{{ finishMap[index] ? '没有更多了' : '正在加载...' }}</view>
    </scroll-view>
  </view>
  <HotSkeleton v-else></HotSkeleton>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}

.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}

.scroll-view {
  flex: 1;
}

.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;

  .text {
    margin: 0 20rpx;
    position: relative;
  }

  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}

.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;

  .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  .thumb {
    width: 305rpx;
    height: 305rpx;
  }

  .name {
    height: 88rpx;
    font-size: 26rpx;
  }

  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }

  .symbol {
    font-size: 70%;
  }

  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>
