import request from '@/utils/request'

// 查询灌装量行记录列表
export function listFillingSub(query) {
  return request({
    url: '/bottling/fillingSub/list',
    method: 'get',
    params: query
  })
}

// 查询灌装量行记录详细
export function getFillingSub(subId) {
  return request({
    url: '/bottling/fillingSub/' + subId,
    method: 'get'
  })
}

// 新增灌装量行记录
export function addFillingSub(data) {
  return request({
    url: '/bottling/fillingSub',
    method: 'post',
    data: data
  })
}

// 修改灌装量行记录
export function updateFillingSub(data) {
  return request({
    url: '/bottling/fillingSub',
    method: 'put',
    data: data
  })
}

// 删除灌装量行记录
export function delFillingSub(subId) {
  return request({
    url: '/bottling/fillingSub/' + subId,
    method: 'delete'
  })
}
