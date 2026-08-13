<template name="skeleton">
  <view class="sk-container">
    <view class="viewport viewport">
      <view class="cover cover">
        <image class="sk-image"></image>
      </view>
      <view class="tabs tabs">
        <text
          class="text active sk-transparent sk-text-34-4444-727 sk-text sk-pseudo sk-pseudo-circle"
          >抢先尝鲜</text
        >
        <text class="text sk-transparent sk-text-34-4444-770 sk-text">新品预告</text>
      </view>
      <scroll-view :scroll-y="true" class="scroll-view scroll-view">
        <view class="goods goods">
          <navigator class="navigator navigator" hover-class="none">
            <image class="thumb sk-image"></image>
            <view class="name ellipsis sk-transparent sk-text-14-2857-322 sk-text"
              >优良密闭性日本创意多功能储米桶6kg容量</view
            >
            <view class="price price">
              <text class="symbol sk-transparent sk-opacity">¥</text>
              <text class="number sk-transparent sk-text-0-0000-354 sk-text">99.00</text>
            </view>
          </navigator>
          <navigator class="navigator navigator" hover-class="none">
            <image class="thumb sk-image"></image>
            <view class="name ellipsis sk-transparent sk-text-14-2857-167 sk-text"
              >办公居家必备，3A3U智能插线板</view
            >
            <view class="price price">
              <text class="symbol sk-transparent sk-opacity">¥</text>
              <text class="number sk-transparent sk-text-0-0000-515 sk-text">59.00</text>
            </view>
          </navigator>
          <navigator class="navigator navigator" hover-class="none">
            <image class="thumb sk-image"></image>
            <view class="name ellipsis sk-transparent sk-text-14-2857-283 sk-text"
              >北海道风味大虾面61克*6杯</view
            >
            <view class="price price">
              <text class="symbol sk-transparent sk-opacity">¥</text>
              <text class="number sk-transparent sk-text-0-0000-734 sk-text">39.00</text>
            </view>
          </navigator>
          <navigator class="navigator navigator" hover-class="none">
            <image class="thumb sk-image"></image>
            <view class="name ellipsis sk-transparent sk-text-14-2857-140 sk-text"
              >经典格子元素，男童加绒格子衬衫</view
            >
            <view class="price price">
              <text class="symbol sk-transparent sk-opacity">¥</text>
              <text class="number sk-transparent sk-text-0-0000-5 sk-text">125.00</text>
            </view>
          </navigator>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<style>
.sk-transparent {
  color: transparent !important;
}
.sk-text-34-4444-727 {
  background-image: linear-gradient(
    transparent 34.4444%,
    #eeeeee 0%,
    #eeeeee 65.5556%,
    transparent 0%
  ) !important;
  background-size: 100% 90rpx;
  position: relative !important;
}
.sk-text {
  background-origin: content-box !important;
  background-clip: content-box !important;
  background-color: transparent !important;
  color: transparent !important;
  background-repeat: repeat-y !important;
}
.sk-text-34-4444-770 {
  background-image: linear-gradient(
    transparent 34.4444%,
    #eeeeee 0%,
    #eeeeee 65.5556%,
    transparent 0%
  ) !important;
  background-size: 100% 90rpx;
  position: relative !important;
}
.sk-text-14-2857-322 {
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
.sk-text-0-0000-354 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 30rpx;
  position: relative !important;
}
.sk-text-14-2857-167 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-0-0000-515 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 30rpx;
  position: relative !important;
}
.sk-text-14-2857-283 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-0-0000-734 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 30rpx;
  position: relative !important;
}
.sk-text-14-2857-140 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-0-0000-5 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 30rpx;
  position: relative !important;
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
