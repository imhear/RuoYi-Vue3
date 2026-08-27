import request from '@/utils/request'

// 查询领料单列表
export function listBatch_receiving(query) {
  return request({
    url: '/batch/batch_receiving/list',
    method: 'get',
    params: query
  })
}

// 查询领料单详细
export function getBatch_receiving(receivingId) {
  return request({
    url: '/batch/batch_receiving/' + receivingId,
    method: 'get'
  })
}

// 新增领料单
export function addBatch_receiving(data) {
  return request({
    url: '/batch/batch_receiving',
    method: 'post',
    data: data
  })
}

// 修改领料单
export function updateBatch_receiving(data) {
  return request({
    url: '/batch/batch_receiving',
    method: 'put',
    data: data
  })
}

// 删除领料单
export function delBatch_receiving(receivingId) {
  return request({
    url: '/batch/batch_receiving/' + receivingId,
    method: 'delete'
  })
}

/**
 * 查询领料单详情（含子表）
 * @param {Number} receivingId 领料单主键
 */
export function getBatchReceivingDetail(receivingId) {
  return request({
    url: '/batch/batch_receiving/detail/' + receivingId,
    method: 'get'
  })
}

/**
 * 保存领料单编辑（更新主表 + 替换子表）
 * @param {Number} receivingId 领料单主键
 * @param {Object} data 领料单数据（含 itemList）
 */
export function updateBatchReceiving(receivingId, data) {
  return request({
    url: '/batch/batch_receiving/edit/' + receivingId,
    method: 'put',
    data: data
  })
}