import request from '@/utils/request'

// 查询领料单列表
export function listReceiving(query) {
  return request({
    url: '/bottling/receiving/list',
    method: 'get',
    params: query
  })
}

// 查询领料单详细
export function getReceiving(receivingId) {
  return request({
    url: '/bottling/receiving/' + receivingId,
    method: 'get'
  })
}

// 新增领料单
export function addReceiving(data) {
  return request({
    url: '/bottling/receiving',
    method: 'post',
    data: data
  })
}

// 修改领料单
export function updateReceiving(data) {
  return request({
    url: '/bottling/receiving',
    method: 'put',
    data: data
  })
}

// 删除领料单
export function delReceiving(receivingId) {
  return request({
    url: '/bottling/receiving/' + receivingId,
    method: 'delete'
  })
}

// ========== 手工新增方法 ==========

// 领料提交（更新主表领用人/日期 + 子表明细）
export function receiveReceiving(receivingId, data) {
  return request({
    url: '/bottling/receiving/receive/' + receivingId,
    method: 'put',
    data: data
  })
}

// 复核领料单
export function reviewReceiving(receivingId) {
  return request({
    url: '/bottling/receiving/review/' + receivingId,
    method: 'put'
  })
}