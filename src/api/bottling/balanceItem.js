import request from '@/utils/request'

// 查询物料平衡表明细列表
export function listBalanceItem(query) {
  return request({
    url: '/bottling/balanceItem/list',
    method: 'get',
    params: query
  })
}

// 查询物料平衡表明细详细
export function getBalanceItem(itemId) {
  return request({
    url: '/bottling/balanceItem/' + itemId,
    method: 'get'
  })
}

// 新增物料平衡表明细
export function addBalanceItem(data) {
  return request({
    url: '/bottling/balanceItem',
    method: 'post',
    data: data
  })
}

// 修改物料平衡表明细
export function updateBalanceItem(data) {
  return request({
    url: '/bottling/balanceItem',
    method: 'put',
    data: data
  })
}

// 删除物料平衡表明细
export function delBalanceItem(itemId) {
  return request({
    url: '/bottling/balanceItem/' + itemId,
    method: 'delete'
  })
}
