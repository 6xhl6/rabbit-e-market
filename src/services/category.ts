import { request } from '@/utils/request'
import type { CategoryL1 } from '@/types/category'

export const getCategoryList = () => {
  return request<CategoryL1[]>({
    url: '/category/top',
    method: 'GET',
  })
}
