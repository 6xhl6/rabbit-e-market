<script setup lang="ts">
import { addAddress, getAddressDetail, updateAddress } from '@/services/member'
import { ADDRESS_FORM_RULES } from '@/utils/FormRules'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const props = defineProps({
  id: {
    type: String,
  },
})

// 表单数据：fullLocation 存数组供 picker 显示和表单验证，
// provinceCode/cityCode/countyCode 存编码供提交
const formModel = ref({
  receiver: '',
  contact: '',
  provinceCode: '',
  cityCode: '',
  countyCode: '',
  fullLocation: undefined as [string, string, string] | undefined,
  address: '',
  isDefault: 0 as 0 | 1,
})

// 加载已有地址详情（编辑模式）
const getAddressDetailData = async () => {
  if (props.id) {
    const res = await getAddressDetail(props.id)
    // 将地址数据合并到表单模型
    Object.assign(formModel.value, res.result)
  }
}
onLoad(() => {
  if (props.id) {
    uni.setNavigationBarTitle({
      title: '修改地址',
    })
  } else {
    uni.setNavigationBarTitle({
      title: '新增地址',
    })
  }
  getAddressDetailData()
})

// 省市区选择器变化：同时更新 code（提交用）和 fullLocation 数组（显示+验证用）
const handleRegionChange: UniHelper.RegionPickerOnChange = (e) => {
  const code = e.detail?.code
  if (code) {
    formModel.value.provinceCode = code[0]
    formModel.value.cityCode = code[1]
    formModel.value.countyCode = code[2]
  }
  formModel.value.fullLocation = e.detail.value as [string, string, string]
}

const rules: UniHelper.UniFormsRules = ADDRESS_FORM_RULES
const formRef = ref<UniHelper.UniFormsInstance>()

// 提交：剥离 fullLocation，只发送 API 需要的字段（codes）
const handleSubmit = async () => {
  try {
    await formRef.value!.validate!()
    const { fullLocation, ...submitData } = formModel.value
    if (!props.id) {
      await addAddress(submitData)
      uni.navigateBack()
      return uni.showToast({
        title: '添加成功',
        icon: 'success',
      })
    }
    await updateAddress(props.id, submitData)
    uni.showToast({
      title: '修改成功',
      icon: 'success',
    })
  } catch (error) {
    uni.showToast({
      title: '填写信息有误',
      icon: 'error',
    })
  }
}
</script>

<template>
  <view class="content">
    <uni-forms :rules="rules" ref="formRef" :model="formModel">
      <!-- 表单内容 -->
      <uni-forms-item class="form-item" name="receiver">
        <text class="label">收货人</text>
        <input class="input" placeholder="请填写收货人姓名" v-model="formModel.receiver" />
      </uni-forms-item>
      <uni-forms-item class="form-item" name="contact">
        <text class="label">手机号码</text>
        <input class="input" placeholder="请填写收货人手机号码" v-model="formModel.contact" />
      </uni-forms-item>
      <uni-forms-item class="form-item" name="fullLocation">
        <text class="label">所在地区</text>
        <picker
          class="picker"
          mode="region"
          :value="formModel.fullLocation"
          @change="handleRegionChange"
        >
          <view v-if="formModel.fullLocation">{{ formModel.fullLocation.join(' ') }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item class="form-item" name="address">
        <text class="label">详细地址</text>
        <input class="input" placeholder="街道、楼牌号等信息" v-model="formModel.address" />
      </uni-forms-item>
      <uni-forms-item class="form-item" name="isDefault">
        <label class="label">设为默认地址</label>
        <switch
          class="switch"
          name="isDefault"
          color="#27ba9b"
          :checked="Boolean(formModel.isDefault)"
          @change="(e: UniHelper.SwitchOnChangeEvent) => (formModel.isDefault = e.detail.value ? 1 : 0)"
        />
      </uni-forms-item>
    </uni-forms>
  </view>
  <!-- 提交按钮 -->
  <button class="button" @tap="handleSubmit">保存并使用</button>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx 30rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
