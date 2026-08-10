import request from '@/utils/request'

// 查询填报实例（运行态）列表
export function listFillinstance(query) {
  return request({
    url: '/fill/fillinstance/list',
    method: 'get',
    params: query
  })
}

// 查询填报实例（运行态）详细
export function getFillinstance(instanceId) {
  return request({
    url: '/fill/fillinstance/' + instanceId,
    method: 'get'
  })
}

// 新增填报实例（运行态）
export function addFillinstance(data) {
  return request({
    url: '/fill/fillinstance',
    method: 'post',
    data: data
  })
}

// 修改填报实例（运行态）
export function updateFillinstance(data) {
  return request({
    url: '/fill/fillinstance',
    method: 'put',
    data: data
  })
}

// 删除填报实例（运行态）
export function delFillinstance(instanceId) {
  return request({
    url: '/fill/fillinstance/' + instanceId,
    method: 'delete'
  })
}
