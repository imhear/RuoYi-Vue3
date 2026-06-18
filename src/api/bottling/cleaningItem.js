import request from '@/utils/request'

// 查询清场记录明细列表
export function listCleaningItem(query) {
  return request({
    url: '/bottling/cleaningItem/list',
    method: 'get',
    params: query
  })
}

// 查询清场记录明细详细
export function getCleaningItem(itemId) {
  return request({
    url: '/bottling/cleaningItem/' + itemId,
    method: 'get'
  })
}

// 新增清场记录明细
export function addCleaningItem(data) {
  return request({
    url: '/bottling/cleaningItem',
    method: 'post',
    data: data
  })
}

// 修改清场记录明细
export function updateCleaningItem(data) {
  return request({
    url: '/bottling/cleaningItem',
    method: 'put',
    data: data
  })
}

// 删除清场记录明细
export function delCleaningItem(itemId) {
  return request({
    url: '/bottling/cleaningItem/' + itemId,
    method: 'delete'
  })
}
