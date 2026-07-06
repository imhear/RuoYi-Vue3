import request from '@/utils/request'

// 查询灌装包材处理记录2列表
export function listDisinfectionPackaging2(query) {
  return request({
    url: '/bottling/disinfectionPackaging2/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录2详细
export function getDisinfectionPackaging2(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging2/' + recordId,
    method: 'get'
  })
}

// 新增灌装包材处理记录2
export function addDisinfectionPackaging2(data) {
  return request({
    url: '/bottling/disinfectionPackaging2',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录2
export function updateDisinfectionPackaging2(data) {
  return request({
    url: '/bottling/disinfectionPackaging2',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录2
export function delDisinfectionPackaging2(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging2/' + recordId,
    method: 'delete'
  })
}

// ========== 手工新增方法 ==========

// Step5 处理提交
export function handleStep5(recordId, data) {
  return request({
    url: '/bottling/disinfectionPackaging2/handleStep5/' + recordId,
    method: 'post',
    data: data
  })
}

// Step6 处理提交
export function handleStep6(recordId, data) {
  return request({
    url: '/bottling/disinfectionPackaging2/handleStep6/' + recordId,
    method: 'post',
    data: data
  })
}

// Step5 复核提交
export function reviewStep5(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging2/handleStep5Review/' + recordId,
    method: 'post'
  })
}

// Step6 复核提交
export function reviewStep6(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging2/handleStep6Review/' + recordId,
    method: 'post'
  })
}

// Step5 检查提交
export function inspectStep5(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging2/handleStep5Inspect/' + recordId,
    method: 'post'
  })
}

// Step6 检查提交
export function inspectStep6(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging2/handleStep6Inspect/' + recordId,
    method: 'post'
  })
}