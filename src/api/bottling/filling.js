import request from '@/utils/request'

// 查询灌装生产记录1列表
export function listFilling(query) {
  return request({
    url: '/bottling/filling/list',
    method: 'get',
    params: query
  })
}

// 查询灌装生产记录1详细
export function getFilling(recordId) {
  return request({
    url: '/bottling/filling/' + recordId,
    method: 'get'
  })
}

// 新增灌装生产记录1
export function addFilling(data) {
  return request({
    url: '/bottling/filling',
    method: 'post',
    data: data
  })
}

// 修改灌装生产记录1
export function updateFilling(data) {
  return request({
    url: '/bottling/filling',
    method: 'put',
    data: data
  })
}

// 删除灌装生产记录1
export function delFilling(recordId) {
  return request({
    url: '/bottling/filling/' + recordId,
    method: 'delete'
  })
}

// ========== 手工新增方法 ==========

// 加页：按指定生产日期新增灌装生产记录
export function addPage(planId, data) {
  return request({
    url: '/bottling/filling/addPage/' + planId,
    method: 'post',
    data: data
  })
}

// 处理 Step1
export function handleStep1(recordId, data) {
  return request({
    url: '/bottling/filling/handleStep1/' + recordId,
    method: 'post',
    data: data
  })
}

// 处理 Step2
export function handleStep2(recordId, data) {
  return request({
    url: '/bottling/filling/handleStep2/' + recordId,
    method: 'post',
    data: data
  })
}