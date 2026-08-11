import request from '@/utils/request'

// 查询填报方案发布分组（快照）列表
export function listSchemereleasegroup(query) {
  return request({
    url: '/fill/schemereleasegroup/list',
    method: 'get',
    params: query
  })
}

// 查询填报方案发布分组（快照）详细
export function getSchemereleasegroup(releaseGroupId) {
  return request({
    url: '/fill/schemereleasegroup/' + releaseGroupId,
    method: 'get'
  })
}

// 新增填报方案发布分组（快照）
export function addSchemereleasegroup(data) {
  return request({
    url: '/fill/schemereleasegroup',
    method: 'post',
    data: data
  })
}

// 修改填报方案发布分组（快照）
export function updateSchemereleasegroup(data) {
  return request({
    url: '/fill/schemereleasegroup',
    method: 'put',
    data: data
  })
}

// 删除填报方案发布分组（快照）
export function delSchemereleasegroup(releaseGroupId) {
  return request({
    url: '/fill/schemereleasegroup/' + releaseGroupId,
    method: 'delete'
  })
}
