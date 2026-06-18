import request from '@/utils/request'

// 查询外包生产记录1明细列表
export function listPacking1Item(query) {
  return request({
    url: '/bottling/packing1Item/list',
    method: 'get',
    params: query
  })
}

// 查询外包生产记录1明细详细
export function getPacking1Item(itemId) {
  return request({
    url: '/bottling/packing1Item/' + itemId,
    method: 'get'
  })
}

// 新增外包生产记录1明细
export function addPacking1Item(data) {
  return request({
    url: '/bottling/packing1Item',
    method: 'post',
    data: data
  })
}

// 修改外包生产记录1明细
export function updatePacking1Item(data) {
  return request({
    url: '/bottling/packing1Item',
    method: 'put',
    data: data
  })
}

// 删除外包生产记录1明细
export function delPacking1Item(itemId) {
  return request({
    url: '/bottling/packing1Item/' + itemId,
    method: 'delete'
  })
}
