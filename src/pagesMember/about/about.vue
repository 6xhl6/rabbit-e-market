<script setup lang="ts">
const version = '1.0.0'
const features = [
  {
    icon: 'icon-check',
    title: '品质严选',
    desc: '层层把关，甄选全球优质好物，让每一次购买都值得信赖',
  },
  {
    icon: 'icon-gift',
    title: '极速发货',
    desc: '海量现货仓配一体，48小时内极速发出，新鲜直达',
  },
  {
    icon: 'icon-cart',
    title: '无忧退换',
    desc: '支持7天无理由退换，售后一对一快速响应',
  },
  {
    icon: 'icon-currency',
    title: '会员专享',
    desc: '签到领好礼、积分抵现金，会员权益持续加码',
  },
]
const milestones = [
  { time: '2019', text: '小兔鲜儿品牌正式成立，专注优选生鲜与日用百货' },
  { time: '2021', text: '自建冷链仓储网络，全国主要城市实现次日达' },
  { time: '2023', text: '会员体系全面升级，累计服务用户突破 1000 万' },
  { time: '2026', text: '全新商城上线，开启更便捷、更贴心的购物体验' },
]
const contactList = [
  { label: '官方网站', value: 'www.xiaotuxian.com' },
  { label: '客服热线', value: '400-800-8888' },
  { label: '商务合作', value: 'cooperation@xiaotuxian.com' },
]
const copy = () => {
  uni.setClipboardData({
    data: contactList[0].value,
    success: () => uni.showToast({ title: '已复制官网地址', icon: 'none' }),
  })
}
</script>

<template>
  <scroll-view scroll-y class="viewport">
    <!-- 品牌头部 -->
    <view class="header">
      <image class="logo" mode="aspectFit" src="@/static/images/logo.png"></image>
      <view class="slogan">新鲜 · 亲民 · 快捷</view>
    </view>

    <!-- 品牌介绍 -->
    <view class="panel">
      <view class="panel-title">品牌介绍</view>
      <view class="intro">
        <text class="paragraph">
          小兔鲜儿成立于2019年，是一家专注于精选生鲜、健康食品与品质日用品的综合电商平台。我们坚持"新鲜、亲民、快捷"的服务理念，从产地直采到冷链配送，只为把最新鲜的好物以更实在的价格送到您手中。
        </text>
        <text class="paragraph">
          目前，小兔鲜儿已覆盖水果蔬菜、肉禽蛋品、粮油副食、母婴个护等数十个品类，并与全国上千家优质供应商建立深度合作，让每一位用户都能安心选购、畅享生活。
        </text>
      </view>
    </view>

    <!-- 服务承诺 -->
    <view class="panel">
      <view class="panel-title">服务承诺</view>
      <view class="features">
        <view class="feature" v-for="item in features" :key="item.title">
          <text class="icon" :class="item.icon"></text>
          <view class="info">
            <view class="title">{{ item.title }}</view>
            <view class="desc">{{ item.desc }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 发展历程 -->
    <view class="panel">
      <view class="panel-title">发展历程</view>
      <view class="milestones">
        <view class="milestone" v-for="item in milestones" :key="item.time">
          <view class="time">{{ item.time }}</view>
          <view class="text">{{ item.text }}</view>
        </view>
      </view>
    </view>

    <!-- 联系我们 -->
    <view class="panel">
      <view class="panel-title">联系我们</view>
      <view class="contacts">
        <view class="contact" v-for="item in contactList" :key="item.label">
          <text class="label">{{ item.label }}</text>
          <text class="value">{{ item.value }}</text>
        </view>
      </view>
      <view class="copy-btn" @tap="copy">复制官网地址</view>
    </view>

    <!-- 版权信息 -->
    <view class="footer">
      <view>小兔鲜儿 V{{ version }}</view>
      <view>© 2019-2026 小兔鲜儿 版权所有</view>
    </view>
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f8;
}

.viewport {
  height: 100%;
  padding-bottom: 40rpx;
}

/* 品牌头部 */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 70rpx;
  background-image: url(@/static/images/navigator_bg.png);
  background-size: cover;

  .logo {
    width: 200rpx;
    height: 56rpx;
  }

  .name {
    margin-top: 30rpx;
    font-size: 44rpx;
    font-weight: 600;
    color: #fff;
  }

  .slogan {
    margin-top: 16rpx;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.9);
  }
}

/* 通用面板 */
.panel {
  margin: 20rpx 20rpx 0;
  padding: 30rpx;
  border-radius: 16rpx;
  background-color: #fff;

  .panel-title {
    position: relative;
    padding-left: 18rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #262626;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 8rpx;
      height: 28rpx;
      border-radius: 4rpx;
      background-color: #27ba9b;
    }
  }
}

/* 品牌介绍 */
.intro {
  margin-top: 24rpx;

  .paragraph {
    display: block;
    margin-bottom: 20rpx;
    line-height: 1.8;
    font-size: 28rpx;
    color: #555;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* 服务承诺 */
.features {
  margin-top: 10rpx;

  .feature {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .icon {
      width: 88rpx;
      height: 88rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 24rpx;
      border-radius: 50%;
      font-size: 44rpx;
      color: #fff;
      background-color: #27ba9b;

      &::before {
        font-size: 44rpx;
      }
    }

    .info {
      flex: 1;

      .title {
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
      }

      .desc {
        margin-top: 10rpx;
        line-height: 1.6;
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

/* 发展历程 */
.milestones {
  margin-top: 20rpx;

  .milestone {
    position: relative;
    display: flex;
    padding: 0 0 36rpx 30rpx;

    &::before {
      content: '';
      position: absolute;
      left: 8rpx;
      top: 12rpx;
      bottom: 0;
      width: 2rpx;
      background-color: #e5e5e5;
    }

    &:last-child {
      padding-bottom: 0;

      &::before {
        display: none;
      }
    }

    .time {
      width: 110rpx;
      margin-right: 24rpx;
      padding: 4rpx 0;
      text-align: center;
      font-size: 26rpx;
      font-weight: 600;
      color: #27ba9b;
      border-radius: 30rpx;
      background-color: rgba(39, 186, 155, 0.1);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: -30rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 18rpx;
        height: 18rpx;
        border-radius: 50%;
        background-color: #27ba9b;
      }
    }

    .text {
      flex: 1;
      line-height: 1.6;
      font-size: 26rpx;
      color: #666;
    }
  }
}

/* 联系我们 */
.contacts {
  margin-top: 10rpx;

  .contact {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .label {
      width: 160rpx;
      font-size: 28rpx;
      color: #333;
    }

    .value {
      flex: 1;
      font-size: 26rpx;
      color: #666;
    }
  }
}

.copy-btn {
  height: 76rpx;
  margin-top: 20rpx;
  text-align: center;
  line-height: 76rpx;
  font-size: 28rpx;
  color: #fff;
  border-radius: 40rpx;
  background-color: #27ba9b;
}

/* 版权信息 */
.footer {
  padding: 40rpx 0 20rpx;
  text-align: center;
  line-height: 1.8;
  font-size: 22rpx;
  color: #bbb;
}
</style>
