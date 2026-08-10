import request from '@/utils/request'

// 查询填报方案发布明细（发布时快照）列表
export function listSchemereleasedetail(query) {
  return request({
    url: '/fill/schemereleasedetail/list',
    method: 'get',
    params: query
  })
}

// 查询填报方案发布明细（发布时快照）详细
export function getSchemereleasedetail(releaseDetailId) {
  return request({
    url: '/fill/schemereleasedetail/' + releaseDetailId,
    method: 'get'
  })
}

// 新增填报方案发布明细（发布时快照）
export function addSchemereleasedetail(data) {
  return request({
    url: '/fill/schemereleasedetail',
    method: 'post',
    data: data
  })
}

// 修改填报方案发布明细（发布时快照）
export function updateSchemereleasedetail(data) {
  return request({
    url: '/fill/schemereleasedetail',
    method: 'put',
    data: data
  })
}

// 删除填报方案发布明细（发布时快照）
export function delSchemereleasedetail(releaseDetailId) {
  return request({
    url: '/fill/schemereleasedetail/' + releaseDetailId,
    method: 'delete'
  })
}
