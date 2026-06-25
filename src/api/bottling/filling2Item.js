import request from '@/utils/request'

// 查询灌装生产记录2明细列表
export function listFilling2Item(query) {
  return request({
    url: '/bottling/filling2Item/list',
    method: 'get',
    params: query
  })
}

// 查询灌装生产记录2明细详细
export function getFilling2Item(itemId) {
  return request({
    url: '/bottling/filling2Item/' + itemId,
    method: 'get'
  })
}

// 新增灌装生产记录2明细
export function addFilling2Item(data) {
  return request({
    url: '/bottling/filling2Item',
    method: 'post',
    data: data
  })
}

// 修改灌装生产记录2明细
export function updateFilling2Item(data) {
  return request({
    url: '/bottling/filling2Item',
    method: 'put',
    data: data
  })
}

// 删除灌装生产记录2明细
export function delFilling2Item(itemId) {
  return request({
    url: '/bottling/filling2Item/' + itemId,
    method: 'delete'
  })
}
