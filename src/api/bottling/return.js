import request from '@/utils/request'

// 查询退料单列表
export function listReturn(query) {
  return request({
    url: '/bottling/return/list',
    method: 'get',
    params: query
  })
}

// 查询退料单详细
export function getReturn(returnId) {
  return request({
    url: '/bottling/return/' + returnId,
    method: 'get'
  })
}

// 新增退料单
export function addReturn(data) {
  return request({
    url: '/bottling/return',
    method: 'post',
    data: data
  })
}

// 修改退料单
export function updateReturn(data) {
  return request({
    url: '/bottling/return',
    method: 'put',
    data: data
  })
}

// 删除退料单
export function delReturn(returnId) {
  return request({
    url: '/bottling/return/' + returnId,
    method: 'delete'
  })
}
