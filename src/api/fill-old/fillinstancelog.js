import request from '@/utils/request'

// 查询填报实例操作日志列表
export function listFillinstancelog(query) {
  return request({
    url: '/fill/fillinstancelog/list',
    method: 'get',
    params: query
  })
}

// 查询填报实例操作日志详细
export function getFillinstancelog(logId) {
  return request({
    url: '/fill/fillinstancelog/' + logId,
    method: 'get'
  })
}

// 新增填报实例操作日志
export function addFillinstancelog(data) {
  return request({
    url: '/fill/fillinstancelog',
    method: 'post',
    data: data
  })
}

// 修改填报实例操作日志
export function updateFillinstancelog(data) {
  return request({
    url: '/fill/fillinstancelog',
    method: 'put',
    data: data
  })
}

// 删除填报实例操作日志
export function delFillinstancelog(logId) {
  return request({
    url: '/fill/fillinstancelog/' + logId,
    method: 'delete'
  })
}
