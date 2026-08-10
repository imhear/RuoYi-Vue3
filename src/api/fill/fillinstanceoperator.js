import request from '@/utils/request'

// 查询填报实例操作人（运行态，记录操作人和操作时间）列表
export function listFillinstanceoperator(query) {
  return request({
    url: '/fill/fillinstanceoperator/list',
    method: 'get',
    params: query
  })
}

// 查询填报实例操作人（运行态，记录操作人和操作时间）详细
export function getFillinstanceoperator(instanceOperatorId) {
  return request({
    url: '/fill/fillinstanceoperator/' + instanceOperatorId,
    method: 'get'
  })
}

// 新增填报实例操作人（运行态，记录操作人和操作时间）
export function addFillinstanceoperator(data) {
  return request({
    url: '/fill/fillinstanceoperator',
    method: 'post',
    data: data
  })
}

// 修改填报实例操作人（运行态，记录操作人和操作时间）
export function updateFillinstanceoperator(data) {
  return request({
    url: '/fill/fillinstanceoperator',
    method: 'put',
    data: data
  })
}

// 删除填报实例操作人（运行态，记录操作人和操作时间）
export function delFillinstanceoperator(instanceOperatorId) {
  return request({
    url: '/fill/fillinstanceoperator/' + instanceOperatorId,
    method: 'delete'
  })
}
