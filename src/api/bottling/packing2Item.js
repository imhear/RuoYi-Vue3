import request from '@/utils/request'

// 查询外包生产记录2明细列表
export function listPacking2Item(query) {
  return request({
    url: '/bottling/packing2Item/list',
    method: 'get',
    params: query
  })
}

// 查询外包生产记录2明细详细
export function getPacking2Item(itemId) {
  return request({
    url: '/bottling/packing2Item/' + itemId,
    method: 'get'
  })
}

// 新增外包生产记录2明细
export function addPacking2Item(data) {
  return request({
    url: '/bottling/packing2Item',
    method: 'post',
    data: data
  })
}

// 修改外包生产记录2明细
export function updatePacking2Item(data) {
  return request({
    url: '/bottling/packing2Item',
    method: 'put',
    data: data
  })
}

// 删除外包生产记录2明细
export function delPacking2Item(itemId) {
  return request({
    url: '/bottling/packing2Item/' + itemId,
    method: 'delete'
  })
}
