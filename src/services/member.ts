import type { Address, Profile, UpdateProfileParams } from '@/types/member'
import { request } from '@/utils/request'

export const getMemberProfile = () => {
  return request<Profile>({
    url: '/member/profile',
    method: 'GET',
  })
}
export const updateMemberProfile = (data: UpdateProfileParams) => {
  return request<Profile>({
    url: '/member/profile',
    method: 'PUT',
    data,
  })
}
export const getAddressList = () => {
  return request<Address[]>({
    url: '/member/address',
    method: 'GET',
  })
}
export const getAddressDetail = (id: string) => {
  return request<Address>({
    url: `/member/address/${id}`,
    method: 'GET',
  })
}
export const addAddress = (data: Omit<Address, 'fullLocation' | 'id'>) => {
  return request<{ id: string }>({
    url: '/member/address',
    method: 'POST',
    data,
  })
}
export const updateAddress = (id: string, data: Omit<Address, 'fullLocation' | 'id'>) => {
  return request<{ id: string }>({
    url: `/member/address/${id}`,
    method: 'PUT',
    data,
  })
}
export const deleteAddress = (id: string) => {
  return request<{ id: string }>({
    url: `/member/address/${id}`,
    method: 'DELETE',
  })
}
