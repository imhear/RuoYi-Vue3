import request from '@/utils/request'

// 查询填报方案设计态列表
export function listScheme(query) {
  return request({
    url: '/fill/scheme/list',
    method: 'get',
    params: query
  })
}

// 查询填报方案设计态详细
export function getScheme(schemeId) {
  return request({
    url: '/fill/scheme/' + schemeId,
    method: 'get'
  })
}

// 新增填报方案设计态
export function addScheme(data) {
  return request({
    url: '/fill/scheme',
    method: 'post',
    data: data
  })
}

// 修改填报方案设计态
export function updateScheme(data) {
  return request({
    url: '/fill/scheme',
    method: 'put',
    data: data
  })
}

// 删除填报方案设计态
export function delScheme(schemeId) {
  return request({
    url: '/fill/scheme/' + schemeId,
    method: 'delete'
  })
}
