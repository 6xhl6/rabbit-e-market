import type { OrderState } from '@/services/constants'

export type PreOrder = {
  userAddresses: Address[]
  goods: OrderGoods[]
  summary: OrderSummary
}
export type Order = {
  userAddresses: (Omit<Address, 'receiver' | 'contact' | 'fullLocation'> & { selected: boolean })[]
  goods: OrderGoods[]
  summary: OrderSummary
}
export type OrderSummary = {
  goodsCount: number
  totalPrice: number
  totalPayPrice: number
  postFee: number
  discountPrice: number
}
export type OrderGoods = {
  id: string
  name: string
  picture: string
  count: number
  skuId: string
  attrsText: string
  price: number
  payPrice: number
  totalPrice: number
  totalPayPrice: number
}
export type SubmitOrder = {
  // 商品集合
  goods: {
    skuId: string
    count: number
  }[]
  // 所选地址Id
  addressId: string
  // 配送时间类型，1为不限，2为工作日，3为双休或假日
  deliveryTimeType: number
  // 买家留言
  buyerMessage: string
  // 支付方式，1为在线支付，2为货到付款
  payType: number
  // 支付渠道：支付渠道，1支付宝、2微信--支付方式为在线支付时，传值，为货到付款时，不传值
  payChannel: 1 | 2
}
export type OrderResult = {
  /** 订单编号 */
  id: string
  /** 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消 */
  orderState: OrderState
  /** 倒计时--剩余的秒数 -1 表示已经超时，正数表示倒计时未结束 */
  countdown: number
  /** 商品集合 [ 商品信息 ] */
  skus: OrderSkuItem[]
  /** 收货人 */
  receiverContact: string
  /** 收货人手机 */
  receiverMobile: string
  /** 收货人完整地址 */
  receiverAddress: string
  /** 下单时间 */
  createTime: string
  /** 商品总价 */
  totalMoney: number
  /** 运费 */
  postFee: number
  /** 应付金额 */
  payMoney: number
}

/** 商品信息 */
export type OrderSkuItem = {
  /** sku id */
  id: string
  /** 商品 id */
  spuId: string
  /** 商品名称 */
  name: string
  /** 商品属性文字 */
  attrsText: string
  /** 数量 */
  quantity: number
  /** 购买时单价 */
  curPrice: number
  /** 图片地址 */
  image: string
}
export type DeliveryInfo = {
  /** 快递公司 */
  company: {
    /** 公司名称 */
    name: string
    /** 快递编号 */
    number: string
    /** 联系电话 */
    tel: string
  }
  /** 商品件数 */
  count: number
  /** 物流日志 */
  list: LogisticItem[]
}

/** 物流日志 */
export type LogisticItem = {
  /** 信息ID */
  id: string
  /** 信息文字 */
  text: string
  /** 时间 */
  time: string
}
export type OrderListParams = {
  /** 订单状态 */
  orderState?: OrderState
  /** 页尺寸 */
  pageSize?: number
  /** 当前页码 */
  page?: number
}
export type OrderList = {
  /** 订单列表 */
  counts: number
  /** 页尺寸 */
  pageSize: string
  /** 总页数 */
  pages: number
  /** 当前页码 */
  page: number
  /** 数据集合 */
  items: OrderListItem[]
}
export type OrderListItem = {
  /** 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消 */
  id: string
  /** 下单时间 */
  createTime: string
  /** 支付方式，1为在线支付，2为货到付款 */
  payType: number
  /** 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消 */
  orderState: OrderState
  /** 付款截止时间 */
  payLatestTime: string
  /** 倒计时--剩余的秒数 -1 表示已经超时，正数表示倒计时未结束 */
  countdown: number
  /** 运费 */
  postFee: number
  /** 实付金额 */
  payMoney: number
  /** 金额合计 */
  totalMoney: number
  /** 数量合计 */
  totalNum: string
  /** 商品集合 */
  skus: OrderSkuItem[]
}
export type OrderDetOrderSkuItem = {
  /** sku id */
  id: string
  /** 商品 id */
  spuId: string
  /** 商品名称 */
  name: string
  /** 商品属性文字 */
  attrsText: string
  /** 图片地址 */
  image: string
  /** 数量 */
  quantity: number
  /** sku价格 */
  curPrice: number
  /** 数量 */
  quantity: number
  /** 实付金额 */
  realPay: number
  properties: {
    /** 属性名称，如 颜色 */
    propertyMainName: string
    /** 属性值名称，如 黑色 */
    propertyValueName: string
  }
}
