import { request } from '@/utils/request'
import type { GoodsDetailResponse } from '@/types/goods'

export const getGoodsService = (data: { id: string }) => {
  return request<GoodsDetailResponse>({
    url: '/goods',
    data,
  })
}
