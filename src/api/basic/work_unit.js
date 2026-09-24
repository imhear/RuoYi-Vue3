import request from '@/utils/request'

// 查询工作单元列表
export function listWork_unit(query) {
  return request({
    url: '/basic/work_unit/list',
    method: 'get',
    params: query
  })
}

// 查询工作单元详细
export function getWork_unit(id) {
  return request({
    url: '/basic/work_unit/' + id,
    method: 'get'
  })
}

// 新增工作单元
export function addWork_unit(data) {
  return request({
    url: '/basic/work_unit',
    method: 'post',
    data: data
  })
}

// 修改工作单元
export function updateWork_unit(data) {
  return request({
    url: '/basic/work_unit',
    method: 'put',
    data: data
  })
}

// 删除工作单元
export function delWork_unit(id) {
  return request({
    url: '/basic/work_unit/' + id,
    method: 'delete'
  })
}

// 查询当前登录用户可操作的工作单元编码列表
export function getMyWorkUnits() {
  return request({
    url: '/basic/work_unit/getMyWorkUnits',
    method: 'get'
  })
}

// 查询已分配角色列表
export function allocatedRoleList(query) {
  return request({
    url: '/basic/work_unit/authRole/allocatedList',
    method: 'get',
    params: query
  })
}

// 查询未分配角色列表
export function unallocatedRoleList(query) {
  return request({
    url: '/basic/work_unit/authRole/unallocatedList',
    method: 'get',
    params: query
  })
}

// 取消授权角色
export function authRoleCancel(data) {
  return request({
    url: '/basic/work_unit/authRole/cancel',
    method: 'put',
    data: data
  })
}

// 批量取消授权角色
export function authRoleCancelAll(data) {
  return request({
    url: '/basic/work_unit/authRole/cancelAll',
    method: 'put',
    params: data
  })
}

// 批量选择角色授权
export function authRoleSelectAll(data) {
  return request({
    url: '/basic/work_unit/authRole/selectAll',
    method: 'put',
    params: data
  })
}