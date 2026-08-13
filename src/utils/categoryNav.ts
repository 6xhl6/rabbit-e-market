// 标记本次进入分类页是否来自首页（有明确的分类目标）。
// switchTab 无法携带参数，首页在跳转前写入 storage 并置位该标志，
// 分类页据此区分「首页指定跳转」与「tabbar 直接进入」两种入口。
let isFromHome = false

/** 首页跳转前调用，标记本次进入分类页需要定位到指定分类 */
export const markCategoryNavFromHome = () => {
  isFromHome = true
}

/** 分类页读取并消费标志，返回是否来自首页 */
export const consumeCategoryNavFromHome = () => {
  const flag = isFromHome
  isFromHome = false
  return flag
}
