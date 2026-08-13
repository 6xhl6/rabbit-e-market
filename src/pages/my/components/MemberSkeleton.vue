<template name="skeleton">
  <view class="sk-container">
    <scroll-view :enable-back-to-top="true" :scroll-y="true" class="viewport sk-image">
      <view class="profile profile" style="padding-top: 20px">
        <view class="overview overview">
          <navigator hover-class="none">
            <image class="avatar sk-image" mode="aspectFill"></image>
          </navigator>
          <view class="meta meta">
            <view class="nickname sk-transparent sk-text-0-0000-23 sk-text">xhl666</view>
            <navigator class="extra extra" hover-class="none">
              <text class="update sk-transparent sk-text-16-6667-698 sk-text">更新头像昵称</text>
            </navigator>
          </view>
        </view>
        <navigator class="settings sk-transparent sk-text-14-2857-542 sk-text" hover-class="none">
          设置
        </navigator>
      </view>
      <view class="orders orders">
        <view class="title sk-transparent">
          我的订单
          <navigator class="navigator sk-transparent" hover-class="none">
            查看全部订单
            <text class="icon-right sk-pseudo sk-pseudo-circle"></text>
          </navigator>
        </view>
        <view class="section section">
          <navigator
            class="icon-currency navigator sk-transparent sk-text-14-2857-658 sk-text sk-pseudo sk-pseudo-circle"
            hover-class="none"
            >待付款</navigator
          >
          <navigator
            class="icon-gift navigator sk-transparent sk-text-14-2857-964 sk-text sk-pseudo sk-pseudo-circle"
            hover-class="none"
            >待发货</navigator
          >
          <navigator
            class="icon-check navigator sk-transparent sk-text-14-2857-756 sk-text sk-pseudo sk-pseudo-circle"
            hover-class="none"
            >待收货</navigator
          >
          <navigator
            class="icon-comment navigator sk-transparent sk-text-14-2857-360 sk-text sk-pseudo sk-pseudo-circle"
            hover-class="none"
            >待评价</navigator
          >
          <!-- #ifdef MP-WEIXIN -->
          <button
            class="contact icon-handset sk-transparent sk-button sk-pseudo sk-pseudo-circle"
            open-type="contact"
          >
            售后
          </button>
          <!-- #endif -->
        </view>
      </view>
      <view class="guess guess">
        <view is="components/CustomGuessLike" class="r r">
          <view class="caption CustomGuessLike--caption">
            <text
              class="text CustomGuessLike--text sk-transparent sk-text-0-0000-56 sk-text sk-pseudo sk-pseudo-circle"
              >猜你喜欢</text
            >
          </view>
          <view class="guess CustomGuessLike--guess">
            <navigator class="guess-item CustomGuessLike--guess-item">
              <image class="image CustomGuessLike--image sk-image" mode="aspectFill"></image>
              <view class="name CustomGuessLike--name sk-transparent sk-text-14-2857-884 sk-text"
                >经典格子元素，男童加绒格子衬衫</view
              >
              <view class="price CustomGuessLike--price">
                <text class="small CustomGuessLike--small sk-transparent sk-opacity">¥</text>
                <text class="sk-transparent sk-text-0-0000-872 sk-text">125.00</text>
              </view>
            </navigator>
            <navigator class="guess-item CustomGuessLike--guess-item">
              <image class="image CustomGuessLike--image sk-image" mode="aspectFill"></image>
              <view class="name CustomGuessLike--name sk-transparent sk-text-14-2857-806 sk-text"
                >多米尼加陈年朗姆酒700毫升</view
              >
              <view class="price CustomGuessLike--price">
                <text class="small CustomGuessLike--small sk-transparent sk-opacity">¥</text>
                <text class="sk-transparent sk-text-0-0000-832 sk-text">238.00</text>
              </view>
            </navigator>
            <navigator class="guess-item CustomGuessLike--guess-item">
              <image class="image CustomGuessLike--image sk-image" mode="aspectFill"></image>
            </navigator>
            <navigator class="guess-item CustomGuessLike--guess-item">
              <image class="image CustomGuessLike--image sk-image" mode="aspectFill"></image>
            </navigator>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style>
.sk-transparent {
  color: transparent !important;
}
.sk-text-0-0000-23 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 30rpx;
  position: relative !important;
}
.sk-text {
  background-origin: content-box !important;
  background-clip: content-box !important;
  background-color: transparent !important;
  color: transparent !important;
  background-repeat: repeat-y !important;
}
.sk-text-16-6667-698 {
  background-image: linear-gradient(
    transparent 16.6667%,
    #eeeeee 0%,
    #eeeeee 83.3333%,
    transparent 0%
  ) !important;
  background-size: 100% 30rpx;
  position: relative !important;
}
.sk-text-14-2857-542 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 42rpx;
  position: absolute !important;
}
.sk-text-14-2857-658 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 33.6rpx;
  position: relative !important;
}
.sk-text-14-2857-964 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 33.6rpx;
  position: relative !important;
}
.sk-text-14-2857-756 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 33.6rpx;
  position: relative !important;
}
.sk-text-14-2857-360 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 33.6rpx;
  position: relative !important;
}
.sk-text-0-0000-56 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 32rpx;
  position: relative !important;
}
.sk-text-14-2857-884 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-opacity {
  opacity: 0 !important;
}
.sk-text-0-0000-872 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 26rpx;
  position: relative !important;
}
.sk-text-14-2857-806 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-0-0000-832 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 26rpx;
  position: relative !important;
}
.sk-button {
  color: #efefef !important;
  background: #efefef !important;
  border: none !important;
  box-shadow: none !important;
}
.sk-image {
  background: #efefef !important;
}
.sk-pseudo::before,
.sk-pseudo::after {
  background: #efefef !important;
  background-image: none !important;
  color: transparent !important;
  border-color: transparent !important;
}
.sk-pseudo-rect::before,
.sk-pseudo-rect::after {
  border-radius: 0 !important;
}
.sk-pseudo-circle::before,
.sk-pseudo-circle::after {
  border-radius: 50% !important;
}
.sk-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}
</style>
