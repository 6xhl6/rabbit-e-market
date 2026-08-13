import { useMemberStore } from '@/stores/index'

/** 递归遍历对象/数组，将所有 http:// 开头的字符串替换为 https:// */
const ensureHttps = (data: unknown): unknown => {
  if (typeof data === 'string') {
    return data.startsWith('http://') ? 'https://' + data.slice(7) : data
  }
  if (Array.isArray(data)) {
    return data.map(ensureHttps)
  }
  if (data !== null && typeof data === 'object') {
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(data)) {
      result[key] = ensureHttps((data as Record<string, unknown>)[key])
    }
    return result
  }
  return data
}

const BASE_URL: string = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'
const requestInterceptor: UniApp.InterceptorOptions = {
  invoke: (options: UniApp.RequestOptions) => {
    if (!options.url.startsWith('http')) {
      options.url = BASE_URL + options.url
    }
    options.timeout = 20000
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    if (token) {
      options.header.Authorization = token
    }
    return options
  },
}
uni.addInterceptor('request', requestInterceptor)
uni.addInterceptor('uploadFile', requestInterceptor as UniApp.InterceptorOptions)

interface RequestOptions extends UniApp.RequestOptions {
  params?: Record<string, any>
}
interface Data<T> {
  code: number
  msg: string
  result: T
}

export const request = <T>(options: RequestOptions) => {
  const { params, ...rest } = options
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...rest,
      data: rest.data ?? params,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const data = res.data as Data<T>
          // 递归替换所有 http:// 开头的字符串为 https://
          data.result = ensureHttps(data.result) as T
          resolve(data)
        } else if (res.statusCode === 401) {
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.showToast({
            title: '登录过期，请重新登录',
            icon: 'none',
          })
          uni.navigateTo({
            url: '/pages/login/login',
          })
          reject(res)
        } else {
          uni.showToast({
            title: (res.data as Data<T>).msg || '请求错误',
            icon: 'none',
          })
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络错误',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}
