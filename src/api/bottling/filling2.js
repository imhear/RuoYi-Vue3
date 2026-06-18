import request from '@/utils/request'

// 查询灌装生产记录2列表
export function listFilling2(query) {
  return request({
    url: '/bottling/filling2/list',
    method: 'get',
    params: query
  })
}

// 查询灌装生产记录2详细
export function getFilling2(recordId) {
  return request({
    url: '/bottling/filling2/' + recordId,
    method: 'get'
  })
}

// 新增灌装生产记录2
export function addFilling2(data) {
  return request({
    url: '/bottling/filling2',
    method: 'post',
    data: data
  })
}

// 修改灌装生产记录2
export function updateFilling2(data) {
  return request({
    url: '/bottling/filling2',
    method: 'put',
    data: data
  })
}

// 删除灌装生产记录2
export function delFilling2(recordId) {
  return request({
    url: '/bottling/filling2/' + recordId,
    method: 'delete'
  })
}
