import request from '@/utils/request'

// 查询填报操作运行态列表
export function listInstanceoperation(query) {
  return request({
    url: '/fill/instanceoperation/list',
    method: 'get',
    params: query
  })
}

// 查询填报操作运行态详细
export function getInstanceoperation(instanceOperationId) {
  return request({
    url: '/fill/instanceoperation/' + instanceOperationId,
    method: 'get'
  })
}

// 新增填报操作运行态
export function addInstanceoperation(data) {
  return request({
    url: '/fill/instanceoperation',
    method: 'post',
    data: data
  })
}

// 修改填报操作运行态
export function updateInstanceoperation(data) {
  return request({
    url: '/fill/instanceoperation',
    method: 'put',
    data: data
  })
}

// 删除填报操作运行态
export function delInstanceoperation(instanceOperationId) {
  return request({
    url: '/fill/instanceoperation/' + instanceOperationId,
    method: 'delete'
  })
}
