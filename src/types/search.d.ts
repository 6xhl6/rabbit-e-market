/** 搜索参数 */
export type SearchParams = {
  /** 页码 */
  page: number
  /** 页尺寸 */
  pageSize: number
  /** 所输入的关键词 */
  keyword?: string
  /** 联想词Id集合 */
  associatedIds?: string[]
  /** 分类id */
  categoryId?: string
  /** 品牌id */
  brandId?: string
  /** 只显示特惠 */
  onlyDiscount?: boolean
  /** 排序字段，取值范围：[publishTime,orderNum,price,evaluateNum] */
  sortField?: string
  /** 排序规则，asc为正序，desc为倒序，默认为desc */
  sortMethod?: string
}

/** 搜索结果 */
export type SearchResult = {
  /** 条件信息 */
  conditions: Conditions
  /** 分页信息 */
  pageData: PageData
}

/** 筛选条件 */
export type Conditions = {
  /** 分类集合 */
  categories: CategoryItem[]
  /** 品牌集合 */
  brands: BrandItem[]
}

/** 分类项 */
export type CategoryItem = {
  id: string
  name: string
}

/** 品牌项 */
export type BrandItem = {
  id: string
  /** 品牌名称 */
  name: string
  /** 品牌英文名称 */
  nameEn: string
  /** 品牌logo */
  logo: string
}

/** 分页数据 */
export type PageData = {
  /** 总数量 */
  counts: number
  /** 每页条数 */
  pageSize: number
  /** 总页数 */
  pages: number
  /** 当前页数 */
  page: number
  /** 商品集合 */
  items: SearchGoodsItem[]
}

/** 搜索商品项 */
export type SearchGoodsItem = {
  id: string
  picture: string
  name: string
  price: number
  desc: string
  discount: number
}

/** 联想词项 */
export type SearchTipsItem = {
  /** 关键字id集合 */
  ids: string[]
  /** 联想词 */
  associatedWord: string
}
