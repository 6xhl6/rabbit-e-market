export type LoginResult = {
  /** 用户id */
  id: number
  /** 手机号 */
  mobile: string
  /** 登录凭证 */
  token: string
  /** 昵称 */
  nickname?: string
  /** 头像 */
  avatar: string
  /** 用户名 */
  account: string
}
export type LoginParams = {
  /** 登录凭证 */
  code: string
  /** 加密后的用户信息 */
  encryptedData: string
  /** 加密后的用户信息的iv */
  iv: string
}
