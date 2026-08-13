<script setup lang="ts">
import { getSearchResultService, getSearchTipsService } from '@/services/search'
import type { Conditions, PageData, SearchTipsItem } from '@/types/search'
import { onUnload } from '@dcloudio/uni-app'
import { ref, watch } from 'vue'

// ------- 导航栏尺寸（对齐微信原生胶囊按钮） -------
// 顶部安全区距离、状态栏高度、屏幕宽度
const { statusBarHeight, windowWidth, safeAreaInsets } = uni.getSystemInfoSync()
// 胶囊按钮位置（仅微信小程序存在）
let menuButtonInfo: UniApp.GetMenuButtonBoundingClientRectRes | null = null
// #ifdef MP-WEIXIN
try {
  menuButtonInfo = uni.getMenuButtonBoundingClientRect()
} catch (error) {
  console.log(error)
}
// #endif
// 导航栏（状态栏下方）内容区高度：与胶囊按钮垂直居中对齐
const navHeight = menuButtonInfo
  ? (menuButtonInfo.top - (statusBarHeight ?? 20)) * 2 + menuButtonInfo.height
  : 44
// 右侧给胶囊按钮留出的宽度，避免"搜索"按钮与之重叠
const navRight = menuButtonInfo ? windowWidth - menuButtonInfo.left + 10 : 0

// 输入框实时内容
const keyword = ref('')
// 已提交搜索的关键词（进入结果页后固定）
const searchKeyword = ref('')
// 是否已进入结果页
const searched = ref(false)

// 联想词 防抖请求处理
// 本地兜底联想词库：后端联想接口无数据时使用
const TIPS_LIB = [
  '苹果',
  '苹果手机',
  '苹果电脑',
  '手机',
  '手机壳',
  '蓝牙耳机',
  '耳机',
  '平板电脑',
  '笔记本电脑',
  '洗衣机',
  '冰箱',
  '空调',
  '电饭煲',
  '热水壶',
  '电视机',
  '吹风机',
  '扫地机器人',
  '空气净化器',
  '保温杯',
  '水杯',
  '茶叶',
  '咖啡',
  '牛奶',
  '酸奶',
  '果汁',
  '矿泉水',
  '饮料',
  '坚果',
  '饼干',
  '巧克力',
  '薯片',
  '零食',
  '零食大礼包',
  '连衣裙',
  'T恤',
  '衬衫',
  '卫衣',
  '外套',
  '羽绒服',
  '牛仔裤',
  '运动鞋',
  '帆布鞋',
  '凉鞋',
  '面膜',
  '洗面奶',
  '面霜',
  '精华液',
  '口红',
  '香水',
  '防晒霜',
  '洗发水',
  '护发素',
  '洗衣液',
  '纸巾',
  '湿巾',
  '毛巾',
  '雨伞',
  '行李箱',
  '双肩包',
  '文具',
  '玩具',
  '积木',
  '奶粉',
  '纸尿裤',
  '猫粮',
  '狗粮',
  '瑜伽垫',
  '哑铃',
  '篮球',
  '健身服',
]
const tips = ref<SearchTipsItem[]>([])
let tipsTimer: ReturnType<typeof setTimeout> | null = null
watch(keyword, (val) => {
  // 结果页内不再联想
  if (searched.value) return
  if (tipsTimer) clearTimeout(tipsTimer)
  if (!val.trim()) {
    tips.value = []
    return
  }
  tipsTimer = setTimeout(async () => {
    const kw = val.trim()
    try {
      const res = await getSearchTipsService(kw)
      tips.value = res.result
    } catch (error) {
      console.log(error)
      tips.value = []
    }
    // 后端无联想数据时，用本地词库 + 搜索历史做兜底
    if (!tips.value.length) {
      const libHit = TIPS_LIB.filter((item) => item.includes(kw))
      const historyHit = history.value.filter((item) => item.includes(kw))
      const merged = [...new Set([...libHit, ...historyHit])]
      tips.value = merged.map((item) => ({ associatedWord: item, ids: [] }))
      // 词库也无匹配时，回显关键词本身，保证联想列表始终出现
      if (!tips.value.length) {
        tips.value = [{ associatedWord: kw, ids: [] }]
      }
    }
  }, 300)
})

// 搜索历史
const HISTORY_KEY = 'search-history'
const history = ref<string[]>([])
const loadHistory = () => {
  history.value = (uni.getStorageSync(HISTORY_KEY) as string[]) || []
}
const saveHistory = () => {
  uni.setStorageSync(HISTORY_KEY, history.value)
}
const addHistory = (word: string) => {
  const list = history.value.filter((item) => item !== word)
  list.unshift(word)
  history.value = list.slice(0, 10)
  saveHistory()
}
const clearHistory = () => {
  history.value = []
  uni.removeStorageSync(HISTORY_KEY)
}
loadHistory()

// 筛选条件
const conditions = ref<Conditions>()
const sortField = ref('') // ''综合 | orderNum销量 | price价格 | publishTime最新
const sortMethod = ref('desc') // asc升序 | desc降序（价格）
const onlyDiscount = ref(false)
const brandId = ref('')
const categoryId = ref('')
// 品牌/分类 筛选弹层
const showFilter = ref(false)
// 排序项
const sortOptions = [
  { field: '', text: '综合' },
  { field: 'orderNum', text: '销量' },
  { field: 'price', text: '价格' },
  { field: 'publishTime', text: '最新' },
]
const onSort = (field: string) => {
  if (field === sortField.value) {
    // 再次点击"价格"切换升降序
    if (field === 'price') {
      sortMethod.value = sortMethod.value === 'desc' ? 'asc' : 'desc'
      searchGoods(true)
    }
    return
  }
  sortField.value = field
  sortMethod.value = 'desc'
  searchGoods(true)
}
const onToggleDiscount = () => {
  onlyDiscount.value = !onlyDiscount.value
  searchGoods(true)
}
const onSelectBrand = (id: string) => {
  brandId.value = brandId.value === id ? '' : id
  showFilter.value = false
  searchGoods(true)
}
const onSelectCategory = (id: string) => {
  categoryId.value = categoryId.value === id ? '' : id
  showFilter.value = false
  searchGoods(true)
}

// ------- 分页数据 -------
const pageData = ref<PageData>()
const isLoading = ref(false)
const isFinish = ref(false)

// 搜索商品
const searchGoods = async (reset = true) => {
  if (isLoading.value) return
  if (!reset && isFinish.value) return
  if (reset) {
    pageData.value = undefined
    isFinish.value = false
  }
  const page = reset ? 1 : (pageData.value?.page ?? 0) + 1
  isLoading.value = true
  try {
    const res = await getSearchResultService({
      page,
      pageSize: 10,
      keyword: searchKeyword.value,
      brandId: brandId.value || undefined,
      categoryId: categoryId.value || undefined,
      onlyDiscount: onlyDiscount.value,
      sortField: sortField.value || undefined,
      sortMethod: sortField.value === 'price' ? sortMethod.value : 'desc',
    })
    conditions.value = res.result.conditions
    if (reset) {
      pageData.value = res.result.pageData
    } else {
      pageData.value = {
        ...res.result.pageData,
        items: [...(pageData.value?.items ?? []), ...res.result.pageData.items],
      }
    }
    if (pageData.value.page >= pageData.value.pages) {
      isFinish.value = true
    }
  } catch (error) {
    console.log(error)
  }
  isLoading.value = false
}

// ------- 提交搜索 / 点击联想词 / 历史 -------
const onSearch = () => {
  const word = keyword.value.trim()
  if (!word) return
  addHistory(word)
  searchKeyword.value = word
  searched.value = true
  tips.value = []
  // 重置筛选条件
  sortField.value = ''
  sortMethod.value = 'desc'
  onlyDiscount.value = false
  brandId.value = ''
  categoryId.value = ''
  searchGoods(true)
}
const onTipsItem = (word: string) => {
  keyword.value = word
  onSearch()
}
const onHistory = (word: string) => {
  keyword.value = word
  onSearch()
}

// ------- 返回 -------
const onBack = () => {
  if (searched.value) {
    // 结果页返回输入态
    searched.value = false
    keyword.value = ''
    searchKeyword.value = ''
  } else {
    uni.navigateBack()
  }
}

// 触底加载更多
const loadMore = () => {
  if (!searched.value || isLoading.value || isFinish.value) return
  searchGoods(false)
}

// 页面卸载清理防抖定时器
onUnload(() => {
  if (tipsTimer) clearTimeout(tipsTimer)
})
</script>

<template>
  <view class="viewport">
    <!-- 顶部搜索栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <view class="nav-inner" :style="{ height: navHeight + 'px', paddingRight: navRight + 'px' }">
        <view class="back" @tap="onBack">
          <view class="back-arrow"></view>
        </view>
        <view class="search-box">
          <text class="icon-search"></text>
          <input
            v-model="keyword"
            class="input"
            type="text"
            placeholder="搜索商品"
            placeholder-class="placeholder"
            confirm-type="search"
            focus
            @confirm="onSearch"
          />
          <text class="icon-clear" v-if="keyword" @tap="keyword = ''"></text>
        </view>
      </view>
    </view>

    <!-- 搜索前：搜索历史 -->
    <scroll-view class="history" scroll-y v-if="!searched && !keyword.trim()">
      <view class="history-card" v-if="history.length">
        <view class="head">
          <text class="title">搜索历史</text>
          <text class="clear" @tap="clearHistory">清空</text>
        </view>
        <view class="tags">
          <text class="tag" v-for="(item, index) in history" :key="index" @tap="onHistory(item)">
            {{ item }}
          </text>
        </view>
      </view>
      <view class="empty" v-else>
        <text class="empty-icon"></text>
        <text class="empty-text">输入关键词，发现好物</text>
      </view>
    </scroll-view>

    <!-- 输入中：联想词 -->
    <scroll-view class="tips" scroll-y v-else-if="keyword.trim() && !searched">
      <view
        class="tip-item"
        v-for="(item, index) in tips"
        :key="index"
        @tap="onTipsItem(item.associatedWord)"
      >
        <text class="icon-search"></text>
        <text class="word">{{ item.associatedWord }}</text>
      </view>
      <view class="tips-empty" v-if="!tips.length">回车键搜索"{{ keyword }}"</view>
    </scroll-view>

    <!-- 搜索结果 -->
    <view class="result" v-else-if="searched">
      <!-- 筛选排序条 -->
      <view class="filter-bar">
        <view
          class="sort-item"
          v-for="opt in sortOptions"
          :key="opt.field"
          :class="{ active: sortField === opt.field }"
          @tap="onSort(opt.field)"
        >
          <text class="text">{{ opt.text }}</text>
          <view class="price-arrow" v-if="opt.field === 'price'">
            <view
              class="tri up"
              :class="{ active: sortField === 'price' && sortMethod === 'asc' }"
            ></view>
            <view
              class="tri down"
              :class="{ active: sortField === 'price' && sortMethod === 'desc' }"
            >
            </view>
          </view>
        </view>
        <view class="sort-item discount" :class="{ active: onlyDiscount }" @tap="onToggleDiscount">
          特惠
        </view>
        <view
          class="sort-item filter"
          :class="{ active: showFilter }"
          @tap="showFilter = !showFilter"
        >
          筛选
        </view>
      </view>

      <!-- 商品列表 -->
      <scroll-view class="goods-list" scroll-y @scrolltolower="loadMore">
        <view class="goods-grid">
          <navigator
            class="goods-card"
            v-for="item in pageData?.items"
            :key="item.id"
            :url="`/pages/goods/goods?id=${item.id}`"
            hover-class="none"
          >
            <image class="picture" :src="item.picture" mode="aspectFill"></image>
            <view class="info">
              <view class="name">{{ item.name }}</view>
              <view class="desc ellipsis">{{ item.desc }}</view>
              <view class="price">
                <text class="symbol">¥</text>
                <text class="num">{{ item.price }}</text>
              </view>
            </view>
          </navigator>
        </view>
        <view class="loading-text" v-if="pageData?.items?.length">
          {{ isLoading ? '加载中...' : isFinish ? '没有更多商品了' : '上拉加载更多' }}
        </view>
        <view class="empty" v-if="!isLoading && pageData && !pageData.items.length">
          <text class="empty-icon"></text>
          <text class="empty-text">未找到相关商品，换个词试试</text>
        </view>
      </scroll-view>
    </view>

    <!-- 品牌/分类筛选弹层 -->
    <view class="filter-mask" v-if="showFilter" @tap="showFilter = false"></view>
    <view class="filter-panel" v-if="showFilter">
      <view class="group" v-if="conditions?.brands?.length">
        <view class="group-title">品牌</view>
        <view class="chips">
          <text
            class="chip"
            :class="{ active: brandId === item.id }"
            v-for="item in conditions.brands"
            :key="item.id"
            @tap="onSelectBrand(item.id)"
          >
            {{ item.name }}
          </text>
        </view>
      </view>
      <view class="group" v-if="conditions?.categories?.length">
        <view class="group-title">分类</view>
        <view class="chips">
          <text
            class="chip"
            :class="{ active: categoryId === item.id }"
            v-for="item in conditions.categories"
            :key="item.id"
            @tap="onSelectCategory(item.id)"
          >
            {{ item.name }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
}

/* ---------- 顶部搜索栏 ---------- */
.navbar {
  background: linear-gradient(135deg, #16a98a 0%, #27ba9b 55%, #46cbb0 100%);
  padding-bottom: 20rpx;
  box-shadow: 0 6rpx 24rpx rgba(39, 186, 155, 0.35);

  .nav-inner {
    display: flex;
    align-items: center;
    height: 88rpx;
    padding: 0 20rpx;
  }

  .back {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60rpx;
    height: 60rpx;

    .back-arrow {
      width: 20rpx;
      height: 20rpx;
      border-left: 4rpx solid #fff;
      border-bottom: 4rpx solid #fff;
      transform: rotate(45deg);
    }
  }

  .search-box {
    flex: 1;
    display: flex;
    align-items: center;
    height: 64rpx;
    padding: 0 24rpx;
    margin-left: 10rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 32rpx;
    transition: box-shadow 0.2s;

    .icon-search {
      margin-right: 12rpx;
      color: #27ba9b;
    }

    .input {
      flex: 1;
      height: 100%;
      font-size: 26rpx;
      color: #333;
    }

    .placeholder {
      color: #bbb;
    }

    .icon-clear {
      padding: 10rpx;
      color: #ccc;
    }
  }

  .search-btn {
    margin-left: 24rpx;
    font-size: 28rpx;
    color: #fff;
    letter-spacing: 2rpx;
  }
}

/* ---------- 搜索历史 ---------- */
.history {
  flex: 1;

  .history-card {
    padding: 24rpx 24rpx 0;

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28rpx;

      .title {
        font-size: 30rpx;
        font-weight: 600;
        color: #262626;
      }

      .clear {
        font-size: 24rpx;
        color: #999;
      }
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
    }

    .tag {
      padding: 12rpx 32rpx;
      margin: 0 20rpx 20rpx 0;
      font-size: 26rpx;
      color: #555;
      background: #fff;
      border-radius: 32rpx;
      box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.04);
    }
  }
}

/* ---------- 联想词 ---------- */
.tips {
  flex: 1;
  background: #fff;

  .tip-item {
    display: flex;
    align-items: center;
    padding: 26rpx 30rpx;
    border-bottom: 1rpx solid #f5f5f5;

    .icon-search {
      margin-right: 20rpx;
      color: #bbb;
    }

    .word {
      font-size: 28rpx;
      color: #333;
    }

    &:active {
      background: #f7f8fa;
    }
  }

  .tips-empty {
    padding: 40rpx;
    text-align: center;
    font-size: 26rpx;
    color: #bbb;
  }
}

/* ---------- 搜索结果 ---------- */
.result {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.filter-bar {
  display: flex;
  align-items: center;
  padding: 0 10rpx;
  background: #fff;
  border-bottom: 1rpx solid #f0f0f0;

  .sort-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80rpx;
    font-size: 26rpx;
    color: #555;

    &.active {
      color: #27ba9b;
      font-weight: 600;
    }

    &.discount,
    &.filter {
      flex: none;
      padding: 0 20rpx;
    }
  }

  .price-arrow {
    display: flex;
    flex-direction: column;
    margin-left: 6rpx;

    .tri {
      width: 0;
      height: 0;
      border-left: 8rpx solid transparent;
      border-right: 8rpx solid transparent;

      &.up {
        margin-bottom: 4rpx;
        border-bottom: 10rpx solid #ccc;

        &.active {
          border-bottom-color: #27ba9b;
        }
      }

      &.down {
        border-top: 10rpx solid #ccc;

        &.active {
          border-top-color: #27ba9b;
        }
      }
    }
  }
}

.goods-list {
  flex: 1;

  .goods-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 20rpx 20rpx 0;
  }

  .goods-card {
    width: 344rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    background: #fff;
    border-radius: 20rpx;
    box-shadow: 0 8rpx 28rpx rgba(39, 186, 155, 0.08);

    .picture {
      display: block;
      width: 100%;
      height: 344rpx;
      background: #f7f8fa;
    }

    .info {
      padding: 16rpx 20rpx 20rpx;
    }

    .name {
      height: 72rpx;
      font-size: 26rpx;
      line-height: 1.4;
      color: #262626;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .desc {
      margin-top: 6rpx;
      font-size: 22rpx;
      color: #999;
    }

    .price {
      margin-top: 12rpx;
      color: #27ba9b;

      .symbol {
        font-size: 22rpx;
      }

      .num {
        font-size: 34rpx;
        font-weight: 700;
      }
    }
  }

  .loading-text {
    padding: 20rpx 0 40rpx;
    text-align: center;
    font-size: 24rpx;
    color: #999;
  }
}

/* ---------- 空状态 ---------- */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;

  .empty-icon {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #b7ebdf, #e6f7f2);
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 38rpx;
      width: 34rpx;
      height: 34rpx;
      margin-left: -17rpx;
      border: 4rpx solid #27ba9b;
      border-radius: 50%;
    }

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 76rpx;
      width: 24rpx;
      height: 4rpx;
      margin-left: -8rpx;
      background: #27ba9b;
      transform: rotate(45deg);
    }
  }

  .empty-text {
    margin-top: 24rpx;
    font-size: 26rpx;
    color: #999;
  }
}

/* ---------- 筛选弹层 ---------- */
.filter-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background: rgba(0, 0, 0, 0.4);
}

.filter-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  padding: 30rpx 30rpx calc(40rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-radius: 30rpx 30rpx 0 0;
  box-shadow: 0 -10rpx 40rpx rgba(0, 0, 0, 0.08);

  .group {
    margin-bottom: 30rpx;

    .group-title {
      margin-bottom: 20rpx;
      font-size: 28rpx;
      font-weight: 600;
      color: #262626;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
    }

    .chip {
      padding: 12rpx 30rpx;
      margin: 0 20rpx 20rpx 0;
      font-size: 26rpx;
      color: #555;
      background: #f7f8fa;
      border-radius: 32rpx;
      border: 1rpx solid transparent;

      &.active {
        color: #27ba9b;
        background: rgba(39, 186, 155, 0.08);
        border-color: #27ba9b;
      }
    }
  }
}
</style>
