import { request } from '@/utils/request'
import type { LoginResult, LoginParams } from '@/types/login'

export const login = (data: LoginParams) => {
  return request<LoginResult>({
    url: '/login/wxMin',
    method: 'POST',
    data,
  })
}
export const loginTest = (phoneNumber: string) => {
  return request<LoginResult>({
    url: '/login/wxMin/simple',
    method: 'POST',
    data: { phoneNumber },
  })
}
export const h5loginService = (account: string, password: string) => {
  return request<LoginResult>({
    url: '/login',
    method: 'POST',
    data: { account, password },
  })
}
