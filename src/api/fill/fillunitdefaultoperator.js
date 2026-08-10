import request from '@/utils/request'

// 查询填报单元默认操作人列表
export function listFillunitdefaultoperator(query) {
  return request({
    url: '/fill/fillunitdefaultoperator/list',
    method: 'get',
    params: query
  })
}

// 查询填报单元默认操作人详细
export function getFillunitdefaultoperator(unitOperatorId) {
  return request({
    url: '/fill/fillunitdefaultoperator/' + unitOperatorId,
    method: 'get'
  })
}

// 新增填报单元默认操作人
export function addFillunitdefaultoperator(data) {
  return request({
    url: '/fill/fillunitdefaultoperator',
    method: 'post',
    data: data
  })
}

// 修改填报单元默认操作人
export function updateFillunitdefaultoperator(data) {
  return request({
    url: '/fill/fillunitdefaultoperator',
    method: 'put',
    data: data
  })
}

// 删除填报单元默认操作人
export function delFillunitdefaultoperator(unitOperatorId) {
  return request({
    url: '/fill/fillunitdefaultoperator/' + unitOperatorId,
    method: 'delete'
  })
}
