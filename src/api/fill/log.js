import request from '@/utils/request'

// 查询填报日志运行态列表
export function listLog(query) {
  return request({
    url: '/fill/instancelog/list',
    method: 'get',
    params: query
  })
}

// 查询填报日志运行态详细
export function getLog(logId) {
  return request({
    url: '/fill/instancelog/' + logId,
    method: 'get'
  })
}

// 新增填报日志运行态
export function addLog(data) {
  return request({
    url: '/fill/instancelog',
    method: 'post',
    data: data
  })
}

// 修改填报日志运行态
export function updateLog(data) {
  return request({
    url: '/fill/instancelog',
    method: 'put',
    data: data
  })
}

// 删除填报日志运行态
export function delLog(logId) {
  return request({
    url: '/fill/instancelog/' + logId,
    method: 'delete'
  })
}
