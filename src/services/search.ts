import { request } from '@/utils/request'
import type { SearchParams, SearchResult, SearchTipsItem } from '@/types/search'

/** 搜索商品（带筛选条件） */
export const getSearchResultService = (data: SearchParams) => {
  return request<SearchResult>({
    url: '/search/all',
    method: 'POST',
    data,
  })
}

/** 搜索联想词 */
export const getSearchTipsService = (keyword: string) => {
  return request<SearchTipsItem[]>({
    url: '/search/tips',
    method: 'GET',
    data: { keyword },
  })
}
