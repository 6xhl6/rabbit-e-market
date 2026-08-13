export type PageResult<T> = {
  counts: number
  pageSize: number
  pages: number
  page: number
  items: T[]
}
export type PageParams = {
  page?: number
  pageSize?: number
}
export type Goods = {
  /** 商品描述 */
  desc: string
  /** 商品id */
  id: string
  /** 商品名称 */
  name: string
  /** 商品图片 */
  picture: string
  /** 商品价格 */
  price: number
}
