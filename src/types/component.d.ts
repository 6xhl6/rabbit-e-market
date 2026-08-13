import 'vue'
import CustomSwiper from '@/components/CustomSwiper.vue'
import CustomGuessLike from '@/components/CustomGuessLike.vue'
import type { SkuPopup } from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'
import type { InputNumberBox } from '@/components/vk-data-input-number-box/vk-data-input-number-box'
// 自定义组件声明类型并使其高亮显示
declare module 'vue' {
  export interface GlobalComponents {
    CustomSwiper: typeof CustomSwiper
    CustomGuessLike: typeof CustomGuessLike
    'vk-data-goods-sku-popup': SkuPopup
    'vk-data-input-number-box': InputNumberBox
  }
}
// 组件实例类型
export type CustomGuessInstance = InstanceType<typeof CustomGuessLike>
