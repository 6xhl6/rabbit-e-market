<script setup lang="ts">
// 登录
import { ref } from 'vue'
import { h5loginService, login, loginTest } from '@/services/login'
import { useMemberStore } from '@/stores'
import { onLoad } from '@dcloudio/uni-app'

let code = ''
const MemberStore = useMemberStore()

// 登录成功：有上一页则返回，否则跳转首页
const handleLoginSuccess = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/index/index' })
  }
  uni.showToast({ title: '登录成功', icon: 'success' })
}
// #ifdef MP-WEIXIN
onLoad(async () => {
  // 有token跳首页
  if (MemberStore?.profile?.token) {
    return uni.redirectTo({
      url: '/pages/index/index',
    })
  }
  try {
    const wxloginRes = await uni.login()
    console.log('uni.login 结果:', wxloginRes)
    code = wxloginRes.code
  } catch (err) {
    console.error('uni.login 失败:', err)
  }
})

const onGetPhoneNumber: UniHelper.ButtonOnGetphonenumber = async (e) => {
  console.log('getphonenumber 回调:', e.detail)

  const encryptedData = e.detail?.encryptedData
  const iv = e.detail?.iv

  if (!encryptedData || !iv) {
    console.warn(
      '未获取到 encryptedData/iv,可能是新版基础库(≥2.21.2),' + '新版需在后端用 code 换取手机号',
    )
    uni.showToast({ title: '获取手机号失败，请重试', icon: 'none' })
    return
  }

  if (!code) {
    uni.showToast({ title: '登录凭证获取失败，请重试', icon: 'none' })
    return
  }
  console.log('发送登录请求:', { code, encryptedData: encryptedData.slice(0, 20) + '...', iv })

  try {
    const loginRes = await login({
      code,
      encryptedData,
      iv,
    })
    console.log('登录成功:', loginRes)
    MemberStore.setProfile(loginRes.result)
    handleLoginSuccess()
  } catch (err) {
    console.error('登录请求失败:', err)
  }
}
// #endif

// #ifdef H5
const phone = ref('')
const pwd = ref('')
const h5login = async () => {
  const res = await h5loginService(phone.value, pwd.value)
  MemberStore.setProfile(res.result)
  handleLoginSuccess()
}
// #endif
const onGetPhoneNumberSimple = async () => {
  const phoneNumber = '17817602605'
  const loginRes = await loginTest(phoneNumber)
  MemberStore.setProfile(loginRes.result)
  // 页面跳转
  handleLoginSuccess()
}
</script>

<template>
  <view class="viewport">
    <view class="logo">
      <image
        src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/logo_icon.png"
      ></image>
    </view>
    <view class="login">
      <!-- 网页端表单登录 -->
      <!-- #ifdef H5 -->
      <input class="input" type="text" placeholder="请输入用户名/手机号码" v-model="phone" />
      <input class="input" type="text" password placeholder="请输入密码" v-model="pwd" />
      <button class="button phone" @click="h5login">登录</button>
      <!-- #endif -->

      <!-- 小程序端授权登录 -->
      <!-- #ifdef MP-WEIXIN -->
      <button class="button phone" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">
        <text class="icon icon-phone"></text>
        手机号快捷登录
      </button>
      <!-- #endif -->
      <view class="extra">
        <view class="caption">
          <text>其他登录方式</text>
        </view>
        <view class="options">
          <!-- 通用模拟登录 -->
          <button @tap="onGetPhoneNumberSimple">
            <text class="icon icon-phone">模拟快捷登录</text>
          </button>
        </view>
      </view>
      <view class="tips">登录/注册即视为你同意《服务条款》和《小兔鲜儿隐私协议》</view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx 40rpx;
}

.logo {
  flex: 1;
  text-align: center;

  image {
    width: 220rpx;
    height: 220rpx;
    margin-top: 15vh;
  }
}

.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
  padding: 40rpx 20rpx 20rpx;

  .input {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    border: 1px solid #ddd;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    color: #fff;

    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  .phone {
    background-color: #28bb9c;
  }

  .wechat {
    background-color: #06c05f;
  }

  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;

    .caption {
      width: 440rpx;
      line-height: 1;
      border-top: 1rpx solid #ddd;
      font-size: 26rpx;
      color: #999;
      position: relative;

      text {
        transform: translate(-40%);
        background-color: #fff;
        position: absolute;
        top: -12rpx;
        left: 50%;
      }
    }

    .options {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 70rpx;

      button {
        padding: 0;
        background-color: transparent;
      }
    }

    .icon {
      font-size: 24rpx;
      color: #444;
      display: flex;
      flex-direction: column;
      align-items: center;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444;
        border-radius: 50%;
      }
    }

    .icon-weixin::before {
      border-color: #06c05f;
      color: #06c05f;
    }
  }
}

.tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
}
</style>
