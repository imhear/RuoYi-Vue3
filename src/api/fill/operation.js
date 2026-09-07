import request from '@/utils/request'

// 查询操作码列表
export function listOperation(query) {
  return request({
    url: '/fill/operation/list',
    method: 'get',
    params: query
  })
}

// 查询操作码详细
export function getOperation(operationId) {
  return request({
    url: '/fill/operation/' + operationId,
    method: 'get'
  })
}

// 新增操作码
export function addOperation(data) {
  return request({
    url: '/fill/operation',
    method: 'post',
    data: data
  })
}

// 修改操作码
export function updateOperation(data) {
  return request({
    url: '/fill/operation',
    method: 'put',
    data: data
  })
}

// 删除操作码
export function delOperation(operationId) {
  return request({
    url: '/fill/operation/' + operationId,
    method: 'delete'
  })
}

// 获取操作码下拉树列表
export function treeselect() {
  return request({
    url: '/fill/operation/treeselect',
    method: 'get'
  })
}
