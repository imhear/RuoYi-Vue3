import request from '@/utils/request'

// 查询客户列表
export function listCustomer(query) {
  return request({
    url: '/system/customer/list',
    method: 'get',
    params: query
  })
}

// 查询客户详细
export function getCustomer(customerId) {
  return request({
    url: '/system/customer/' + customerId,
    method: 'get'
  })
}

// 新增客户
export function addCustomer(data) {
  return request({
    url: '/system/customer',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateCustomer(data) {
  return request({
    url: '/system/customer',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delCustomer(customerId) {
  return request({
    url: '/system/customer/' + customerId,
    method: 'delete'
  })
}

// 新增：更新单条商品信息（子表1）
export function updateSysGoods(data) {
  return request({
    url: '/system/customer/goods',
    method: 'put',
    data: data
  })
}

// 新增：更新单条商品信息（子表2）
export function updateSysGoods2(data) {
  return request({
    url: '/system/customer/goods2',
    method: 'put',
    data: data
  })
}

// 获取商品详情（含孙表历史价格）
export function getSysGoods(goodsId) {
  return request({
    url: '/system/customer/goods/' + goodsId,
    method: 'get'
  })
}

// 更新商品详情（含孙表数据）
export function updateSysGoodsDetail(data) {
  return request({
    url: '/system/customer/goods/detail',
    method: 'put',
    data: data
  })
}

// 新增一条商品空记录（用于主表编辑界面增加子表）
export function createEmptyGoods(customerId) {
  return request({
    url: '/system/customer/goods/createEmpty/' + customerId,
    method: 'post'
  })
}

// 删除单条商品记录
export function delSysGoods(goodsId) {
  return request({
    url: '/system/customer/goods/' + goodsId,
    method: 'delete'
  })
}

// 获取灌装记录（主表+子表）—— 接口后端暂未实现，先用占位
export function getFillingRecords(goodsId) {
  return request({
    url: '/system/customer/goods/filling/' + goodsId,
    method: 'get'
  })
}

// 更新灌装记录（主表+子表）—— 接口后端暂未实现，先用占位
export function updateFillingRecords(data) {
  return request({
    url: '/system/customer/goods/filling',
    method: 'put',
    data: data
  })
}

// 独立保存灌装量记录（主表+子表）
export function saveFillingMain(mainId, data) {
  return request({
    url: '/system/customer/goods/filling/main/' + mainId,
    method: 'put',
    data: data
  })
}

// 复核灌装记录
export function reviewFillingMain(mainId) {
  return request({
    url: '/system/customer/goods/filling/main/' + mainId + '/review',
    method: 'put'
  })
}

// 检查灌装记录
export function inspectFillingMain(mainId) {
  return request({
    url: '/system/customer/goods/filling/main/' + mainId + '/inspect',
    method: 'put'
  })
}

// 设置灌装开始时间（首次填写，联动更新取样日期）
export function setFillingStartTime(goodsId, data) {
  return request({
    url: '/system/customer/goods/filling/startTime/' + goodsId,
    method: 'put',
    data: data
  })
}