<script setup lang="ts">
import { OrderState, orderStateList } from '@/services/constants'
import {
  cancelOrderService,
  confirmConsignmentService,
  deleteOrderService,
  getDeliveryInfoService,
  getOrderConsignmentService,
  getOrderDetailService,
} from '@/services/order'
import { getMockPayInfoService, getPayInfoService } from '@/services/pay'
import type { DeliveryInfo, OrderResult } from '@/types/order'
import { onLoad, onReady } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useGuessList } from '@/composables'
const { guessRef, onScrolltolower, resetGuessList } = useGuessList()

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const isDevEnv = import.meta.env.DEV

// #ifdef MP-WEIXIN
// 获取页面栈
const pages = getCurrentPages()
const pageInstance = pages.at(-1) as any
onReady(() => {
  pageInstance.animate(
    '.navbar',
    [{ backgroundColor: 'transparent' }, { backgroundColor: '#f8f8f8' }],
    1000,
    { scrollSource: '#scroller', timeRange: 1000, startScrollOffset: 0, endScrollOffset: 50 },
  )
  pageInstance.animate('.navbar .title', [{ color: 'transparent' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  })
  pageInstance.animate('.navbar .back', [{ color: '#f8f8f8' }, { color: '#000' }], 1000, {
    scrollSource: '#scroller',
    timeRange: 1000,
    startScrollOffset: 0,
    endScrollOffset: 50,
  })
})
// #endif

// 弹出层组件
const popup = ref<UniHelper.UniPopupInstance>()
// 取消原因列表
const reasonList = ref([
  '商品无货',
  '不想要了',
  '商品信息填错了',
  '地址信息填写错误',
  '商品降价',
  '其它',
])
// 订单取消原因
const reason = ref('')
// 复制内容
const onCopy = (id: string) => {
  // 设置系统剪贴板的内容
  uni.setClipboardData({
    data: id,
    success: () => uni.showToast({ title: '已复制到剪切板', icon: 'none' }),
  })
}
// 获取页面参数
const query = defineProps<{
  id: string
}>()
const orderDetail = ref<OrderResult>()
const deliveryInfo = ref<DeliveryInfo>()
// 获取订单详情
const getOrderDetail = async () => {
  const res = await getOrderDetailService(query.id)
  console.log(res.result)
  orderDetail.value = res.result
  // 获取物流信息
  if (
    [OrderState.DaiShouHuo, OrderState.DaiPingJia, OrderState.YiWanCheng].includes(
      orderDetail.value?.orderState,
    )
  ) {
    try {
      const deliveryInfoRes = await getDeliveryInfoService(query.id)
      deliveryInfo.value = deliveryInfoRes.result
      console.log('物流信息', deliveryInfo.value)
    } catch {
      // mock 接口对部分订单无物流数据，失败时不展示物流区域，不影响页面
    }
  }
}
onLoad(() => {
  getOrderDetail()
})
// 订单超时取消
const onTimeUp = () => {
  orderDetail.value!.orderState = OrderState.YiQuXiao
}

// 取消订单
const onCancelOrder = async () => {
  uni.showModal({
    title: '提示',
    content: '确定要取消订单吗？',
    success: async (res) => {
      if (res.confirm) {
        // 取消订单
        if (orderDetail.value?.orderState !== OrderState.DaiFuKuan) {
          return uni.showToast({
            title: '仅允许待付款订单取消',
            icon: 'none',
          })
        }
        // 取消订单
        await cancelOrderService(query.id, { cancelReason: reason.value })
        console.log(res)
        uni.showToast({
          title: '取消成功',
          icon: 'success',
        })
        getOrderDetail()
        popup.value?.close?.()
      }
    },
  })
}
// 模拟发货
const onConsignment = async () => {
  // 仅在开发环境下使用，打包到生产环境时tree shaking
  if (isDevEnv) {
    const res = await getOrderConsignmentService(query.id)
    console.log(res)
    uni.showToast({
      title: '发货成功',
      icon: 'success',
    })
    getOrderDetail()
  }
}
// 支付订单
const onPay = async () => {
  if (import.meta.env.DEV) {
    const res = await getMockPayInfoService(query.id)
    uni.redirectTo({
      url: `/pagesOrder/payment/payment?id=${query.id}`,
    })
    uni.showToast({
      title: '支付成功',
      icon: 'success',
    })
  } else {
    const res = await getPayInfoService(query.id)
    await uni.requestPayment({
      ...res.result,
      provider: 'wxpay',
    })
    uni.redirectTo({
      url: `/pagesOrder/payment/payment?id=${query.id}`,
    })
  }
}
// 确认收货
const onConfirmConsignment = async () => {
  uni.showModal({
    title: '提示',
    content: '确定收货吗？',
    success: async (res) => {
      if (res.confirm) {
        // 确认收货
        if (orderDetail.value?.orderState != OrderState.DaiShouHuo) {
          return uni.showToast({
            title: '仅允许待发货订单确认收货',
            icon: 'none',
          })
        }
        // 确认收货
        const res = await confirmConsignmentService(query.id)
        uni.showToast({
          title: '收货成功',
          icon: 'success',
        })
        orderDetail.value!.orderState = OrderState.DaiPingJia
      }
    },
  })
}
// 删除订单
const onDeleteOrder = async () => {
  uni.showModal({
    title: '提示',
    content: '确定要删除订单吗？',
    success: async (res) => {
      if (res.confirm) {
        // 删除订单
        await deleteOrderService([query.id])
        uni.showToast({
          title: '删除成功',
          icon: 'success',
        })
        uni.navigateTo({
          url: '/pagesOrder/list/list',
        })
      }
    },
  })
}
</script>

<template>
  <!-- 自定义导航栏: 默认透明不可见, scroll-view 滚动到 50 时展示 -->
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <view class="wrap">
      <navigator
        v-if="pages.length > 1"
        open-type="navigateBack"
        class="back icon-left"
      ></navigator>
      <navigator v-else url="/pages/index/index" open-type="switchTab" class="back icon-home">
      </navigator>
      <view class="title">订单详情</view>
    </view>
  </view>
  <scroll-view scroll-y class="viewport" id="scroller" @scrolltolower="onScrolltolower">
    <template v-if="orderDetail">
      <!-- 订单状态 -->
      <view class="overview" :style="{ paddingTop: safeAreaInsets!.top + 20 + 'px' }">
        <!-- 待付款状态:展示去支付按钮和倒计时 -->
        <template v-if="orderDetail.orderState === OrderState.DaiFuKuan">
          <view class="status icon-clock"> 待付款 </view>
          <view class="tips">
            <text class="money">￥{{ orderDetail.payMoney }}</text>
            <text class="time">支付剩余:</text>
            <uni-countdown
              :show-day="false"
              :second="orderDetail.countdown"
              color="#f8f8f8"
              splitor-color="#f8f8f8"
              :font-size="20"
              @timeup="onTimeUp"
            ></uni-countdown>
          </view>
          <view class="button" @tap="onPay">去支付</view>
        </template>
        <!-- 其他订单状态:展示再次购买按钮 -->
        <template v-else>
          <!-- 订单状态文字 -->
          <view class="status"> {{ orderStateList[orderDetail.orderState].text }} </view>
          <view class="button-group">
            <navigator
              class="button"
              :url="`/pagesOrder/create/create?orderId=${query.id}`"
              hover-class="none"
            >
              再次购买
            </navigator>
            <!-- 待发货状态：模拟发货,开发期间使用,用于修改订单状态为已发货 -->
            <view
              v-if="isDevEnv && orderDetail.orderState == OrderState.DaiFaHuo"
              class="button"
              @tap="onConsignment"
            >
              模拟发货
            </view>
            <view
              class="button"
              v-if="orderDetail.orderState === OrderState.DaiShouHuo"
              @tap="onConfirmConsignment"
            >
              确认收货</view
            >
          </view>
        </template>
      </view>
      <!-- 配送状态 -->
      <view class="shipment">
        <!-- 订单物流信息 -->
        <template v-if="deliveryInfo?.list?.length">
          <view class="title">物流信息：</view>
          <view
            v-for="(item, index) in deliveryInfo.list"
            :key="item.id"
            class="logistics-item"
            :class="{ latest: index === 0 }"
          >
            <view class="message">
              {{ item.text }}
            </view>
            <view class="date"> {{ item.time }} </view>
          </view>
        </template>
        <!-- 用户收货地址 -->
        <view class="locate">
          <view class="user">
            {{ orderDetail.receiverContact }} {{ orderDetail.receiverMobile }}
          </view>
          <view class="address"> {{ orderDetail.receiverAddress }} </view>
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="goods">
        <view class="item">
          <navigator
            class="navigator"
            v-for="item in orderDetail.skus"
            :key="item.id"
            :url="`/pages/goods/goods?id=${item.spuId}`"
            hover-class="none"
          >
            <image class="cover" :src="item.image"></image>
            <view class="meta">
              <view class="name ellipsis">{{ item.name }}</view>
              <view class="type">{{ item.attrsText }}</view>
              <view class="price">
                <view class="actual">
                  <text class="symbol">¥</text>
                  <text>{{ item.curPrice }}</text>
                </view>
              </view>
              <view class="quantity">x {{ item.quantity }}</view>
            </view>
          </navigator>
          <!-- 待评价状态:展示按钮 -->
          <view class="action" v-if="orderDetail.orderState === OrderState.DaiPingJia">
            <view class="button primary">申请售后</view>
            <navigator url="" class="button"> 去评价 </navigator>
          </view>
        </view>
        <!-- 合计 -->
        <view class="total">
          <view class="row">
            <view class="text">商品总价: </view>
            <view class="symbol">{{ orderDetail.totalMoney }}</view>
          </view>
          <view class="row">
            <view class="text">运费: </view>
            <view class="symbol">{{ orderDetail.postFee }}</view>
          </view>
          <view class="row">
            <view class="text">应付金额: </view>
            <view class="symbol primary">{{ orderDetail.payMoney }}</view>
          </view>
        </view>
      </view>

      <!-- 订单信息 -->
      <view class="detail">
        <view class="title">订单信息</view>
        <view class="row">
          <view class="item">
            订单编号: {{ query.id }} <text class="copy" @tap="onCopy(query.id)">复制</text>
          </view>
          <view class="item">下单时间: {{ orderDetail.createTime }}</view>
        </view>
      </view>

      <!-- 猜你喜欢 -->
      <CustomGuessLike ref="guessRef" />

      <!-- 底部操作栏 -->
      <view class="toolbar-height" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"></view>
      <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
        <!-- 待付款状态:展示支付按钮 -->
        <template v-if="orderDetail.orderState === OrderState.DaiFuKuan">
          <view class="button primary" @tap="onPay"> 去支付 </view>
          <view class="button" @tap="popup?.open?.()"> 取消订单 </view>
        </template>
        <!-- 其他订单状态:按需展示按钮 -->
        <template v-else>
          <navigator
            class="button secondary"
            :url="`/pagesOrder/create/create?orderId=${query.id}`"
            hover-class="none"
          >
            再次购买
          </navigator>
          <!-- 待收货状态: 展示确认收货 -->
          <view
            class="button primary"
            v-if="orderDetail.orderState == OrderState.DaiShouHuo"
            @tap="onConfirmConsignment"
          >
            确认收货
          </view>
          <!-- 待评价状态: 展示去评价 -->
          <view class="button" v-if="orderDetail.orderState == OrderState.DaiPingJia">
            去评价
          </view>
          <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
          <view
            class="button delete"
            v-if="
              orderDetail.orderState === OrderState.DaiPingJia ||
              orderDetail.orderState === OrderState.YiWanCheng ||
              orderDetail.orderState === OrderState.YiQuXiao
            "
            @tap="onDeleteOrder"
          >
            删除订单
          </view>
        </template>
      </view>
    </template>
    <template v-else>
      <!-- 骨架屏组件 -->
      <PageSkeleton />
    </template>
  </scroll-view>
  <!-- 取消订单弹窗 -->
  <uni-popup ref="popup" type="bottom" background-color="#fff">
    <view class="popup-root">
      <view class="title">订单取消</view>
      <view class="description">
        <view class="tips">请选择取消订单的原因：</view>
        <view class="cell" v-for="item in reasonList" :key="item" @tap="reason = item">
          <text class="text">{{ item }}</text>
          <text class="icon" :class="{ checked: item === reason }"></text>
        </view>
      </view>
      <view class="footer">
        <view class="button" @tap="popup?.close?.()">取消</view>
        <view class="button primary" @tap="onCancelOrder">确认</view>
      </view>
    </view>
  </uni-popup>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.navbar {
  width: 750rpx;
  color: #000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  /* background-color: #f8f8f8; */
  background-color: transparent;

  .wrap {
    position: relative;

    .title {
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      /* color: #000; */
      color: transparent;
    }

    .back {
      position: absolute;
      left: 0;
      height: 44px;
      width: 44px;
      font-size: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      /* color: #000; */
      color: #fff;
    }
  }
}

.viewport {
  flex: 1;
  background-color: #f7f7f8;
}

.overview {
  display: flex;
  flex-direction: column;
  align-items: center;

  line-height: 1;
  padding-bottom: 30rpx;
  color: #fff;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: cover;

  .status {
    font-size: 36rpx;
  }

  .status::before {
    margin-right: 6rpx;
    font-weight: 500;
  }

  .tips {
    margin: 30rpx 0;
    display: flex;
    font-size: 14px;
    align-items: center;

    .money {
      font-size: 30rpx;
      margin-right: 30rpx;
    }

    .time {
      margin-right: 20rpx;
      font-size: 30rpx;
    }
  }

  .button-group {
    margin-top: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button {
    width: 260rpx;
    height: 64rpx;
    margin: 0 10rpx;
    text-align: center;
    line-height: 64rpx;
    font-size: 28rpx;
    color: #27ba9b;
    border-radius: 68rpx;
    background-color: #fff;
  }
}

.shipment {
  line-height: 1.4;
  padding: 0 20rpx;
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;

  // 物流信息标题
  .title {
    padding: 24rpx 20rpx 0;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
  }

  .locate {
    min-height: 120rpx;
    padding: 30rpx 30rpx 25rpx 75rpx;
    background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);
    background-size: 50rpx;
    background-repeat: no-repeat;
    background-position: 6rpx center;

    .user {
      font-size: 26rpx;
      color: #444;
    }

    .address {
      font-size: 24rpx;
      color: #666;
    }
  }

  // 物流条目：时间线样式，与收货地址区分
  .logistics-item {
    position: relative;
    padding: 24rpx 20rpx 24rpx 40rpx;
    margin-left: 20rpx;

    // 左侧时间线竖线
    &::before {
      content: '';
      position: absolute;
      left: 14rpx;
      top: 0;
      bottom: 0;
      width: 2rpx;
      background-color: #e5e5e5;
    }

    // 时间线节点
    &::after {
      content: '';
      position: absolute;
      left: 8rpx;
      top: 32rpx;
      width: 14rpx;
      height: 14rpx;
      border-radius: 50%;
      background-color: #c4c4c4;
    }

    .message {
      font-size: 26rpx;
      color: #444;
    }

    .date {
      font-size: 24rpx;
      color: #999;
      margin-top: 8rpx;
    }

    // 最新一条物流高亮（模板中通过 index === 0 绑定 latest 类）
    &.latest {
      &::after {
        background-color: #27ba9b;
      }

      .message {
        color: #27ba9b;
        font-weight: 500;
      }

      .date {
        color: #27ba9b;
      }
    }
  }

  // 物流与地址之间分隔
  .logistics-item + .locate {
    border-top: 1rpx solid #eee;
    margin-top: 8rpx;
  }
}

.goods {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #eee;

    .navigator {
      display: flex;
      margin: 20rpx 0;
    }

    .cover {
      width: 170rpx;
      height: 170rpx;
      border-radius: 10rpx;
      margin-right: 20rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 6rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .price {
      display: flex;
      margin-top: 6rpx;
      font-size: 24rpx;
    }

    .symbol {
      font-size: 20rpx;
    }

    .original {
      color: #999;
      text-decoration: line-through;
    }

    .actual {
      margin-left: 10rpx;
      color: #444;
    }

    .text {
      font-size: 22rpx;
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 24rpx;
      color: #444;
    }

    .action {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      padding: 30rpx 0 0;

      .button {
        width: 200rpx;
        height: 60rpx;
        text-align: center;
        justify-content: center;
        line-height: 60rpx;
        margin-left: 20rpx;
        border-radius: 60rpx;
        border: 1rpx solid #ccc;
        font-size: 26rpx;
        color: #444;
      }

      .primary {
        color: #27ba9b;
        border-color: #27ba9b;
      }
    }
  }

  .total {
    line-height: 1;
    font-size: 26rpx;
    padding: 20rpx 0;
    color: #666;

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10rpx 0;
    }

    .symbol::before {
      content: '¥';
      font-size: 80%;
      margin-right: 3rpx;
    }

    .primary {
      color: #cf4444;
      font-size: 36rpx;
    }
  }
}

.detail {
  line-height: 1;
  padding: 30rpx 20rpx 0;
  margin: 20rpx 20rpx 0;
  font-size: 26rpx;
  color: #666;
  border-radius: 10rpx;
  background-color: #fff;

  .title {
    font-size: 30rpx;
    color: #444;
  }

  .row {
    padding: 20rpx 0;

    .item {
      padding: 10rpx 0;
      display: flex;
      align-items: center;
    }

    .copy {
      border-radius: 20rpx;
      font-size: 20rpx;
      border: 1px solid #ccc;
      padding: 5rpx 10rpx;
      margin-left: 10rpx;
    }
  }
}

.toolbar-height {
  height: 100rpx;
  box-sizing: content-box;
}

.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;

  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
  box-sizing: content-box;

  .button {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 200rpx;
    height: 72rpx;
    margin-left: 15rpx;
    font-size: 26rpx;
    border-radius: 72rpx;
    border: 1rpx solid #ccc;
    color: #444;
  }

  .delete {
    order: 4;
    color: #cf4444;
    border-color: #cf4444;
  }

  .button {
    order: 3;
  }

  .secondary {
    order: 2;
    color: #27ba9b;
    border-color: #27ba9b;
  }

  .primary {
    order: 1;
    color: #fff;
    background-color: #27ba9b;
  }
}

.popup-root {
  padding: 30rpx 30rpx 0;
  border-radius: 10rpx 10rpx 0 0;
  overflow: hidden;

  .title {
    font-size: 30rpx;
    text-align: center;
    margin-bottom: 30rpx;
  }

  .description {
    font-size: 28rpx;
    padding: 0 20rpx;

    .tips {
      color: #444;
      margin-bottom: 12rpx;
    }

    .cell {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15rpx 0;
      color: #666;
    }

    .icon::before {
      content: '\e6cd';
      font-family: 'erabbit' !important;
      font-size: 38rpx;
      color: #999;
    }

    .icon.checked::before {
      content: '\e6cc';
      font-size: 38rpx;
      color: #27ba9b;
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 0 40rpx;
    font-size: 28rpx;
    color: #444;

    .button {
      flex: 1;
      height: 72rpx;
      text-align: center;
      line-height: 72rpx;
      margin: 0 20rpx;
      color: #444;
      border-radius: 72rpx;
      border: 1rpx solid #ccc;

      &.delete {
        color: #cf4444;
        border-color: #cf4444;
      }
    }

    .primary {
      color: #fff;
      background-color: #27ba9b;
      border: none;
    }
  }
}
</style>
