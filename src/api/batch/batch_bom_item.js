import request from '@/utils/request'

// 查询物料计划列表
export function listBatch_bom_item(query) {
  return request({
    url: '/batch/batch_bom_item/list',
    method: 'get',
    params: query
  })
}

// 查询物料计划详细
export function getBatch_bom_item(bomId) {
  return request({
    url: '/batch/batch_bom_item/' + bomId,
    method: 'get'
  })
}

// 新增物料计划
export function addBatch_bom_item(data) {
  return request({
    url: '/batch/batch_bom_item',
    method: 'post',
    data: data
  })
}

// 修改物料计划
export function updateBatch_bom_item(data) {
  return request({
    url: '/batch/batch_bom_item',
    method: 'put',
    data: data
  })
}

// 删除物料计划
export function delBatch_bom_item(bomId) {
  return request({
    url: '/batch/batch_bom_item/' + bomId,
    method: 'delete'
  })
}
