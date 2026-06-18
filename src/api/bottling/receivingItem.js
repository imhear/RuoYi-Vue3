import request from '@/utils/request'

// 查询领料单明细列表
export function listReceivingItem(query) {
  return request({
    url: '/bottling/receivingItem/list',
    method: 'get',
    params: query
  })
}

// 查询领料单明细详细
export function getReceivingItem(itemId) {
  return request({
    url: '/bottling/receivingItem/' + itemId,
    method: 'get'
  })
}

// 新增领料单明细
export function addReceivingItem(data) {
  return request({
    url: '/bottling/receivingItem',
    method: 'post',
    data: data
  })
}

// 修改领料单明细
export function updateReceivingItem(data) {
  return request({
    url: '/bottling/receivingItem',
    method: 'put',
    data: data
  })
}

// 删除领料单明细
export function delReceivingItem(itemId) {
  return request({
    url: '/bottling/receivingItem/' + itemId,
    method: 'delete'
  })
}
