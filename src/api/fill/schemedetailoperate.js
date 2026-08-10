import request from '@/utils/request'

// 查询填报方案明细能力列表
export function listSchemedetailoperate(query) {
  return request({
    url: '/fill/schemedetailoperate/list',
    method: 'get',
    params: query
  })
}

// 查询填报方案明细能力详细
export function getSchemedetailoperate(detailOperateId) {
  return request({
    url: '/fill/schemedetailoperate/' + detailOperateId,
    method: 'get'
  })
}

// 新增填报方案明细能力
export function addSchemedetailoperate(data) {
  return request({
    url: '/fill/schemedetailoperate',
    method: 'post',
    data: data
  })
}

// 修改填报方案明细能力
export function updateSchemedetailoperate(data) {
  return request({
    url: '/fill/schemedetailoperate',
    method: 'put',
    data: data
  })
}

// 删除填报方案明细能力
export function delSchemedetailoperate(detailOperateId) {
  return request({
    url: '/fill/schemedetailoperate/' + detailOperateId,
    method: 'delete'
  })
}
