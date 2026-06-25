import request from '@/utils/request'

// 查询灌装包材处理记录1列表
export function listDisinfectionPackaging1(query) {
  return request({
    url: '/bottling/disinfectionPackaging1/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录1详细
export function getDisinfectionPackaging1(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging1/' + recordId,
    method: 'get'
  })
}

// 新增灌装包材处理记录1
export function addDisinfectionPackaging1(data) {
  return request({
    url: '/bottling/disinfectionPackaging1',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录1
export function updateDisinfectionPackaging1(data) {
  return request({
    url: '/bottling/disinfectionPackaging1',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录1
export function delDisinfectionPackaging1(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging1/' + recordId,
    method: 'delete'
  })
}

// ========== 手工新增方法 ==========

// Step1 处理提交
export function handleStep1(recordId, data) {
  return request({
    url: '/bottling/disinfectionPackaging1/handleStep1/' + recordId,
    method: 'post',
    data: data
  })
}

// Step2 处理提交
export function handleStep2(recordId, data) {
  return request({
    url: '/bottling/disinfectionPackaging1/handleStep2/' + recordId,
    method: 'post',
    data: data
  })
}

// Step3 处理提交
export function handleStep3(recordId, data) {
  return request({
    url: '/bottling/disinfectionPackaging1/handleStep3/' + recordId,
    method: 'post',
    data: data
  })
}

// Step4 处理提交
export function handleStep4(recordId, data) {
  return request({
    url: '/bottling/disinfectionPackaging1/handleStep4/' + recordId,
    method: 'post',
    data: data
  })
}

// Step1 复核提交
export function reviewStep1(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging1/handleStep1Review/' + recordId,
    method: 'post'
  })
}

// Step2 复核提交
export function reviewStep2(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging1/handleStep2Review/' + recordId,
    method: 'post'
  })
}

// Step3 复核提交
export function reviewStep3(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging1/handleStep3Review/' + recordId,
    method: 'post'
  })
}

// Step4 复核提交
export function reviewStep4(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging1/handleStep4Review/' + recordId,
    method: 'post'
  })
}

// Step1 检查提交
export function inspectStep1(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging1/handleStep1Inspect/' + recordId,
    method: 'post'
  })
}

// Step2 检查提交
export function inspectStep2(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging1/handleStep2Inspect/' + recordId,
    method: 'post'
  })
}

// Step3 检查提交
export function inspectStep3(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging1/handleStep3Inspect/' + recordId,
    method: 'post'
  })
}