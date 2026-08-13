import { Goods } from './global'
export type CategoryL1 = {
  id: string
  name: string
  picture: string
  imageBanners: string[]
  children: CategoryL2[]
}
export type CategoryL2 = {
  id: string
  name: string
  picture: string
  parentId: null
  parentName: null
  goods: (Goods & { discount: null; orderNum: number })[]
  categories: null
  brands: null
  saleProperties: null
}
