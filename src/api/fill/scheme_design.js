import request from '@/utils/request'

// 查询填报方案设计态列表
export function listScheme_design(query) {
  return request({
    url: '/fill/scheme_design/list',
    method: 'get',
    params: query
  })
}

// 查询填报方案设计态详细
export function getScheme_design(schemeId) {
  return request({
    url: '/fill/scheme_design/' + schemeId,
    method: 'get'
  })
}

// 新增填报方案设计态
export function addScheme_design(data) {
  return request({
    url: '/fill/scheme_design',
    method: 'post',
    data: data
  })
}

// 修改填报方案设计态
export function updateScheme_design(data) {
  return request({
    url: '/fill/scheme_design',
    method: 'put',
    data: data
  })
}

// 删除填报方案设计态
export function delScheme_design(schemeId) {
  return request({
    url: '/fill/scheme_design/' + schemeId,
    method: 'delete'
  })
}
