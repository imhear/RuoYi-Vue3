import request from '@/utils/request'

// 查询清场记录列表
export function listCleaning(query) {
  return request({
    url: '/bottling/cleaning/list',
    method: 'get',
    params: query
  })
}

// 查询清场记录详细
export function getCleaning(cleaningId) {
  return request({
    url: '/bottling/cleaning/' + cleaningId,
    method: 'get'
  })
}

// 新增清场记录
export function addCleaning(data) {
  return request({
    url: '/bottling/cleaning',
    method: 'post',
    data: data
  })
}

// 修改清场记录
export function updateCleaning(data) {
  return request({
    url: '/bottling/cleaning',
    method: 'put',
    data: data
  })
}

// 删除清场记录
export function delCleaning(cleaningId) {
  return request({
    url: '/bottling/cleaning/' + cleaningId,
    method: 'delete'
  })
}

// ========== 手工新增方法 ==========

// 清场处理提交
export function handleCleaning(cleaningId, data) {
  return request({
    url: '/bottling/cleaning/handle/' + cleaningId,
    method: 'post',
    data: data
  })
}

// 清场复核提交
export function reviewCleaning(cleaningId) {
  return request({
    url: '/bottling/cleaning/handleReview/' + cleaningId,
    method: 'post'
  })
}

// 清场检查提交
export function inspectCleaning(cleaningId) {
  return request({
    url: '/bottling/cleaning/handleInspect/' + cleaningId,
    method: 'post'
  })
}