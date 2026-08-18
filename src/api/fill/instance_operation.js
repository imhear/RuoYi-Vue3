import request from '@/utils/request'

// 查询填报操作运行态列表
export function listInstance_operation(query) {
  return request({
    url: '/fill/instance_operation/list',
    method: 'get',
    params: query
  })
}

// 查询填报操作运行态详细
export function getInstance_operation(instanceOperationId) {
  return request({
    url: '/fill/instance_operation/' + instanceOperationId,
    method: 'get'
  })
}

// 新增填报操作运行态
export function addInstance_operation(data) {
  return request({
    url: '/fill/instance_operation',
    method: 'post',
    data: data
  })
}

// 修改填报操作运行态
export function updateInstance_operation(data) {
  return request({
    url: '/fill/instance_operation',
    method: 'put',
    data: data
  })
}

// 删除填报操作运行态
export function delInstance_operation(instanceOperationId) {
  return request({
    url: '/fill/instance_operation/' + instanceOperationId,
    method: 'delete'
  })
}
