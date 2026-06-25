import request from '@/utils/request'

// 查询罐包装生产排产计划列表
export function listPlan(query) {
  return request({
    url: '/bottling/plan/list',
    method: 'get',
    params: query
  })
}

// 查询罐包装生产排产计划详细
export function getPlan(planId) {
  return request({
    url: '/bottling/plan/' + planId,
    method: 'get'
  })
}

// 新增罐包装生产排产计划
export function addPlan(data) {
  return request({
    url: '/bottling/plan',
    method: 'post',
    data: data
  })
}

// 修改罐包装生产排产计划
export function updatePlan(data) {
  return request({
    url: '/bottling/plan',
    method: 'put',
    data: data
  })
}

// 删除罐包装生产排产计划
export function delPlan(planId) {
  return request({
    url: '/bottling/plan/' + planId,
    method: 'delete'
  })
}

// ========== 手工新增方法 ==========

// 删除排产计划（逻辑删除）
export function deletePlan(planId, data) {
  return request({
    url: '/bottling/plan/delete/' + planId,
    method: 'delete',
    data: data
  })
}

// 开始生产任务
export function startPlan(planId, data) {
  return request({
    url: '/bottling/plan/start/' + planId,
    method: 'put',
    data: data  // 确保 data 作为请求体发送
  })
}

// 取消生产任务
export function cancelPlan(planId, data) {
  return request({
    url: '/bottling/plan/cancel/' + planId,
    method: 'put',
    data: data
  })
}

// 完成生产任务
export function finishPlan(planId, data) {
  return request({
    url: '/bottling/plan/finish/' + planId,
    method: 'put',
    data: data
  })
}
