import request from '@/utils/request'

// 查询填报方案发布态列表
export function listRelease(query) {
  return request({
    url: '/fill/release/list',
    method: 'get',
    params: query
  })
}

// 查询填报方案发布态详细
export function getRelease(releaseId) {
  return request({
    url: '/fill/release/' + releaseId,
    method: 'get'
  })
}

// 新增填报方案发布态
export function addRelease(data) {
  return request({
    url: '/fill/release',
    method: 'post',
    data: data
  })
}

// 修改填报方案发布态
export function updateRelease(data) {
  return request({
    url: '/fill/release',
    method: 'put',
    data: data
  })
}

// 删除填报方案发布态
export function delRelease(releaseId) {
  return request({
    url: '/fill/release/' + releaseId,
    method: 'delete'
  })
}
