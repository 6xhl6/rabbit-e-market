export type Profile = {
  /** 用户id */
  id: string
  /** 用户头像 */
  avatar: string
  /** 用户账号 */
  account: string
  /** 用户昵称 */
  nickname?: string
  /** 用户性别 */
  gender?: Gender
  /** 用户出生日期 */
  birthday?: string
  /** 用户位置 */
  fullLocation?: string
  /** 用户专业 */
  profession?: string
}
export type Gender = '男' | '女'

export type UpdateProfileParams = {
  /** 更新后的用户信息 */
  nickname?: string
  gender?: Gender
  birthday?: string
  profession?: string
  provinceCode?: string
  cityCode?: string
  countyCode?: string
}
export type Address = {
  /** 地址id */
  id: string
  /** 收货人姓名 */
  receiver: string
  /** 收货人手机号 */
  contact: string
  /** 收货人省份编码 */
  provinceCode: string
  /** 收货人城市编码 */
  cityCode: string
  /** 收货人区县编码 */
  countyCode: string
  /** 省市区 */
  fullLocation: string
  /** 收货人详细地址 */
  address: string
  /** 是否为默认地址 1 是 0 否 */
  isDefault: 0 | 1
}
export type isDefaultEnum = 0 | 1
