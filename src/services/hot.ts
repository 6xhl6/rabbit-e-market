import { request } from '@/utils/request'
import type { PageParams } from '@/types/global'
import type { HotRecommend } from '@/types/hot'

type HotParams = PageParams & {
  subType?: string
}
export const getHotRecommendService = async (url: string, data?: HotParams) => {
  return request<HotRecommend>({
    method: 'GET',
    url,
    data: {
      ...data,
    },
  })
}
