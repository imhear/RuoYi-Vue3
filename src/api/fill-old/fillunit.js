import request from '@/utils/request'

// 查询填报单元配置列表
export function listFillunit(query) {
  return request({
    url: '/fill/fillunit/list',
    method: 'get',
    params: query
  })
}

// 查询填报单元配置详细
export function getFillunit(unitId) {
  return request({
    url: '/fill/fillunit/' + unitId,
    method: 'get'
  })
}

// 新增填报单元配置
export function addFillunit(data) {
  return request({
    url: '/fill/fillunit',
    method: 'post',
    data: data
  })
}

// 修改填报单元配置
export function updateFillunit(data) {
  return request({
    url: '/fill/fillunit',
    method: 'put',
    data: data
  })
}

// 删除填报单元配置
export function delFillunit(unitId) {
  return request({
    url: '/fill/fillunit/' + unitId,
    method: 'delete'
  })
}
