import type { PayInfo } from '@/types/pay'
import { request } from '@/utils/request'

export const getPayInfoService = (orderId: string) => {
  return request<PayInfo>({
    url: `/pay/wxPay/miniPay?orderId=${orderId}`,
    method: 'GET',
  })
}
export const getMockPayInfoService = (orderId: string) => {
  return request({
    url: `/pay/mock?orderId=${orderId}`,
    method: 'GET',
  })
}
