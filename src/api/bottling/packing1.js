import request from '@/utils/request'

// 查询外包生产记录1列表
export function listPacking1(query) {
  return request({
    url: '/bottling/packing1/list',
    method: 'get',
    params: query
  })
}

// 查询外包生产记录1详细
export function getPacking1(recordId) {
  return request({
    url: '/bottling/packing1/' + recordId,
    method: 'get'
  })
}

// 新增外包生产记录1
export function addPacking1(data) {
  return request({
    url: '/bottling/packing1',
    method: 'post',
    data: data
  })
}

// 修改外包生产记录1
export function updatePacking1(data) {
  return request({
    url: '/bottling/packing1',
    method: 'put',
    data: data
  })
}

// 删除外包生产记录1
export function delPacking1(recordId) {
  return request({
    url: '/bottling/packing1/' + recordId,
    method: 'delete'
  })
}
