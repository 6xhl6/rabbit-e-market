<script setup lang="ts">
import CartSkeleton from './CartSkeleton.vue'
import {
  deleteCartService,
  getCartListService,
  updateCartSelectedService,
  updateCartService,
} from '@/services/cart'
import type { CartItem } from '@/types/cart'
import { onShow, onUnload } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { useMemberStore } from '@/stores'
import type { InputNumberBoxEvent } from '@/components/vk-data-input-number-box/vk-data-input-number-box'
import { useGuessList } from '@/composables/useGuessList'

const memberStore = useMemberStore()
const { guessRef, onScrolltolower } = useGuessList()

const cartList = ref<CartItem[]>([])
const effectiveCartList = computed(() => cartList.value.filter((item) => item.isEffective))
const AllSelected = computed({
  // 仅有效商品参与全选判断（失效商品不可勾选）
  get: () => effectiveCartList.value.length > 0,
  set: (val) => {
    effectiveCartList.value.forEach((item) => {
      item.selected = val
    })
    updateCartSelectedService({ selected: val })
  },
})
// 结算只统计有效商品
const selectedItems = computed(() =>
  cartList.value.filter((item) => item.isEffective && item.selected),
)
const TotalPrice = computed(() => {
  return selectedItems.value
    .reduce((acc, cur) => acc + Number(cur.nowPrice) * cur.count, 0)
    .toFixed(2)
})
const selectedItemsLength = computed(() => {
  return selectedItems.value.reduce((acc, cur) => acc + cur.count, 0)
})
const getCartList = async () => {
  const res = await getCartListService()
  console.log(res)
  // 失效商品强制置为未选中（服务端不会将其计入结算）
  cartList.value = res.result.map((item) =>
    item.isEffective ? item : { ...item, selected: false },
  )
}
const deleteCartItem = async (skuid: string) => {
  uni
    .showModal({
      title: '提示',
      content: '确定删除吗？',
      showCancel: true,
    })
    .then(async (res) => {
      if (res.confirm) {
        const res = await deleteCartService([skuid])
        uni.showToast({ title: res.msg || '删除成功', icon: 'success' })
        getCartList()
      }
    })
}
let timer: ReturnType<typeof setTimeout>
const onCountChange = async (e: InputNumberBoxEvent) => {
  clearTimeout(timer)
  timer = setTimeout(async () => {
    await updateCartService(e.index, { count: e.value })
    getCartList()
  }, 500)
}
const updateSelected = async (item: CartItem) => {
  // 失效商品禁止勾选
  if (!item.isEffective) {
    return uni.showToast({ title: '商品已失效，不可勾选', icon: 'none' })
  }
  item.selected = !item.selected
  await updateCartService(item.skuId, { selected: item.selected })
  getCartList()
}
const toPayment = () => {
  if (!selectedItemsLength.value) {
    return uni.showToast({ title: '请选择商品', icon: 'none' })
  }
  uni.navigateTo({
    url: '/pagesOrder/create/create',
  })
}
onShow(() => {
  getCartList()
})
onUnload(() => {
  clearTimeout(timer)
})
</script>

<template>
  <scroll-view scroll-y class="scroll-view" v-if="cartList.length" @scrolltolower="onScrolltolower">
    <!-- 已登录: 显示购物车 -->
    <template v-if="memberStore.profile?.token">
      <!-- 购物车列表 -->
      <view class="cart-list" v-if="cartList.length">
        <!-- 优惠提示 -->
        <view class="tips">
          <text class="label">满减</text>
          <text class="desc">满1件, 即可享受9折优惠</text>
        </view>
        <!-- 滑动操作分区 -->
        <uni-swipe-action>
          <!-- 滑动操作项 -->
          <uni-swipe-action-item v-for="item in cartList" :key="item.id" class="cart-swipe">
            <!-- 商品信息 -->
            <view class="goods" :class="{ invalid: !item.isEffective }">
              <!-- 选中状态 -->
              <text
                class="checkbox"
                :class="{ checked: item.selected, disabled: !item.isEffective }"
                @tap="updateSelected(item)"
              ></text>
              <navigator
                :url="`/pages/goods/goods?id=${item.id}&skuId=${item.skuId}&count=${item.count}`"
                hover-class="none"
                class="navigator"
              >
                <image mode="aspectFill" class="picture" :src="item.picture"></image>
                <view class="meta">
                  <view class="name ellipsis">{{ item.name }}</view>
                  <view class="attrsText ellipsis">{{ item.attrsText }}</view>
                  <view class="price">{{ item.nowPrice }}</view>
                </view>
              </navigator>
              <!-- 失效标记 -->
              <text class="invalid-text" v-if="!item.isEffective">无效商品</text>
              <!-- 商品数量 -->
              <view class="count">
                <vk-data-input-number-box
                  v-model="item.count"
                  :min="1"
                  :max="item.stock"
                  :index="item.skuId"
                  @change="onCountChange"
                  disabled-input
                ></vk-data-input-number-box>
              </view>
            </view>
            <!-- 右侧删除按钮 -->
            <template #right>
              <view class="cart-swipe-right" @tap="deleteCartItem(item.skuId)">
                <button class="button delete-button">删除</button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <!-- 购物车空状态 -->
      <view class="cart-blank" v-else>
        <image src="/static/images/blank_cart.png" class="image" />
        <text class="text">购物车还是空的，快来挑选好货吧</text>
        <navigator open-type="switchTab" url="/pages/index/index" hover-class="none">
          <button class="button">去首页看看</button>
        </navigator>
      </view>
      <!-- 吸底工具栏 -->
      <view class="toolbar">
        <text class="all" :class="{ checked: AllSelected }" @tap="AllSelected = !AllSelected"
          >全选</text
        >
        <text class="text">合计:</text>
        <text class="amount">{{ TotalPrice }}</text>
        <view class="button-grounp">
          <view
            class="button payment-button"
            :class="{ disabled: !selectedItemsLength }"
            @tap="toPayment"
          >
            去结算({{ selectedItemsLength }})
          </view>
        </view>
      </view>
    </template>
    <!-- 未登录: 提示登录 -->
    <view class="login-blank" v-else>
      <text class="text">登录后可查看购物车中的商品</text>
      <navigator url="/pages/login/login" hover-class="none">
        <button class="button">去登录</button>
      </navigator>
    </view>
    <!-- 猜你喜欢 -->
    <CustomGuessLike ref="guessRef"></CustomGuessLike>
    <!-- 底部占位空盒子 -->
    <view class="toolbar-height"></view>
  </scroll-view>
  <CartSkeleton v-else></CartSkeleton>
</template>

<style lang="scss">
// 根元素
:host {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f7f7f8;
}

// 滚动容器
.scroll-view {
  flex: 1;
}

// 购物车列表
.cart-list {
  padding: 0 20rpx;

  // 优惠提示
  .tips {
    display: flex;
    align-items: center;
    line-height: 1;
    margin: 30rpx 10rpx;
    font-size: 26rpx;
    color: #666;

    .label {
      color: #fff;
      padding: 7rpx 15rpx 5rpx;
      border-radius: 4rpx;
      font-size: 24rpx;
      background-color: #27ba9b;
      margin-right: 10rpx;
    }
  }

  // 购物车商品
  .goods {
    display: flex;
    padding: 20rpx 20rpx 20rpx 80rpx;
    border-radius: 10rpx;
    background-color: #fff;
    position: relative;

    .navigator {
      display: flex;
    }

    .checkbox {
      position: absolute;
      top: 0;
      left: 0;

      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 100%;

      &::before {
        content: '\e6cd';
        font-family: 'erabbit' !important;
        font-size: 40rpx;
        color: #444;
      }

      &.checked::before {
        content: '\e6cc';
        color: #27ba9b;
      }

      &.disabled::before {
        color: #ccc;
      }
    }

    // 失效商品置灰
    &.invalid {
      .picture,
      .meta {
        opacity: 0.5;
      }
    }

    // 失效标记
    .invalid-text {
      position: absolute;
      top: 20rpx;
      right: 20rpx;
      z-index: 1;
      padding: 6rpx 14rpx;
      border-radius: 6rpx;
      font-size: 22rpx;
      color: #fff;
      background-color: #867777;
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
    }

    .name {
      height: 72rpx;
      font-size: 26rpx;
      color: #444;
    }

    .attrsText {
      line-height: 1.8;
      padding: 0 15rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .price {
      line-height: 1;
      font-size: 26rpx;
      color: #444;
      margin-bottom: 2rpx;
      color: #cf4444;

      &::before {
        content: '￥';
        font-size: 80%;
      }
    }

    // 商品数量
    .count {
      position: absolute;
      bottom: 20rpx;
      right: 5rpx;

      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 220rpx;
      height: 48rpx;

      .text {
        height: 100%;
        padding: 0 20rpx;
        font-size: 32rpx;
        color: #444;
      }

      .input {
        height: 100%;
        text-align: center;
        border-radius: 4rpx;
        font-size: 24rpx;
        color: #444;
        background-color: #f6f6f6;
      }
    }
  }

  .cart-swipe {
    display: block;
    margin: 20rpx 0;
  }

  .cart-swipe-right {
    display: flex;
    height: 100%;

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      padding: 6px;
      line-height: 1.5;
      color: #fff;
      font-size: 26rpx;
      border-radius: 0;
    }

    .delete-button {
      background-color: #cf4444;
    }
  }
}

// 空状态
.cart-blank,
.login-blank {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh;

  .image {
    width: 400rpx;
    height: 281rpx;
  }

  .text {
    color: #444;
    font-size: 26rpx;
    margin: 20rpx 0;
  }

  .button {
    width: 240rpx !important;
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 20rpx;
    font-size: 26rpx;
    border-radius: 60rpx;
    color: #fff;
    background-color: #27ba9b;
  }
}

// 吸底工具栏
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--window-bottom);
  z-index: 1;

  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
  box-sizing: content-box;

  .all {
    margin-left: 25rpx;
    font-size: 14px;
    color: #444;
    display: flex;
    align-items: center;
  }

  .all::before {
    font-family: 'erabbit' !important;
    content: '\e6cd';
    font-size: 40rpx;
    margin-right: 8rpx;
  }

  .checked::before {
    content: '\e6cc';
    color: #27ba9b;
  }

  .text {
    margin-right: 8rpx;
    margin-left: 32rpx;
    color: #444;
    font-size: 14px;
  }

  .amount {
    font-size: 20px;
    color: #cf4444;

    .decimal {
      font-size: 12px;
    }

    &::before {
      content: '￥';
      font-size: 12px;
    }
  }

  .button-grounp {
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    text-align: center;
    line-height: 72rpx;
    font-size: 13px;
    color: #fff;

    .button {
      width: 240rpx;
      margin: 0 10rpx;
      border-radius: 72rpx;
    }

    .payment-button {
      background-color: #27ba9b;

      &.disabled {
        opacity: 0.6;
      }
    }
  }
}

// 底部占位空盒子
.toolbar-height {
  height: 100rpx;
}
</style>
