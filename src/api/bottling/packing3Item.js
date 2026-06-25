import request from '@/utils/request'

// 查询外包生产记录3明细列表
export function listPacking3Item(query) {
  return request({
    url: '/bottling/packing3Item/list',
    method: 'get',
    params: query
  })
}

// 查询外包生产记录3明细详细
export function getPacking3Item(itemId) {
  return request({
    url: '/bottling/packing3Item/' + itemId,
    method: 'get'
  })
}

// 新增外包生产记录3明细
export function addPacking3Item(data) {
  return request({
    url: '/bottling/packing3Item',
    method: 'post',
    data: data
  })
}

// 修改外包生产记录3明细
export function updatePacking3Item(data) {
  return request({
    url: '/bottling/packing3Item',
    method: 'put',
    data: data
  })
}

// 删除外包生产记录3明细
export function delPacking3Item(itemId) {
  return request({
    url: '/bottling/packing3Item/' + itemId,
    method: 'delete'
  })
}
