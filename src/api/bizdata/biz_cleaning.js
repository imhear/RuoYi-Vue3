import request from '@/utils/request'

// 查询清场记录列表
export function listBizCleaning(query) {
  return request({
    url: '/bizdata/biz_cleaning/list',
    method: 'get',
    params: query
  })
}

// 查询清场记录详细
export function getBizCleaning(cleaningId) {
  return request({
    url: '/bizdata/biz_cleaning/' + cleaningId,
    method: 'get'
  })
}

// 新增清场记录
export function addBizCleaning(data) {
  return request({
    url: '/bizdata/biz_cleaning',
    method: 'post',
    data: data
  })
}

// 修改清场记录
export function updateBizCleaning(data) {
  return request({
    url: '/bizdata/biz_cleaning',
    method: 'put',
    data: data
  })
}

// 删除清场记录
export function delBizCleaning(cleaningId) {
  return request({
    url: '/bizdata/biz_cleaning/' + cleaningId,
    method: 'delete'
  })
}

/**
 * 查询清场记录详情（Form.vue 调用，与 packaging_2 命名对齐）
 * 注：清场无子表，语义等价于 getBizCleaning
 * @param {Number} cleaningId 业务主表主键
 */
export function getBizCleaningDetail(cleaningId) {
  return request({
    url: '/bizdata/biz_cleaning/detail/' + cleaningId,
    method: 'get'
  })
}

/**
 * 保存清场记录编辑（单主表，无子表）
 * @param {Number} cleaningId 业务主表主键
 * @param {Number} menuId 按钮节点 ID（用于日志写入）
 * @param {Object} data 记录数据
 */
export function editBizCleaning(cleaningId, menuId, data) {
  return request({
    url: '/bizdata/biz_cleaning/edit/' + cleaningId,
    method: 'post',
    params: { menuId: menuId },
    data: data
  })
}