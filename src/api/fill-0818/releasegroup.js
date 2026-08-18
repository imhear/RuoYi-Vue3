import request from '@/utils/request'

// 查询填报分组发布态列表
export function listReleasegroup(query) {
  return request({
    url: '/fill/releasegroup/list',
    method: 'get',
    params: query
  })
}

// 查询填报分组发布态详细
export function getReleasegroup(releaseGroupId) {
  return request({
    url: '/fill/releasegroup/' + releaseGroupId,
    method: 'get'
  })
}

// 新增填报分组发布态
export function addReleasegroup(data) {
  return request({
    url: '/fill/releasegroup',
    method: 'post',
    data: data
  })
}

// 修改填报分组发布态
export function updateReleasegroup(data) {
  return request({
    url: '/fill/releasegroup',
    method: 'put',
    data: data
  })
}

// 删除填报分组发布态
export function delReleasegroup(releaseGroupId) {
  return request({
    url: '/fill/releasegroup/' + releaseGroupId,
    method: 'delete'
  })
}
