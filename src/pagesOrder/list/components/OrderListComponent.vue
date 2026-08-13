<script setup lang="ts">
import { orderStateList } from '@/services/constants'
import {
  confirmConsignmentService,
  deleteOrderService,
  getOrderListService,
} from '@/services/order'
import type { OrderList, OrderListParams } from '@/types/order'
import { computed, onMounted, ref } from 'vue'
import { OrderState } from '@/services/constants'
import { getMockPayInfoService, getPayInfoService } from '@/services/pay'

const { safeAreaInsets } = uni.getSystemInfoSync()
const isChangeSomething = ref(false)
const props = defineProps({
  orderState: {
    type: Number,
    default: 0,
  },
})
const orderListData = ref<OrderList>()
const params = ref<OrderListParams>({
  orderState: props.orderState,
  pageSize: 5,
  page: orderListData.value?.page || 1,
})
// 该页是否有可见订单（待付款 tab 过滤掉 countdown=-1 的超时订单）
const hasVisibleOrder = (data: OrderList) => {
  const items = data.items ?? []
  if (props.orderState === OrderState.DaiFuKuan) {
    return items.some((item) => item.countdown !== -1)
  }
  return items.length > 0
}
// 请求一页；若该页无可见订单（如待付款 tab 全为超时订单）且还有下一页，自动翻页
const fetchVisiblePage = async (page: number) => {
  params.value.page = page
  let res = await getOrderListService(params.value)
  orderListData.value = res.result
  while (!hasVisibleOrder(res.result) && page < res.result.pages) {
    page++
    params.value.page = page
    res = await getOrderListService(params.value)
    orderListData.value = res.result
  }
}
// 组件挂载时加载数据
onMounted(async () => {
  uni.showLoading({
    title: '加载中',
  })
  await fetchVisiblePage(1)
  uni.hideLoading()
})
// 下拉刷新
const isTriggered = ref(false)
const onRefresherRefresh = async () => {
  isTriggered.value = true
  try {
    await fetchVisiblePage(1)
  } catch (error) {
    console.log(error)
  }
  isTriggered.value = false
}
// 去支付
const goPay = async (orderId: string) => {
  const order = orderListData.value?.items.find((item) => item.id === orderId)
  if (import.meta.env.DEV) {
    await getMockPayInfoService(orderId)
    uni.showToast({
      title: '支付成功',
      icon: 'success',
    })
    isChangeSomething.value = true
  } else {
    const res = await getPayInfoService(orderId)
    await uni.requestPayment({
      ...res.result,
      provider: 'wxpay',
    })
    isChangeSomething.value = true
  }
  // 在全部订单页，更新订单状态为待发货
  if (props.orderState === 0) {
    order!.orderState = OrderState.DaiFaHuo
  }
  // 否则删除该订单项展示，并在切换tabs时更新订单数据
  else if (order) {
    orderListData.value!.items.splice(orderListData.value!.items.indexOf(order), 1)
  }
  uni.redirectTo({
    url: `/pagesOrder/payment/payment?id=${orderId}`,
  })
}
// 确认收货
const confirmReceipt = (orderId: string) => {
  uni.showModal({
    title: '提示',
    content: '确定收货吗？',
    success: async (res) => {
      if (res.confirm) {
        // 确认收货
        await confirmConsignmentService(orderId)
        uni.showToast({
          title: '收货成功',
          icon: 'success',
        })
        const order = orderListData.value?.items.find((item) => item.id === orderId)
        if (props.orderState === 0) {
          order!.orderState = OrderState.DaiPingJia
        }
        // 在该页删除该订单项，转到待评价订单列表
        else if (order) {
          orderListData.value!.items.splice(orderListData.value!.items.indexOf(order), 1)
        }
        isChangeSomething.value = true
      }
    },
  })
}
const deleteOrder = async (orderId: string) => {
  uni.showModal({
    title: '提示',
    content: '确定删除订单吗？',
    success: async (res) => {
      if (res.confirm) {
        // 删除订单
        await deleteOrderService([orderId])
        uni.showToast({
          title: '删除成功',
          icon: 'success',
        })
        // 在该页删除该订单项
        const order = orderListData.value?.items.find((item) => item.id === orderId)
        if (order) {
          orderListData.value!.items.splice(orderListData.value!.items.indexOf(order), 1)
        }
        isChangeSomething.value = true
      }
    },
  })
}
// 请求锁，避免多次请求
const isLoading = ref(false)
// 加载更多
const loadMore = async () => {
  if (!isHaveMoreData.value || isLoading.value) {
    return
  }
  isLoading.value = true
  uni.showLoading({
    title: '加载中',
  })
  try {
    // 若加载的页无可见订单（超时订单被过滤）且还有下一页，自动继续加载
    while (isHaveMoreData.value) {
      orderListData.value!.page++
      params.value.page = orderListData.value!.page
      const res = await getOrderListService(params.value)
      orderListData.value?.items.push(...res.result.items)
      if (hasVisibleOrder(res.result)) {
        break
      }
    }
  } finally {
    isLoading.value = false
    uni.hideLoading()
  }
}
// 待付款列表过滤超时订单：后端不流转状态，countdown=-1 的订单仍是待付款，不展示
const visibleItems = computed(() => {
  const items = orderListData.value?.items ?? []
  if (props.orderState === OrderState.DaiFuKuan) {
    return items.filter((item) => item.countdown !== -1)
  }
  return items
})
const isHaveMoreData = computed(() => {
  if (!orderListData.value) {
    return false
  }
  // 可见列表为空（如待付款 tab 全部订单超时被过滤），不再提示加载更多
  if (visibleItems.value.length === 0) {
    return false
  }
  return orderListData.value!.page < orderListData.value!.pages
})
const refresh = async () => {
  if (!isChangeSomething.value) {
    return
  }
  isChangeSomething.value = false
  uni.showLoading({
    title: '加载中',
  })
  try {
    await fetchVisiblePage(1)
  } catch (error) {
    console.log(error)
  }
  uni.hideLoading()
}
defineExpose({
  refresh,
})
</script>

<template>
  <scroll-view
    scroll-y
    class="orders"
    @scrolltolower="loadMore"
    refresher-enabled
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherRefresh"
  >
    <view class="card" v-for="order in visibleItems" :key="order.id + '-' + orderState">
      <!-- 订单信息 -->
      <view class="status">
        <text class="date">{{ order.createTime }}</text>
        <!-- 订单状态文字 -->
        <text>{{
          order.countdown === -1 && order.orderState === OrderState.DaiFuKuan
            ? '已取消'
            : orderStateList[order.orderState].text
        }}</text>
        <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
        <text
          class="icon-delete"
          v-if="order.orderState >= OrderState.DaiPingJia"
          @tap="deleteOrder(order.id)"
        ></text>
      </view>
      <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
      <navigator
        v-for="sku in order.skus"
        :key="sku.id"
        class="goods"
        :url="`/pagesOrder/detail/detail?id=${order.id}`"
        hover-class="none"
      >
        <view class="cover">
          <image mode="aspectFill" :src="sku.image"></image>
        </view>
        <view class="meta">
          <view class="name ellipsis">{{ sku.name }}</view>
          <view class="type">{{ sku.attrsText }}</view>
        </view>
      </navigator>
      <!-- 支付信息 -->
      <view class="payment">
        <text class="quantity">共{{ order.totalNum }}件商品</text>
        <text>实付</text>
        <text class="amount">
          <text class="symbol">¥</text
          >{{
            order.countdown === -1 && order.orderState === OrderState.DaiFuKuan // 已取消订单
              ? 0
              : order.payMoney
          }}</text
        >
      </view>
      <!-- 订单操作按钮 -->
      <view class="action">
        <!-- 待付款状态：显示去支付按钮 -->
        <template v-if="order.orderState === OrderState.DaiFuKuan && order.countdown !== -1">
          <view class="button primary" @tap="goPay(order.id)">去支付</view>
        </template>
        <template v-else>
          <navigator
            class="button secondary"
            :url="`/pagesOrder/create/create?orderId=${order.id}`"
            hover-class="none"
          >
            再次购买
          </navigator>
          <!-- 待收货状态: 展示确认收货 -->
          <view
            v-if="order.orderState === OrderState.DaiShouHuo"
            class="button primary"
            @tap="confirmReceipt(order.id)"
          >
            确认收货
          </view>
        </template>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{
        isLoading
          ? '加载中...'
          : isHaveMoreData
          ? '加载更多'
          : visibleItems.length === 0
          ? `暂无${orderStateList[props.orderState].text}订单`
          : '没有更多数据~'
      }}
    </view>
  </scroll-view>
</template>

<style lang="scss">
.orders {
  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;

    .date {
      color: #666;
      flex: 1;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      line-height: 1;
      margin-left: 10rpx;
      padding-left: 10rpx;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      line-height: 1;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 10rpx 0 0 0;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .more {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }
  }

  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;

    .quantity {
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .amount {
      color: #444;
      margin-left: 6rpx;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20rpx;

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }

    .secondary {
      color: #27ba9b;
      border-color: #27ba9b;
    }

    .primary {
      color: #fff;
      background-color: #27ba9b;
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
