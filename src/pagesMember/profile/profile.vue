<script setup lang="ts">
import { ref } from 'vue'
import { getMemberProfile, updateMemberProfile } from '@/services/member'
import { onLoad } from '@dcloudio/uni-app'
import type { Gender, Profile, UpdateProfileParams } from '@/types/member'
import { useMemberStore } from '@/stores'

const { safeAreaInsets } = uni.getSystemInfoSync()

const memberProfile = ref<Profile>({} as Profile)
const getMemberProfileData = async () => {
  const res = await getMemberProfile()
  console.log(res.result)
  memberProfile.value = res.result
}
onLoad(async () => {
  await getMemberProfileData()
})

const memberStore = useMemberStore()
const handleAvatarTap = () => {
  uni.chooseMedia({
    count: 1,
    success: (res) => {
      const avatarPath = res.tempFiles[0].tempFilePath
      uni.uploadFile({
        url: '/member/profile/avatar',
        name: 'file',
        filePath: avatarPath,
        success: (res) => {
          console.log('uploadFile res:', res)
          if (res.statusCode === 200) {
            const avatar = JSON.parse(res.data).result.avatar
            memberProfile!.value!.avatar = avatar
            memberStore.updateAvatar(avatar)
            uni.showToast({ title: '更新成功', icon: 'success' })
          } else {
            uni.showToast({ title: '更新失败', icon: 'none' })
          }
        },
        fail: (err) => {
          console.error('uploadFile 失败:', err)
          uni.showToast({ title: '上传失败', icon: 'none' })
        },
      })
    },
  })
}
const params = ref<UpdateProfileParams>({} as UpdateProfileParams)
const updateMembeInfo = async () => {
  params.value.nickname = memberProfile.value?.nickname
  params.value.gender = memberProfile.value?.gender
  params.value.birthday = memberProfile.value?.birthday
  params.value.profession = memberProfile.value?.profession
  const res = await updateMemberProfile(params.value)
  memberStore.updateProfile(params.value)
  console.log(res)
  uni.showToast({ title: '更新成功', icon: 'success' })
}
const handleGenderChange: UniHelper.RadioGroupOnChange = (e) => {
  memberProfile.value.gender = e.detail.value as Gender
}
const handleBirthdayChange: UniHelper.DatePickerOnChange = (e) => {
  console.log(e.detail.value)
  memberProfile.value.birthday = e.detail.value
}
const handleLocationChange: UniHelper.RegionPickerOnChange = (e) => {
  const code = e.detail.code as string[] | undefined
  if (code) {
    params.value.provinceCode = code[0]
    params.value.cityCode = code[1]
    params.value.countyCode = code[2]
  }
  memberProfile.value.fullLocation = e.detail.value?.join(' ') || ''
  console.log(e.detail)
}
</script>

<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none"></navigator>
      <view class="title">个人信息</view>
    </view>
    <!-- 头像 -->
    <view class="avatar">
      <view class="avatar-content">
        <image
          class="image"
          :src="memberProfile?.avatar || ''"
          mode="aspectFill"
          @tap="handleAvatarTap"
        />
        <text class="text">点击修改头像</text>
      </view>
    </view>
    <!-- 表单 -->
    <view class="form">
      <!-- 表单内容 -->
      <view class="form-content">
        <view class="form-item">
          <text class="label">账号</text>
          <text class="account">{{ memberProfile?.account }}</text>
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input
            class="input"
            type="text"
            placeholder="请填写昵称"
            v-model="memberProfile!.nickname"
          />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <radio-group @change="handleGenderChange">
            <label class="radio">
              <radio value="男" color="#27ba9b" :checked="memberProfile?.gender === '男'" />
              男
            </label>
            <label class="radio">
              <radio value="女" color="#27ba9b" :checked="memberProfile?.gender === '女'" />
              女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">生日</text>
          <picker
            class="picker"
            mode="date"
            start="1926-01-01"
            :end="new Date()"
            :value="memberProfile?.birthday"
            @change="handleBirthdayChange"
          >
            <view v-if="memberProfile?.birthday">{{ memberProfile?.birthday }}</view>
            <view class="placeholder" v-else>请选择日期</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <picker
            class="picker"
            mode="region"
            :value="
              memberProfile?.fullLocation
                ? memberProfile?.fullLocation.split(' ')
                : ['广东省', '广州市', '天河区']
            "
            @change="handleLocationChange"
          >
            <view v-if="memberProfile?.fullLocation">{{
              memberProfile?.fullLocation.replaceAll('--', ' ')
            }}</view>
            <view class="placeholder" v-else>请选择城市</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">职业</text>
          <input
            class="input"
            type="text"
            placeholder="请填写职业"
            v-model="memberProfile!.profession"
          />
        </view>
      </view>
      <!-- 提交按钮 -->
      <button class="form-button" @tap="updateMembeInfo">保 存</button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: auto 420rpx;
  background-repeat: no-repeat;
}

// 导航栏
.navbar {
  position: relative;

  .title {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 0;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 头像
.avatar {
  text-align: center;
  width: 100%;
  height: 260rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff;
  }
}

// 表单
.form {
  background-color: #f4f4f4;

  &-content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  &-item {
    display: flex;
    height: 96rpx;
    line-height: 46rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;

    &:last-child {
      border: none;
    }

    .label {
      width: 180rpx;
      color: #333;
    }

    .account {
      color: #666;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .radio {
      margin-right: 20rpx;
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }

  &-button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #27ba9b;
  }
}
</style>
