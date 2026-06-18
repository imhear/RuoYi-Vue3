import request from '@/utils/request'

// 查询退料单明细列表
export function listReturnItem(query) {
  return request({
    url: '/bottling/returnItem/list',
    method: 'get',
    params: query
  })
}

// 查询退料单明细详细
export function getReturnItem(itemId) {
  return request({
    url: '/bottling/returnItem/' + itemId,
    method: 'get'
  })
}

// 新增退料单明细
export function addReturnItem(data) {
  return request({
    url: '/bottling/returnItem',
    method: 'post',
    data: data
  })
}

// 修改退料单明细
export function updateReturnItem(data) {
  return request({
    url: '/bottling/returnItem',
    method: 'put',
    data: data
  })
}

// 删除退料单明细
export function delReturnItem(itemId) {
  return request({
    url: '/bottling/returnItem/' + itemId,
    method: 'delete'
  })
}
