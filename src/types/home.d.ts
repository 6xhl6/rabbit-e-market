/** Banner 类型 */
export interface Banner {
  /** id */
  id: string
  /** banner链接 */
  imgUrl: string
  /** 跳转链接 */
  hrefUrl: string
  /** 跳转类型 1=页面 2=H5 3=小程序 */
  type: number
}
/** 前台类目 */
export interface Category {
  /** id */
  id: string
  /** 类目名称 */
  name: string
  /** 类目图标 */
  icon: string
}
/** 热门类目 */
export interface Hot {
  /** id */
  id: string
  /** 推荐说明 */
  alt: string
  /** 图片集合 */
  pictures: string[]
  /** 跳转地址 */
  target: string
  /** 推荐标题 */
  title: string
  /** 推荐类型 */
  type: string
}
export interface Guess {
  /** id */
  id: string
  /** 商品名称 */
  name: string
  /** 商品描述 */
  desc: string
  /** 商品价格 */
  price: number
  /** 商品图片 */
  picture: string
  /** 商品折扣 */
  discount: number
  /** 商品已下单数量 */
  orderNum: number
}
