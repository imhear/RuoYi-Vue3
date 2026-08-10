import request from '@/utils/request'

// 查询填报方案分组列表
export function listSchemegroup(query) {
  return request({
    url: '/fill/schemegroup/list',
    method: 'get',
    params: query
  })
}

// 查询填报方案分组详细
export function getSchemegroup(groupSchemeId) {
  return request({
    url: '/fill/schemegroup/' + groupSchemeId,
    method: 'get'
  })
}

// 新增填报方案分组
export function addSchemegroup(data) {
  return request({
    url: '/fill/schemegroup',
    method: 'post',
    data: data
  })
}

// 修改填报方案分组
export function updateSchemegroup(data) {
  return request({
    url: '/fill/schemegroup',
    method: 'put',
    data: data
  })
}

// 删除填报方案分组
export function delSchemegroup(groupSchemeId) {
  return request({
    url: '/fill/schemegroup/' + groupSchemeId,
    method: 'delete'
  })
}
