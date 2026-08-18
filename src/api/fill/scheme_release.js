import request from '@/utils/request'

// 查询填报方案发布态列表
export function listScheme_release(query) {
  return request({
    url: '/fill/scheme_release/list',
    method: 'get',
    params: query
  })
}

// 查询填报方案发布态详细
export function getScheme_release(releaseId) {
  return request({
    url: '/fill/scheme_release/' + releaseId,
    method: 'get'
  })
}

// 新增填报方案发布态
export function addScheme_release(data) {
  return request({
    url: '/fill/scheme_release',
    method: 'post',
    data: data
  })
}

// 修改填报方案发布态
export function updateScheme_release(data) {
  return request({
    url: '/fill/scheme_release',
    method: 'put',
    data: data
  })
}

// 删除填报方案发布态
export function delScheme_release(releaseId) {
  return request({
    url: '/fill/scheme_release/' + releaseId,
    method: 'delete'
  })
}
