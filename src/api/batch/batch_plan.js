import request from '@/utils/request'

// 查询生产计划列表
export function listBatch_plan(query) {
  return request({
    url: '/batch/batch_plan/list',
    method: 'get',
    params: query
  })
}

// 查询生产计划详细
export function getBatch_plan(planId) {
  return request({
    url: '/batch/batch_plan/' + planId,
    method: 'get'
  })
}

// 新增生产计划
export function addBatch_plan(data) {
  return request({
    url: '/batch/batch_plan',
    method: 'post',
    data: data
  })
}

// 修改生产计划
export function updateBatch_plan(data) {
  return request({
    url: '/batch/batch_plan',
    method: 'put',
    data: data
  })
}

// 删除生产计划
export function delBatch_plan(planId) {
  return request({
    url: '/batch/batch_plan/' + planId,
    method: 'delete'
  })
}

// 生成批记录
export function generateInstance(data) {
  return request({
    url: '/batch/batch_plan/generate',
    method: 'post',
    data: data
  })
}

// 快速新建排产计划
export function createPlan() {
  return request({
    url: '/batch/batch_plan/create',
    method: 'post'
  })
}

// 导入外部生产指令单
export function importBatchOrder(planId, file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/batch/batch_order/import/' + planId,
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}