import request from '@/utils/request'

// 查询罐包装生产指令单明细列表
export function listDetail(query) {
  return request({
    url: '/bottling/detail/list',
    method: 'get',
    params: query
  })
}

// 查询罐包装生产指令单明细详细
export function getDetail(detailId) {
  return request({
    url: '/bottling/detail/' + detailId,
    method: 'get'
  })
}

// 新增罐包装生产指令单明细
export function addDetail(data) {
  return request({
    url: '/bottling/detail',
    method: 'post',
    data: data
  })
}

// 修改罐包装生产指令单明细
export function updateDetail(data) {
  return request({
    url: '/bottling/detail',
    method: 'put',
    data: data
  })
}

// 删除罐包装生产指令单明细
export function delDetail(detailId) {
  return request({
    url: '/bottling/detail/' + detailId,
    method: 'delete'
  })
}

// ========== 手工新增方法 ==========

// 排产：新增排产计划
export function scheduleDetail(detailId, data) {
  return request({
    url: '/bottling/detail/schedule/' + detailId,
    method: 'post',
    data: data
  })
}