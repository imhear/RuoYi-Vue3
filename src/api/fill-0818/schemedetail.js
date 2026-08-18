import request from '@/utils/request'

// 查询填报明细设计态列表
export function listSchemedetail(query) {
  return request({
    url: '/fill/schemedetail/list',
    method: 'get',
    params: query
  })
}

// 查询填报明细设计态详细
export function getSchemedetail(detailId) {
  return request({
    url: '/fill/schemedetail/' + detailId,
    method: 'get'
  })
}

// 新增填报明细设计态
export function addSchemedetail(data) {
  return request({
    url: '/fill/schemedetail',
    method: 'post',
    data: data
  })
}

// 修改填报明细设计态
export function updateSchemedetail(data) {
  return request({
    url: '/fill/schemedetail',
    method: 'put',
    data: data
  })
}

// 删除填报明细设计态
export function delSchemedetail(detailId) {
  return request({
    url: '/fill/schemedetail/' + detailId,
    method: 'delete'
  })
}
