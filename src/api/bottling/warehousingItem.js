import request from '@/utils/request'

// 查询入库单明细列表
export function listWarehousingItem(query) {
  return request({
    url: '/bottling/warehousingItem/list',
    method: 'get',
    params: query
  })
}

// 查询入库单明细详细
export function getWarehousingItem(itemId) {
  return request({
    url: '/bottling/warehousingItem/' + itemId,
    method: 'get'
  })
}

// 新增入库单明细
export function addWarehousingItem(data) {
  return request({
    url: '/bottling/warehousingItem',
    method: 'post',
    data: data
  })
}

// 修改入库单明细
export function updateWarehousingItem(data) {
  return request({
    url: '/bottling/warehousingItem',
    method: 'put',
    data: data
  })
}

// 删除入库单明细
export function delWarehousingItem(itemId) {
  return request({
    url: '/bottling/warehousingItem/' + itemId,
    method: 'delete'
  })
}
