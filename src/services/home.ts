import { request } from '@/utils/request'
import type { Banner, Category, Hot, Guess } from '@/types/home'
import type { PageResult, PageParams } from '@/types/global'

export const getBannerService = async (data?: { distributionSite: number }) => {
  return request<Banner[]>({
    method: 'GET',
    url: '/home/banner',
    data,
  })
}
export const getCategoryService = async () => {
  return request<Category[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}
export const getHotService = async () => {
  return request<Hot[]>({
    method: 'GET',
    url: '/home/hot/mutli',
  })
}
export const getGuessService = async (data?: PageParams) => {
  return request<PageResult<Guess>>({
    method: 'GET',
    url: '/home/goods/guessLike',
    data,
  })
}
