import request from '@/utils/request'

// 查询填报单元操作人列表
export function listUnitoperator(query) {
  return request({
    url: '/fill/unitoperator/list',
    method: 'get',
    params: query
  })
}

// 查询填报单元操作人详细
export function getUnitoperator(unitOperatorId) {
  return request({
    url: '/fill/unitoperator/' + unitOperatorId,
    method: 'get'
  })
}

// 新增填报单元操作人
export function addUnitoperator(data) {
  return request({
    url: '/fill/unitoperator',
    method: 'post',
    data: data
  })
}

// 修改填报单元操作人
export function updateUnitoperator(data) {
  return request({
    url: '/fill/unitoperator',
    method: 'put',
    data: data
  })
}

// 删除填报单元操作人
export function delUnitoperator(unitOperatorId) {
  return request({
    url: '/fill/unitoperator/' + unitOperatorId,
    method: 'delete'
  })
}
