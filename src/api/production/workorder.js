import request from '@/utils/request'

// 查询生产工单列表
export function listWorkorder(query) {
  return request({
    url: '/production/workorder/list',
    method: 'get',
    params: query
  })
}

// 查询工单详情（含BOM子表）
export function getWorkorderDetail(workOrderId) {
  return request({
    url: '/production/workorder/detail/' + workOrderId,
    method: 'get'
  })
}

// 查询生产工单详细
export function getWorkorder(workOrderId) {
  return request({
    url: '/production/workorder/' + workOrderId,
    method: 'get'
  })
}

// 新增生产工单
export function addWorkorder(data) {
  return request({
    url: '/production/workorder',
    method: 'post',
    data: data
  })
}

// 修改生产工单
export function updateWorkorder(data) {
  return request({
    url: '/production/workorder',
    method: 'put',
    data: data
  })
}

// 删除生产工单
export function delWorkorder(workOrderId) {
  return request({
    url: '/production/workorder/' + workOrderId,
    method: 'delete'
  })
}

// 新增生产工单，导入外部生产指令单方式
export function importWorkorder(data) {
  return request({
    url: '/production/workorder/import',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 取消工单
export function cancelWorkorder(workOrderId, data) {
  return request({
    url: '/production/workorder/cancel/' + workOrderId,
    method: 'put',
    data: data
  })
}

// 审核工单
export function auditWorkorder(workOrderId) {
  return request({
    url: '/production/workorder/audit/' + workOrderId,
    method: 'put'
  })
}

// 设置工单计划日期
export function updatePlanDate(workOrderId, data) {
  return request({
    url: '/production/workorder/planDate/' + workOrderId,
    method: 'put',
    data: data
  })
}