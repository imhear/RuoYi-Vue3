import request from '@/utils/request'

// 查询填报方案发布列表
export function listSchemerelease(query) {
  return request({
    url: '/fill/schemerelease/list',
    method: 'get',
    params: query
  })
}

// 查询填报方案发布详细
export function getSchemerelease(releaseId) {
  return request({
    url: '/fill/schemerelease/' + releaseId,
    method: 'get'
  })
}

// 新增填报方案发布
export function addSchemerelease(data) {
  return request({
    url: '/fill/schemerelease',
    method: 'post',
    data: data
  })
}

// 修改填报方案发布
export function updateSchemerelease(data) {
  return request({
    url: '/fill/schemerelease',
    method: 'put',
    data: data
  })
}

// 删除填报方案发布
export function delSchemerelease(releaseId) {
  return request({
    url: '/fill/schemerelease/' + releaseId,
    method: 'delete'
  })
}
