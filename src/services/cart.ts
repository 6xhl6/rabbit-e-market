import type { CartItem } from '@/types/cart'
import { request } from '@/utils/request'

export const addToCartService = (data: { skuId: string; count: number }) => {
  return request<CartItem>({
    url: '/member/cart',
    method: 'POST',
    data,
  })
}

export const getCartListService = () => {
  return request<CartItem[]>({
    url: '/member/cart',
    method: 'GET',
  })
}

export const deleteCartService = (ids: string[]) => {
  return request<CartItem>({
    url: `/member/cart`,
    method: 'DELETE',
    data: { ids },
  })
}

export const updateCartService = (skuId: string, data?: { selected?: boolean; count?: number }) => {
  return request<CartItem>({
    url: `/member/cart/${skuId}`,
    method: 'PUT',
    data,
  })
}
export const updateCartSelectedService = (data: { selected: boolean }) => {
  return request({
    url: '/member/cart/selected',
    method: 'PUT',
    data,
  })
}
