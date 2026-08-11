import request from '@/utils/request'

// 查询填报方案设计主列表
export function listFillscheme(query) {
  return request({
    url: '/fill/fillscheme/list',
    method: 'get',
    params: query
  })
}

// 查询填报方案设计主详细
export function getFillscheme(schemeId) {
  return request({
    url: '/fill/fillscheme/' + schemeId,
    method: 'get'
  })
}

// 新增填报方案设计主
export function addFillscheme(data) {
  return request({
    url: '/fill/fillscheme',
    method: 'post',
    data: data
  })
}

// 修改填报方案设计主
export function updateFillscheme(data) {
  return request({
    url: '/fill/fillscheme',
    method: 'put',
    data: data
  })
}

// 删除填报方案设计主
export function delFillscheme(schemeId) {
  return request({
    url: '/fill/fillscheme/' + schemeId,
    method: 'delete'
  })
}
