import request from '@/utils/request'

// 查询填报方案设计明细列表
export function listSchemedetail(query) {
  return request({
    url: '/fill/schemedetail/list',
    method: 'get',
    params: query
  })
}

// 查询填报方案设计明细详细
export function getSchemedetail(detailId) {
  return request({
    url: '/fill/schemedetail/' + detailId,
    method: 'get'
  })
}

// 新增填报方案设计明细
export function addSchemedetail(data) {
  return request({
    url: '/fill/schemedetail',
    method: 'post',
    data: data
  })
}

// 修改填报方案设计明细
export function updateSchemedetail(data) {
  return request({
    url: '/fill/schemedetail',
    method: 'put',
    data: data
  })
}

// 删除填报方案设计明细
export function delSchemedetail(detailId) {
  return request({
    url: '/fill/schemedetail/' + detailId,
    method: 'delete'
  })
}
