import type {
  DeliveryInfo,
  Order,
  OrderList,
  OrderListParams,
  OrderResult,
  PreOrder,
  SubmitOrder,
} from '@/types/order'
import { request } from '@/utils/request'
import type { OrderState } from './constants'

export const getPreOrderService = () => {
  return request<PreOrder>({
    url: '/member/order/pre',
    method: 'GET',
  })
}
export const getPreNowOrderService = (data: {
  skuId: string
  count: number
  addressId?: string
}) => {
  return request<Order>({
    url: '/member/order/pre/now',
    method: 'GET',
    data,
  })
}
export const getRepurchaseOrderService = (id: string) => {
  return request<Order>({
    url: `/member/order/repurchase/${id}`,
    method: 'GET',
  })
}
export const submitOrderService = (data: SubmitOrder) => {
  return request<{ id: string }>({
    url: '/member/order',
    method: 'POST',
    data,
  })
}
export const getOrderDetailService = (id: string) => {
  return request<OrderResult>({
    url: `/member/order/${id}`,
    method: 'GET',
  })
}
export const cancelOrderService = (id: string, data: { cancelReason: string }) => {
  return request<OrderResult>({
    url: `/member/order/${id}/cancel`,
    method: 'PUT',
    data,
  })
}
export const getOrderConsignmentService = (id: string) => {
  return request({
    url: `/member/order/consignment/${id}`,
    method: 'GET',
  })
}
export const confirmConsignmentService = (id: string) => {
  return request<OrderResult>({
    url: `/member/order/${id}/receipt`,
    method: 'PUT',
  })
}
export const getDeliveryInfoService = (id: string) => {
  return request<DeliveryInfo>({
    url: `/member/order/${id}/logistics`,
    method: 'GET',
  })
}
export const deleteOrderService = (ids: string[]) => {
  return request<OrderResult>({
    url: `/member/order`,
    method: 'DELETE',
    data: { ids },
  })
}
export const getOrderListService = (data: OrderListParams) => {
  return request<OrderList>({
    url: `/member/order/?page=${data.page}&pageSize=${data.pageSize}&orderState=${data.orderState}`,
    method: 'GET',
  })
}
