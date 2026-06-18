import request from '@/utils/request'

// 查询外包生产记录3列表
export function listPacking3(query) {
  return request({
    url: '/bottling/packing3/list',
    method: 'get',
    params: query
  })
}

// 查询外包生产记录3详细
export function getPacking3(recordId) {
  return request({
    url: '/bottling/packing3/' + recordId,
    method: 'get'
  })
}

// 新增外包生产记录3
export function addPacking3(data) {
  return request({
    url: '/bottling/packing3',
    method: 'post',
    data: data
  })
}

// 修改外包生产记录3
export function updatePacking3(data) {
  return request({
    url: '/bottling/packing3',
    method: 'put',
    data: data
  })
}

// 删除外包生产记录3
export function delPacking3(recordId) {
  return request({
    url: '/bottling/packing3/' + recordId,
    method: 'delete'
  })
}
