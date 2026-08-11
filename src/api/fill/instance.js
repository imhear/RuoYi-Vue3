import request from '@/utils/request'

// 查询填报实例运行态列表
export function listInstance(query) {
  return request({
    url: '/fill/instance/list',
    method: 'get',
    params: query
  })
}

// 查询填报实例运行态详细
export function getInstance(instanceId) {
  return request({
    url: '/fill/instance/' + instanceId,
    method: 'get'
  })
}

// 新增填报实例运行态
export function addInstance(data) {
  return request({
    url: '/fill/instance',
    method: 'post',
    data: data
  })
}

// 修改填报实例运行态
export function updateInstance(data) {
  return request({
    url: '/fill/instance',
    method: 'put',
    data: data
  })
}

// 删除填报实例运行态
export function delInstance(instanceId) {
  return request({
    url: '/fill/instance/' + instanceId,
    method: 'delete'
  })
}
