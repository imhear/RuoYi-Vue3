import request from '@/utils/request'

// 查询生产指令单列表
export function listBatch_order(query) {
  return request({
    url: '/batch/batch_order/list',
    method: 'get',
    params: query
  })
}

// 查询生产指令单详细
export function getBatch_order(orderId) {
  return request({
    url: '/batch/batch_order/' + orderId,
    method: 'get'
  })
}

// 新增生产指令单
export function addBatch_order(data) {
  return request({
    url: '/batch/batch_order',
    method: 'post',
    data: data
  })
}

// 修改生产指令单
export function updateBatch_order(data) {
  return request({
    url: '/batch/batch_order',
    method: 'put',
    data: data
  })
}

// 删除生产指令单
export function delBatch_order(orderId) {
  return request({
    url: '/batch/batch_order/' + orderId,
    method: 'delete'
  })
}

// 查询工单详情（含BOM）
export function getBatchOrderDetail(orderId) {
  return request({
    url: '/batch/batch_order/detail/' + orderId,
    method: 'get'
  })
}
