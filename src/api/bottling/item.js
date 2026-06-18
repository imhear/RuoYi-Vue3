import request from '@/utils/request'

// 查询罐包装生产物料计划列表
export function listItem(query) {
  return request({
    url: '/bottling/item/list',
    method: 'get',
    params: query
  })
}

// 查询罐包装生产物料计划详细
export function getItem(bomId) {
  return request({
    url: '/bottling/item/' + bomId,
    method: 'get'
  })
}

// 新增罐包装生产物料计划
export function addItem(data) {
  return request({
    url: '/bottling/item',
    method: 'post',
    data: data
  })
}

// 修改罐包装生产物料计划
export function updateItem(data) {
  return request({
    url: '/bottling/item',
    method: 'put',
    data: data
  })
}

// 删除罐包装生产物料计划
export function delItem(bomId) {
  return request({
    url: '/bottling/item/' + bomId,
    method: 'delete'
  })
}
