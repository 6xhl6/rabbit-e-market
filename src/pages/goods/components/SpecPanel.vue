<script setup lang="ts">
import type { SpecItem, SkuItem } from '@/types/goods'
import { ref, computed } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', payload: { skuId: string; quantity: number; specsText: string }): void
}>()

const props = defineProps<{
  specs: SpecItem[]
  skus: SkuItem[]
  mainPictures: string[]
  price: string | number
  name: string
}>()

// 已选中的规格: { "规格": "套装xxx" }
const selectedSpecs = ref<Record<string, string>>({})
const quantity = ref(1)

// 判断某个规格值是否可选（在已选其他规格的前提下，存在库存 > 0 的 SKU）
const isSpecValueAvailable = (specName: string, valueName: string): boolean => {
  // 构造"假设选中这个值"后的完整选择
  const hypothetical: Record<string, string> = {
    ...selectedSpecs.value,
    [specName]: valueName,
  }
  const entries = Object.entries(hypothetical).filter(([, v]) => v !== '')

  // 是否存在一个 SKU 满足所有已选规格且库存 > 0
  return props.skus.some((sku) => {
    return (
      entries.every(([name, val]) =>
        sku.specs.some((s) => s.name === name && s.valueName === val),
      ) && sku.inventory > 0
    )
  })
}

// 匹配当前选中规格的 SKU
const currentSku = computed<SkuItem | null>(() => {
  const selectedEntries = Object.entries(selectedSpecs.value).filter(([, v]) => v !== '')
  if (selectedEntries.length === 0) return null

  return (
    props.skus.find((sku) => {
      return selectedEntries.every(([name, valueName]) => {
        return sku.specs.some((s) => s.name === name && s.valueName === valueName)
      })
    }) ?? null
  )
})

// 当前显示的价格（匹配到 SKU 用 SKU 价格，否则用默认价格）
const currentPrice = computed(() => {
  return currentSku.value?.price ?? props.price
})

// 原价
const currentOldPrice = computed(() => {
  return currentSku.value?.oldPrice ?? props.price
})

// 当前库存
const currentStock = computed(() => {
  return currentSku.value?.inventory ?? 0
})

// 当前显示图片
const currentImage = computed(() => {
  return currentSku.value?.picture || props.mainPictures?.[0] || ''
})

// 已选规格描述文本
const specsText = computed(() => {
  return Object.values(selectedSpecs.value).filter(Boolean).join('、')
})

// 点击规格值
const handleSpecClick = (specName: string, valueName: string) => {
  // 不可选则不响应
  if (!isSpecValueAvailable(specName, valueName)) return

  if (selectedSpecs.value[specName] === valueName) {
    // 取消选中
    selectedSpecs.value[specName] = ''
  } else {
    selectedSpecs.value[specName] = valueName
  }
  // 切换规格时重置数量
  quantity.value = 1
}

// 数量操作
const handleQuantityChange = (e: any) => {
  const value = Number(e.detail.value)
  if (value < 1) {
    quantity.value = 1
  } else if (currentStock.value > 0 && value > currentStock.value) {
    quantity.value = currentStock.value
  } else {
    quantity.value = value
  }
}

const handleMinus = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handlePlus = () => {
  if (quantity.value < currentStock.value) {
    quantity.value++
  }
}

const handleConfirm = () => {
  if (!currentSku.value) {
    uni.showToast({ title: '请选择完整规格', icon: 'none' })
    return
  }
  if (currentSku.value.inventory <= 0) {
    uni.showToast({ title: '该规格已售罄', icon: 'none' })
    return
  }
  emit('confirm', {
    skuId: currentSku.value.id,
    quantity: quantity.value,
    specsText: specsText.value,
  })
}
</script>

<template>
  <view class="spec-panel">
    <!-- 关闭按钮 -->
    <text class="close icon-close" @tap="emit('close')" />

    <!-- 商品头部 -->
    <view class="header">
      <image class="image" mode="aspectFill" :src="currentImage" />
      <view class="info">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ currentPrice }}</text>
          <text v-if="currentOldPrice !== currentPrice" class="old-price">
            ¥{{ currentOldPrice }}
          </text>
        </view>
        <view class="stock" v-if="currentSku"> 库存：{{ currentStock }} 件 </view>
        <view class="selected-specs">
          {{ specsText || '请选择规格' }}
        </view>
      </view>
    </view>

    <!-- 规格选择区 -->
    <scroll-view scroll-y class="spec-body">
      <view class="spec-group" v-for="specItem in specs" :key="specItem.name">
        <view class="spec-label">{{ specItem.name }}</view>
        <view class="spec-values">
          <text
            class="spec-value"
            :class="{
              active: selectedSpecs[specItem.name] === val.name,
              disabled: !isSpecValueAvailable(specItem.name, val.name),
            }"
            v-for="val in specItem.values"
            :key="val.name"
            @tap="handleSpecClick(specItem.name, val.name)"
          >
            {{ val.name }}
          </text>
        </view>
      </view>

      <!-- 数量选择 -->
      <view class="quantity-group" v-if="currentSku">
        <view class="quantity-label">数量</view>
        <view class="quantity-control">
          <text class="btn minus" :class="{ disabled: quantity <= 1 }" @tap="handleMinus">-</text>
          <input
            class="input"
            type="number"
            :value="String(quantity)"
            @change="handleQuantityChange"
          />
          <text class="btn plus" :class="{ disabled: quantity >= currentStock }" @tap="handlePlus"
            >+</text
          >
        </view>
      </view>
    </scroll-view>

    <!-- 确认按钮 -->
    <view class="footer">
      <view class="button primary" @tap="handleConfirm"> 确定 </view>
    </view>
  </view>
</template>

<style lang="scss">
.spec-panel {
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  max-height: 900rpx;
}

.close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
  z-index: 2;
}

/* 商品信息头部 */
.header {
  display: flex;
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #f4f4f4;

  .image {
    width: 170rpx;
    height: 170rpx;
    border-radius: 10rpx;
    margin-right: 20rpx;
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 10rpx;
  }

  .price {
    color: #cf4444;
    line-height: 1;
    margin-bottom: 10rpx;
  }

  .symbol {
    font-size: 28rpx;
  }

  .number {
    font-size: 44rpx;
    font-weight: 600;
  }

  .old-price {
    font-size: 24rpx;
    color: #999;
    text-decoration: line-through;
    margin-left: 10rpx;
  }

  .stock {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 6rpx;
  }

  .selected-specs {
    font-size: 24rpx;
    color: #999;
  }
}

/* 规格选择区 */
.spec-body {
  flex: 1;
  max-height: 500rpx;
  padding: 0 30rpx;
}

.spec-group {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f4f4f4;

  &:last-of-type {
    border-bottom: none;
  }
}

.spec-label {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.spec-values {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.spec-value {
  padding: 12rpx 28rpx;
  font-size: 26rpx;
  color: #333;
  background-color: #f5f5f5;
  border-radius: 40rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s;

  /* 选中态：主题色 */
  &.active {
    color: #fff;
    background-color: #27ba9b;
    border-color: #27ba9b;
  }

  /* 不可选：库存为0，淡灰色 */
  &.disabled {
    color: #ccc;
    background-color: #f8f8f8;
  }
}

/* 数量选择 */
.quantity-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0;
}

.quantity-label {
  font-size: 26rpx;
  color: #666;
}

.quantity-control {
  display: flex;
  align-items: center;

  .btn {
    width: 56rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    font-size: 32rpx;
    color: #333;
    background-color: #f5f5f5;
    border-radius: 4rpx;

    &.disabled {
      color: #ccc;
    }
  }

  .input {
    width: 100rpx;
    height: 56rpx;
    text-align: center;
    font-size: 28rpx;
    color: #333;
    margin: 0 8rpx;
    background-color: #f5f5f5;
    border-radius: 4rpx;
  }
}

/* 底部按钮 */
.footer {
  padding: 20rpx 30rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));

  .button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
  }

  .primary {
    background-color: #27ba9b;
  }
}
</style>
