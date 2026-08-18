import request from '@/utils/request'

// 查询填报明细发布态列表
export function listReleasedetail(query) {
  return request({
    url: '/fill/releasedetail/list',
    method: 'get',
    params: query
  })
}

// 查询填报明细发布态详细
export function getReleasedetail(releaseDetailId) {
  return request({
    url: '/fill/releasedetail/' + releaseDetailId,
    method: 'get'
  })
}

// 新增填报明细发布态
export function addReleasedetail(data) {
  return request({
    url: '/fill/releasedetail',
    method: 'post',
    data: data
  })
}

// 修改填报明细发布态
export function updateReleasedetail(data) {
  return request({
    url: '/fill/releasedetail',
    method: 'put',
    data: data
  })
}

// 删除填报明细发布态
export function delReleasedetail(releaseDetailId) {
  return request({
    url: '/fill/releasedetail/' + releaseDetailId,
    method: 'delete'
  })
}
