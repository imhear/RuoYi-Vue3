import request from '@/utils/request'

// 查询退料单列表
export function listBizReturn(query) {
  return request({
    url: '/bizdata/biz_return/list',
    method: 'get',
    params: query
  })
}

// 查询退料单详细
export function getBizReturn(recordId) {
  return request({
    url: '/bizdata/biz_return/' + recordId,
    method: 'get'
  })
}

// 新增退料单
export function addBizReturn(data) {
  return request({
    url: '/bizdata/biz_return',
    method: 'post',
    data: data
  })
}

// 修改退料单
export function updateBizReturn(data) {
  return request({
    url: '/bizdata/biz_return',
    method: 'put',
    data: data
  })
}

// 删除退料单
export function delBizReturn(recordId) {
  return request({
    url: '/bizdata/biz_return/' + recordId,
    method: 'delete'
  })
}

/**
 * 查询退料单详情（含子表）
 */
export function getBizRetrunDetail(recordId) {
  return request({
    url: '/bizdata/biz_return/detail/' + recordId,
    method: 'get'
  })
}

/**
 * 保存退料单编辑（更新主表 + 替换子表）
 */
export function updateBizRetrun(recordId, menuId, data) {
  return request({
    url: '/bizdata/biz_return/edit/' + recordId,
    method: 'post',
    params: { menuId: menuId },
    data: data
  })
}

/**
 * 从消毒/灌装车间领料单同步物料数据
 * @param {Number} recordId 业务主表主键
 * @param {String} workshop 领料单所属车间
 */
export function syncMaterialFromReceiving(recordId, workshop) {
  return request({
    url: '/bizdata/biz_return/syncMaterialFromReceiving/' + recordId,
    method: 'post',
    params: { workshop: workshop }
  })
}