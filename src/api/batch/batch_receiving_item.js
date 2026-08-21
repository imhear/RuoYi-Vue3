import request from '@/utils/request'

// 查询领料单子表列表
export function listBatch_receiving_item(query) {
  return request({
    url: '/batch/batch_receiving_item/list',
    method: 'get',
    params: query
  })
}

// 查询领料单子表详细
export function getBatch_receiving_item(itemId) {
  return request({
    url: '/batch/batch_receiving_item/' + itemId,
    method: 'get'
  })
}

// 新增领料单子表
export function addBatch_receiving_item(data) {
  return request({
    url: '/batch/batch_receiving_item',
    method: 'post',
    data: data
  })
}

// 修改领料单子表
export function updateBatch_receiving_item(data) {
  return request({
    url: '/batch/batch_receiving_item',
    method: 'put',
    data: data
  })
}

// 删除领料单子表
export function delBatch_receiving_item(itemId) {
  return request({
    url: '/batch/batch_receiving_item/' + itemId,
    method: 'delete'
  })
}
