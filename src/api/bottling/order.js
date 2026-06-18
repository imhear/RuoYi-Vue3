import request from '@/utils/request'

// 查询罐包装生产指令单列表
export function listOrder(query) {
  return request({
    url: '/bottling/order/list',
    method: 'get',
    params: query
  })
}

// 查询罐包装生产指令单详细
export function getOrder(orderId) {
  return request({
    url: '/bottling/order/' + orderId,
    method: 'get'
  })
}

// 新增罐包装生产指令单
export function addOrder(data) {
  return request({
    url: '/bottling/order',
    method: 'post',
    data: data
  })
}

// 修改罐包装生产指令单
export function updateOrder(data) {
  return request({
    url: '/bottling/order',
    method: 'put',
    data: data
  })
}

// 删除罐包装生产指令单
export function delOrder(orderId) {
  return request({
    url: '/bottling/order/' + orderId,
    method: 'delete'
  })
}

// ========== 手工新增方法 ==========
// 导入外部生产指令单
export function importBottlingOrder(data) {
  return request({
    url: '/bottling/order/import',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 根据工单号获取工单详情（含产品明细、BOM 物料）
export function getOrderDetailByNum(orderNum) {
  return request({
    url: '/bottling/order/detailByNum/' + orderNum,
    method: 'get'
  })
}

// 获取生产指令单详情（含产品明细、BOM 物料）
export function getOrderDetail(orderId) {
  return request({
    url: '/bottling/order/detail/' + orderId,
    method: 'get'
  })
}

// 审核工单
export function auditOrder(orderId) {
  return request({
    url: '/bottling/order/audit/' + orderId,
    method: 'put'
  })
}

// 取消工单
export function cancelOrder(orderId, data) {
  return request({
    url: '/bottling/order/cancel/' + orderId,
    method: 'put',
    data: data
  })
}

// 删除工单（逻辑删除）
export function deleteOrder(orderId, data) {
  return request({
    url: '/bottling/order/delete/' + orderId,
    method: 'delete',
    data: data
  })
}

// 更新工单计划日期
export function updatePlanDate(orderId, data) {
  return request({
    url: '/bottling/order/planDate/' + orderId,
    method: 'put',
    data: data
  })
}