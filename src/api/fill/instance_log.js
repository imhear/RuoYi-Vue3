import request from '@/utils/request'

// 查询填报日志列表
export function listInstance_log(query) {
  return request({
    url: '/fill/instance_log/list',
    method: 'get',
    params: query
  })
}

// 查询填报日志详细
export function getInstance_log(logId) {
  return request({
    url: '/fill/instance_log/' + logId,
    method: 'get'
  })
}

// 新增填报日志
export function addInstance_log(data) {
  return request({
    url: '/fill/instance_log',
    method: 'post',
    data: data
  })
}

// 修改填报日志
export function updateInstance_log(data) {
  return request({
    url: '/fill/instance_log',
    method: 'put',
    data: data
  })
}

// 删除填报日志
export function delInstance_log(logId) {
  return request({
    url: '/fill/instance_log/' + logId,
    method: 'delete'
  })
}
