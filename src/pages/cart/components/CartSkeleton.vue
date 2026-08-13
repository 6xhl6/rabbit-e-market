<template name="skeleton">
  <view class="sk-container">
    <view is="pages/cart/components/CartMain">
      <scroll-view
        :scroll-y="true"
        class="scroll-view CartMain--scroll-view"
        :enable-back-to-top="true"
      >
        <view class="cart-list CartMain--cart-list">
          <view class="tips CartMain--tips">
            <text class="label CartMain--label sk-transparent sk-text-0-0000-419 sk-text"
              >满减</text
            >
            <text class="desc CartMain--desc sk-transparent sk-text-0-0000-760 sk-text"
              >满1件, 即可享受9折优惠</text
            >
          </view>
          <view is="node-modules/@dcloudio/uni-ui/lib/uni-swipe-action/uni-swipe-action">
            <view>
              <view
                is="node-modules/@dcloudio/uni-ui/lib/uni-swipe-action-item/uni-swipe-action-item"
                class="cart-swipe CartMain--cart-swipe"
              >
                <view class="uni-swipe item--uni-swipe">
                  <view
                    class="uni-swipe_box item--uni-swipe_box"
                    data-disabled="false"
                    data-threshold="20"
                  >
                    <view
                      class="uni-swipe_button-group item--uni-swipe_button-group button-group--left item--button-group--left"
                    ></view>
                    <view class="uni-swipe_text--center item--uni-swipe_text--center">
                      <view class="goods CartMain--goods">
                        <text
                          class="checkbox CartMain--checkbox checked CartMain--checked sk-pseudo sk-pseudo-circle"
                        ></text>
                        <navigator class="navigator CartMain--navigator" hover-class="none">
                          <image
                            class="picture CartMain--picture sk-image"
                            mode="aspectFill"
                          ></image>
                          <view class="meta CartMain--meta">
                            <view
                              class="name CartMain--name ellipsis CartMain--ellipsis sk-transparent sk-text-14-2857-371 sk-text"
                              >经典格子元素，男童加绒格子衬衫</view
                            >
                            <view
                              class="attrsText CartMain--attrsText ellipsis CartMain--ellipsis sk-transparent sk-text-22-2222-511 sk-text"
                              >蓝底红白格【213379】， 130/8T</view
                            >
                            <view
                              class="price CartMain--price sk-transparent sk-text-0-0000-10 sk-text sk-pseudo sk-pseudo-circle"
                              >125.00</view
                            >
                          </view>
                        </navigator>
                        <view class="count CartMain--count">
                          <view is="components/vk-data-input-number-box/vk-data-input-number-box">
                            <view
                              class="vk-data-input-number-box box--vk-data-input-number-box data-v-3517706a box--data-v-3517706a"
                            >
                              <view
                                class="u-icon-minus box--u-icon-minus data-v-3517706a box--data-v-3517706a"
                                style="
                                  background: #ffffff;
                                  height: 25px;
                                  color: #323233;
                                  font-size: 13px;
                                  min-height: 1.4em;
                                "
                              >
                                <view
                                  class="num-btn box--num-btn data-v-3517706a box--data-v-3517706a sk-transparent sk-text-14-0000-867 sk-text"
                                  style="font-size: 18px"
                                  >－</view
                                >
                              </view>
                              <view
                                class="u-number-input box--u-number-input data-v-3517706a box--data-v-3517706a sk-image"
                                style="
                                  color: #323233;
                                  font-size: 13px;
                                  background: #ffffff;
                                  height: 25px;
                                  width: 40px;
                                "
                                type="number"
                                value="5"
                              ></view>
                              <view
                                class="u-icon-plus box--u-icon-plus data-v-3517706a box--data-v-3517706a"
                                style="
                                  background: #ffffff;
                                  height: 25px;
                                  color: #323233;
                                  font-size: 13px;
                                  min-height: 1.4em;
                                "
                              >
                                <view
                                  class="num-btn box--num-btn data-v-3517706a box--data-v-3517706a sk-transparent sk-text-14-0000-19 sk-text"
                                  style="font-size: 18px"
                                  >＋</view
                                >
                              </view>
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                    <view
                      class="uni-swipe_button-group item--uni-swipe_button-group button-group--right item--button-group--right"
                    >
                      <view class="cart-swipe-right CartMain--cart-swipe-right">
                        <button
                          class="button CartMain--button delete-button CartMain--delete-button sk-transparent sk-button sk-pseudo sk-pseudo-circle"
                        >
                          删除
                        </button>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view
                is="node-modules/@dcloudio/uni-ui/lib/uni-swipe-action-item/uni-swipe-action-item"
                class="cart-swipe CartMain--cart-swipe"
              >
                <view class="uni-swipe item--uni-swipe">
                  <view
                    class="uni-swipe_box item--uni-swipe_box"
                    data-disabled="false"
                    data-threshold="20"
                  >
                    <view
                      class="uni-swipe_button-group item--uni-swipe_button-group button-group--left item--button-group--left"
                    ></view>
                    <view class="uni-swipe_text--center item--uni-swipe_text--center">
                      <view class="goods CartMain--goods">
                        <text
                          class="checkbox CartMain--checkbox checked CartMain--checked sk-pseudo sk-pseudo-circle"
                        ></text>
                        <navigator class="navigator CartMain--navigator" hover-class="none">
                          <image
                            class="picture CartMain--picture sk-image"
                            mode="aspectFill"
                          ></image>
                          <view class="meta CartMain--meta">
                            <view
                              class="name CartMain--name ellipsis CartMain--ellipsis sk-transparent sk-text-14-2857-347 sk-text"
                              >法国年份雅文邑700毫升</view
                            >
                            <view
                              class="attrsText CartMain--attrsText ellipsis CartMain--ellipsis sk-transparent sk-text-22-2222-486 sk-text"
                              >法国年份雅文邑1983年44.7度700mL</view
                            >
                            <view
                              class="price CartMain--price sk-transparent sk-text-0-0000-268 sk-text sk-pseudo sk-pseudo-circle"
                              >1885.00</view
                            >
                          </view>
                        </navigator>
                        <view class="count CartMain--count">
                          <view is="components/vk-data-input-number-box/vk-data-input-number-box">
                            <view
                              class="vk-data-input-number-box box--vk-data-input-number-box data-v-3517706a box--data-v-3517706a"
                            >
                              <view
                                class="u-icon-minus box--u-icon-minus data-v-3517706a box--data-v-3517706a"
                                style="
                                  background: #ffffff;
                                  height: 25px;
                                  color: #323233;
                                  font-size: 13px;
                                  min-height: 1.4em;
                                "
                              >
                                <view
                                  class="num-btn box--num-btn data-v-3517706a box--data-v-3517706a sk-transparent sk-text-14-0000-293 sk-text"
                                  style="font-size: 18px"
                                  >－</view
                                >
                              </view>
                              <view
                                class="u-number-input box--u-number-input data-v-3517706a box--data-v-3517706a sk-image"
                                style="
                                  color: #323233;
                                  font-size: 13px;
                                  background: #ffffff;
                                  height: 25px;
                                  width: 40px;
                                "
                                type="number"
                                value="3"
                              ></view>
                              <view
                                class="u-icon-plus box--u-icon-plus data-v-3517706a box--data-v-3517706a"
                                style="
                                  background: #ffffff;
                                  height: 25px;
                                  color: #323233;
                                  font-size: 13px;
                                  min-height: 1.4em;
                                "
                              >
                                <view
                                  class="num-btn box--num-btn data-v-3517706a box--data-v-3517706a sk-transparent sk-text-14-0000-139 sk-text"
                                  style="font-size: 18px"
                                  >＋</view
                                >
                              </view>
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                    <view
                      class="uni-swipe_button-group item--uni-swipe_button-group button-group--right item--button-group--right"
                    >
                      <view class="cart-swipe-right CartMain--cart-swipe-right">
                        <button
                          class="button CartMain--button delete-button CartMain--delete-button sk-transparent sk-button sk-pseudo sk-pseudo-circle"
                        >
                          删除
                        </button>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="toolbar CartMain--toolbar">
          <text
            class="all CartMain--all checked CartMain--checked sk-transparent sk-text-14-2857-332 sk-text sk-pseudo sk-pseudo-circle"
            >全选</text
          >
          <text class="text CartMain--text sk-transparent sk-text-14-2857-725 sk-text">合计:</text>
          <text
            class="amount CartMain--amount sk-transparent sk-text-14-2857-252 sk-text sk-pseudo sk-pseudo-circle"
            >6280.00</text
          >
          <view class="button-grounp CartMain--button-grounp">
            <view
              class="button CartMain--button payment-button CartMain--payment-button sk-transparent sk-text-31-9444-233 sk-text"
              style="background-position-x: 50%"
            >
              去结算(8)
            </view>
          </view>
        </view>
        <view is="components/CustomGuessLike" class="r CartMain--r">
          <view class="caption CustomGuessLike--caption">
            <text
              class="text CustomGuessLike--text sk-transparent sk-text-0-0000-877 sk-text sk-pseudo sk-pseudo-circle"
              >猜你喜欢</text
            >
          </view>
          <view class="guess CustomGuessLike--guess">
            <navigator class="guess-item CustomGuessLike--guess-item">
              <image class="image CustomGuessLike--image sk-image" mode="aspectFill"></image>
              <view class="name CustomGuessLike--name sk-transparent sk-text-14-2857-643 sk-text"
                >经典格子元素，男童加绒格子衬衫</view
              >
              <view class="price CustomGuessLike--price">
                <text class="small CustomGuessLike--small sk-transparent sk-opacity">¥</text>
                <text class="sk-transparent sk-text-0-0000-377 sk-text">125.00</text>
              </view>
            </navigator>
            <navigator class="guess-item CustomGuessLike--guess-item">
              <image class="image CustomGuessLike--image sk-image" mode="aspectFill"></image>
              <view class="name CustomGuessLike--name sk-transparent sk-text-14-2857-646 sk-text"
                >多米尼加陈年朗姆酒700毫升</view
              >
              <view class="price CustomGuessLike--price">
                <text class="small CustomGuessLike--small sk-transparent sk-opacity">¥</text>
                <text class="sk-transparent sk-text-0-0000-888 sk-text">238.00</text>
              </view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style scoped>
.sk-transparent {
  color: transparent !important;
}
.sk-text-0-0000-419 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 24rpx;
  position: relative !important;
}
.sk-text {
  background-origin: content-box !important;
  background-clip: content-box !important;
  background-color: transparent !important;
  color: transparent !important;
  background-repeat: repeat-y !important;
}
.sk-text-0-0000-760 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 26rpx;
  position: relative !important;
}
.sk-text-14-2857-371 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-22-2222-511 {
  background-image: linear-gradient(
    transparent 22.2222%,
    #eeeeee 0%,
    #eeeeee 77.7778%,
    transparent 0%
  ) !important;
  background-size: 100% 43.2rpx;
  position: relative !important;
}
.sk-text-0-0000-10 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 26rpx;
  position: relative !important;
}
.sk-text-14-0000-867 {
  background-image: linear-gradient(
    transparent 14%,
    #eeeeee 0%,
    #eeeeee 86%,
    transparent 0%
  ) !important;
  background-size: 100% 50rpx;
  position: relative !important;
}
.sk-text-14-0000-19 {
  background-image: linear-gradient(
    transparent 14%,
    #eeeeee 0%,
    #eeeeee 86%,
    transparent 0%
  ) !important;
  background-size: 100% 50rpx;
  position: relative !important;
}
.sk-text-14-2857-347 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-22-2222-486 {
  background-image: linear-gradient(
    transparent 22.2222%,
    #eeeeee 0%,
    #eeeeee 77.7778%,
    transparent 0%
  ) !important;
  background-size: 100% 43.2rpx;
  position: relative !important;
}
.sk-text-0-0000-268 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 26rpx;
  position: relative !important;
}
.sk-text-14-0000-293 {
  background-image: linear-gradient(
    transparent 14%,
    #eeeeee 0%,
    #eeeeee 86%,
    transparent 0%
  ) !important;
  background-size: 100% 50rpx;
  position: relative !important;
}
.sk-text-14-0000-139 {
  background-image: linear-gradient(
    transparent 14%,
    #eeeeee 0%,
    #eeeeee 86%,
    transparent 0%
  ) !important;
  background-size: 100% 50rpx;
  position: relative !important;
}
.sk-text-14-2857-332 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 39.2rpx;
  position: relative !important;
}
.sk-text-14-2857-725 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 39.2rpx;
  position: relative !important;
}
.sk-text-14-2857-252 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 56rpx;
  position: relative !important;
}
.sk-text-31-9444-233 {
  background-image: linear-gradient(
    transparent 31.9444%,
    #eeeeee 0%,
    #eeeeee 68.0556%,
    transparent 0%
  ) !important;
  background-size: 100% 72rpx;
  position: relative !important;
}
.sk-text-0-0000-877 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 32rpx;
  position: relative !important;
}
.sk-text-14-2857-643 {
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
.sk-text-0-0000-377 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 26rpx;
  position: relative !important;
}
.sk-text-14-2857-646 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 36.4rpx;
  position: relative !important;
}
.sk-text-0-0000-888 {
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
