<script setup lang="ts">
// 获取屏幕边界到安全区域距离
import { getGoodsService } from '@/services/goods'
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import type { GoodsDetailResponse } from '@/types/goods'
import type { SwiperOnChange } from '@uni-helper/uni-app-types'
import type { UniPopup } from '@uni-helper/uni-ui-types'
import type {
  SkuPopupEvent,
  SkuPopupInstanceType,
  SkuPopupLocaldata,
} from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'
import AddressPanel from './components/AddressPanel.vue'
import ServicePanel from './components/ServicePanel.vue'
import GoodsSkeleton from './components/GoodsSkeleton.vue'
import { addToCartService } from '@/services/cart.ts'
import type { Address } from '@/types/member.js'
import { getAddressList } from '@/services/member.ts'
import useAddressStore from '@/stores/modules/address.ts'

const { safeAreaInsets } = uni.getSystemInfoSync()

// 接收页面参数
const query = defineProps<{
  id: string
  skuId?: string
  count?: number
}>()
const goodsDetailData = ref<GoodsDetailResponse>()
// 是否已收藏
const isCollect = ref(false)
const toggleCollect = () => {
  if (!isCollect.value) {
    uni.showToast({
      title: '收藏成功',
      icon: 'none',
    })
  } else {
    uni.showToast({
      title: '取消收藏',
      icon: 'none',
    })
  }
  isCollect.value = !isCollect.value
}

const getGoodsData = async () => {
  const res = await getGoodsService({
    id: query.id,
  })
  goodsDetailData.value = res.result
  localdata.value = {
    _id: res.result.id,
    name: res.result.name,
    goods_thumb: res.result.mainPictures[0],
    spec_list: res.result.specs.map((item) => {
      return {
        name: item.name,
        list: item.values,
      }
    }),
    sku_list: res.result.skus.map((item) => ({
      _id: item.skuCode,
      /**  商品 ID */
      goods_id: item.id,
      /** 商品名称 */
      goods_name: item.specs[0].name,
      /** 商品图片 */
      image: item.picture,
      /** SKU 价格 * 100, 注意：需要乘以 100 */
      price: item.price * 100,
      /** SKU 规格组成, 注意：需要与 spec_list 数组顺序对应 */
      sku_name_arr: item.specs.map((item) => item.valueName),
      /** SKU 库存 */
      stock: item.inventory,
    })),
  }
}
const getAddressListData = async () => {
  const res = await getAddressList()
  addressList.value = res.result
}
const isFinishLoading = ref(false)
onLoad(async () => {
  await Promise.all([getGoodsData(), getAddressListData()])
  isFinishLoading.value = true
  if (query.skuId) {
    isShowSkuPopup.value = true
  }
})
const currentImageIndex = ref(0)
const handleSwiperChange: SwiperOnChange = (e) => {
  currentImageIndex.value = e.detail.current
}
const handleImageTap = (url: string, urls: string[]) => {
  // 点击图片预览
  uni.previewImage({
    current: url,
    urls: urls,
  })
}
const popup = ref<UniPopup>()
const popupName = ref<'address' | 'service'>()

const addressList = ref<Address[]>()

const openPopup = (name: typeof popupName.value) => {
  popupName.value = name
  popup.value?.open()
}
const isShowSkuPopup = ref(false)
const localdata = ref({} as SkuPopupLocaldata)
// 从购物车进入时：根据 skuId 回显对应 SKU 的规格与数量（组件 open 时会自动调用 defaultSelectSku 选中）
const defaultSelect = computed(() => {
  if (!query.skuId || !localdata.value.sku_list?.length) return undefined
  const sku = localdata.value.sku_list.find((item) => item._id === query.skuId)
  if (!sku) return undefined
  return { sku: sku.sku_name_arr, num: Number(query.count) || 1 }
})
enum SkuMode {
  Both = 1,
  Cart = 2,
  Buy = 3,
}
// 获取 sku组件实例
const skuPopup = ref<SkuPopupInstanceType>()
const mode = ref<SkuMode>(SkuMode.Both)
const buyPopup = (modeNum: SkuMode) => {
  mode.value = modeNum
  isShowSkuPopup.value = true
}
const selectedSkuText = computed(() => {
  return skuPopup.value?.selectArr.join(' ').trim() || '请选择商品规格'
})

const addToCart = async (callbackRes: SkuPopupEvent) => {
  console.log(callbackRes)
  const res = await addToCartService({
    skuId: callbackRes._id,
    count: callbackRes.buy_num,
  })
  uni.showToast({
    title: '加入购物车成功',
    icon: 'success',
  })
  skuPopup.value!.init()
  isShowSkuPopup.value = false
}
const buyNow = (callbackRes: SkuPopupEvent) => {
  console.log(callbackRes)
  uni.navigateTo({
    url: `/pagesOrder/create/create?skuId=${callbackRes._id}&count=${
      callbackRes.buy_num
    }&addressId=${addressStore.selectedAddress?.id || ''}`,
  })
}
const addressStore = useAddressStore()
</script>

<template>
  <view class="sk-container" v-if="isFinishLoading">
    <scroll-view scroll-y class="viewport">
      <!-- 基本信息 -->
      <view class="goods">
        <!-- 商品主图 -->
        <view class="preview">
          <swiper circular @change="handleSwiperChange">
            <swiper-item v-for="item in goodsDetailData?.mainPictures" :key="item">
              <image
                class="image"
                mode="aspectFill"
                :src="item"
                @tap="handleImageTap(item, goodsDetailData!.mainPictures)"
              />
            </swiper-item>
          </swiper>
          <view class="indicator">
            <text class="current">{{ currentImageIndex + 1 }}</text>
            <text class="split">/</text>
            <text class="total">{{ goodsDetailData?.mainPictures?.length }}</text>
          </view>
        </view>

        <!-- 商品简介 -->
        <view class="meta">
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goodsDetailData?.price }}</text>
          </view>
          <view class="name ellipsis">{{ goodsDetailData?.name }} </view>
          <view class="desc"> {{ goodsDetailData?.desc }} </view>
        </view>

        <!-- 操作面板 -->
        <view class="action">
          <view class="item arrow" @tap="buyPopup(1)">
            <text class="label">选择</text>
            <text class="text ellipsis"> {{ selectedSkuText }} </text>
          </view>
          <view class="item arrow" @tap="openPopup('address')">
            <text class="label">送至</text>
            <text class="text ellipsis">
              {{ addressStore.selectedAddress?.fullLocation || '请选择收获地址' }}
              {{ addressStore.selectedAddress?.address || '' }}
            </text>
          </view>
          <view class="item arrow" @tap="openPopup('service')">
            <text class="label">服务</text>
            <text class="text ellipsis"> 无忧退 快速退款 免费包邮 </text>
          </view>
        </view>
      </view>

      <!-- 商品详情 -->
      <view class="detail panel">
        <view class="title">
          <text>详情</text>
        </view>
        <view class="content">
          <view class="properties">
            <!-- 属性详情 -->
            <view
              class="item"
              v-for="item in goodsDetailData?.details?.properties"
              :key="item.name"
            >
              <text class="label">{{ item.name }}</text>
              <text class="value">{{ item.value }}</text>
            </view>
          </view>
          <!-- 图片详情 -->
          <image
            class="image"
            mode="widthFix"
            :src="item"
            v-for="item in goodsDetailData?.details?.pictures"
            :key="item"
          ></image>
        </view>
      </view>

      <!-- 同类推荐 -->
      <view class="similar panel">
        <view class="title">
          <text>同类推荐</text>
        </view>
        <view class="content">
          <navigator
            v-for="item in goodsDetailData?.similarProducts"
            :key="item.id"
            class="goods"
            hover-class="none"
            :url="`/pages/goods/goods?id=${item.id}`"
          >
            <image class="image" mode="aspectFill" :src="item.picture"></image>
            <view class="name ellipsis">{{ item.name }}</view>
            <view class="price">
              <text class="symbol">¥</text>
              <text class="number">{{ item.price }}</text>
            </view>
          </navigator>
        </view>
      </view>
    </scroll-view>

    <!-- 用户操作 -->
    <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      <view class="icons">
        <button class="icons-button" @tap="toggleCollect">
          <image class="icon-shoucang" src="@/static/svgs/aixin.svg" v-if="!isCollect"></image>
          <image class="icon-shoucang" src="@/static/svgs/aixin_1.svg" v-else></image>
          <text class="icon-shoucang-text">收藏</text>
        </button>
        <!-- #ifdef MP-WEIXIN -->
        <button class="icons-button" open-type="contact">
          <text class="icon-handset"></text>客服
        </button>
        <!-- #endif -->
        <navigator class="icons-button" url="/pages/cart/cartNormal">
          <text class="icon-cart"></text>购物车
        </navigator>
      </view>
      <view class="buttons">
        <view class="addcart" @tap="buyPopup(2)"> 加入购物车 </view>
        <view class="buynow" @tap="buyPopup(3)"> 立即购买 </view>
      </view>
    </view>
    <uni-popup ref="popup" type="bottom" background-color="#fff">
      <ServicePanel
        v-if="popupName === 'service'"
        @close="popup?.close()"
        :addressList="addressList"
      />
      <AddressPanel
        v-if="popupName === 'address'"
        @close="popup?.close()"
        :addressList="addressList!"
      />
    </uni-popup>
  </view>
  <!-- 骨架屏 -->
  <GoodsSkeleton v-else />
  <vk-data-goods-sku-popup
    ref="skuPopup"
    v-model="isShowSkuPopup"
    :localdata="localdata"
    :mode="mode"
    :default-select="defaultSelect"
    no-stock-text="库存不足"
    @cart="addToCart"
    @buy="buyNow"
  />
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sk-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.viewport {
  flex: 1;
  background-color: #f4f4f4;
}

.panel {
  margin-top: 20rpx;
  background-color: #fff;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 6rpx;
    position: relative;

    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      border-left: 4rpx solid #27ba9b;
    }

    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.goods {
  background-color: #fff;

  .preview {
    height: 750rpx;
    position: relative;

    .image {
      width: 750rpx;
      height: 750rpx;
    }

    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      line-height: 40rpx;
      border-radius: 30rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;

      .current {
        font-size: 26rpx;
      }

      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }

      .total {
        font-size: 24rpx;
      }
    }
  }

  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;

    .price {
      height: 130rpx;
      padding: 25rpx 30rpx 0;
      color: #fff;
      font-size: 34rpx;
      box-sizing: border-box;
      background-color: #35c8a9;
    }

    .number {
      font-size: 56rpx;
    }

    .brand {
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
      position: absolute;
      top: 26rpx;
      right: 30rpx;
    }

    .name {
      max-height: 88rpx;
      line-height: 1.4;
      margin: 20rpx;
      font-size: 32rpx;
      color: #333;
    }

    .desc {
      line-height: 1;
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      color: #cf4444;
    }
  }

  .action {
    padding-left: 20rpx;

    .item {
      height: 90rpx;
      padding-right: 60rpx;
      border-bottom: 1rpx solid #eaeaea;
      font-size: 26rpx;
      color: #333;
      position: relative;
      display: flex;
      align-items: center;

      &:last-child {
        border-bottom: 0 none;
      }
    }

    .label {
      width: 60rpx;
      color: #898b94;
      margin: 0 16rpx 0 10rpx;
    }

    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;

  .content {
    margin-left: -20rpx;

    .image {
      width: 100%;
    }
  }

  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;

    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
    }

    .label {
      width: 200rpx;
    }

    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  .content {
    padding: 0 20rpx 200rpx;
    background-color: #f4f4f4;
    display: flex;
    flex-wrap: wrap;

    .goods {
      width: 340rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 7rpx;
      border-radius: 10rpx;
      background-color: #fff;
    }

    .image {
      width: 300rpx;
      height: 260rpx;
    }

    .name {
      height: 80rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
    }

    .price {
      line-height: 1;
      font-size: 20rpx;
      color: #cf4444;
    }

    .number {
      font-size: 26rpx;
      margin-left: 2rpx;
    }
  }

  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx var(--window-bottom);
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .buttons {
    display: flex;

    & > view {
      width: 220rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
    }

    .addcart {
      background-color: #ffa868;
    }

    .buynow,
    .payment {
      background-color: #27ba9b;
      margin-left: 20rpx;
    }
  }

  .icons {
    padding-right: 10rpx;
    display: flex;
    align-items: center;
    flex: 1;

    .icons-button {
      flex: 1;
      text-align: center;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #333;
      background-color: #fff;

      .icon-shoucang {
        width: 35rpx;
        height: 35rpx;
        margin-right: 6rpx;
        margin-bottom: 3rpx;
        padding-top: 10rpx;
      }

      .icon-shoucang-text {
        font-size: 20rpx;
      }

      &::after {
        border: none;
      }

      &:first-child {
        display: flex;
        height: 74rpx;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }
    }

    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>
