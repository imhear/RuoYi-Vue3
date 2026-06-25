import request from '@/utils/request'

// 查询外包生产记录2列表
export function listPacking2(query) {
  return request({
    url: '/bottling/packing2/list',
    method: 'get',
    params: query
  })
}

// 查询外包生产记录2详细
export function getPacking2(recordId) {
  return request({
    url: '/bottling/packing2/' + recordId,
    method: 'get'
  })
}

// 新增外包生产记录2
export function addPacking2(data) {
  return request({
    url: '/bottling/packing2',
    method: 'post',
    data: data
  })
}

// 修改外包生产记录2
export function updatePacking2(data) {
  return request({
    url: '/bottling/packing2',
    method: 'put',
    data: data
  })
}

// 删除外包生产记录2
export function delPacking2(recordId) {
  return request({
    url: '/bottling/packing2/' + recordId,
    method: 'delete'
  })
}
