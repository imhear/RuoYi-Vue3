import request from '@/utils/request'

// 查询入库单列表
export function listWarehousing(query) {
  return request({
    url: '/bottling/warehousing/list',
    method: 'get',
    params: query
  })
}

// 查询入库单详细
export function getWarehousing(warehousingId) {
  return request({
    url: '/bottling/warehousing/' + warehousingId,
    method: 'get'
  })
}

// 新增入库单
export function addWarehousing(data) {
  return request({
    url: '/bottling/warehousing',
    method: 'post',
    data: data
  })
}

// 修改入库单
export function updateWarehousing(data) {
  return request({
    url: '/bottling/warehousing',
    method: 'put',
    data: data
  })
}

// 删除入库单
export function delWarehousing(warehousingId) {
  return request({
    url: '/bottling/warehousing/' + warehousingId,
    method: 'delete'
  })
}
