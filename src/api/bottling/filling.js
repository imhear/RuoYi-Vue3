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

// 处理 Step3
export function handleStep3(recordId, data) {
  return request({
    url: '/bottling/filling/handleStep3/' + recordId,
    method: 'post',
    data: data
  })
}

// 复核 Step1
export function reviewStep1(recordId) {
  return request({
    url: '/bottling/filling/handleStep1Review/' + recordId,
    method: 'post'
  })
}

// 复核 Step2
export function reviewStep2(recordId) {
  return request({
    url: '/bottling/filling/handleStep2Review/' + recordId,
    method: 'post'
  })
}

// 复核 Step3
export function reviewStep3(recordId) {
  return request({
    url: '/bottling/filling/handleStep3Review/' + recordId,
    method: 'post'
  })
}

// 检查 Step1
export function inspectStep1(recordId) {
  return request({
    url: '/bottling/filling/handleStep1Inspect/' + recordId,
    method: 'post'
  })
}

// 检查 Step2
export function inspectStep2(recordId) {
  return request({
    url: '/bottling/filling/handleStep2Inspect/' + recordId,
    method: 'post'
  })
}

// 检查 Step3
export function inspectStep3(recordId) {
  return request({
    url: '/bottling/filling/handleStep3Inspect/' + recordId,
    method: 'post'
  })
}

// 更新灌装起止时间
export function updateFillingDateTime(recordId, data) {
  return request({
    url: '/bottling/filling/updateDateTime/' + recordId,
    method: 'put',
    data: data
  })
}

// 灌装首件确认
export function updateFirstQualified(recordId, data) {
  return request({
    url: '/bottling/filling/updateFirstQualified/' + recordId,
    method: 'put',
    data: data
  })
}
