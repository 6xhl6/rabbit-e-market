/** 热门推荐接口类型 */
import type { Goods, PageResult } from '@/types/global'
export type subType = {
  /** 子类型名称 */
  id: string
  /** 子类型id */
  title: string
  goodsItems: PageResult<Goods>
}
export type HotRecommend = {
  title: number
  id: string
  bannerPicture: string
  subTypes: subType[]
}
