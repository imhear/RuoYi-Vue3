import request from '@/utils/request'

// 查询物料平衡表列表
export function listBalance(query) {
  return request({
    url: '/bottling/balance/list',
    method: 'get',
    params: query
  })
}

// 查询物料平衡表详细
export function getBalance(balanceId) {
  return request({
    url: '/bottling/balance/' + balanceId,
    method: 'get'
  })
}

// 新增物料平衡表
export function addBalance(data) {
  return request({
    url: '/bottling/balance',
    method: 'post',
    data: data
  })
}

// 修改物料平衡表
export function updateBalance(data) {
  return request({
    url: '/bottling/balance',
    method: 'put',
    data: data
  })
}

// 删除物料平衡表
export function delBalance(balanceId) {
  return request({
    url: '/bottling/balance/' + balanceId,
    method: 'delete'
  })
}
