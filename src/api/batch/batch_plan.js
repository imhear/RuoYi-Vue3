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
