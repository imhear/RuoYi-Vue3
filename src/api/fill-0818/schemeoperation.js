import request from '@/utils/request'

// 查询填报操作设计态列表
export function listSchemeoperation(query) {
  return request({
    url: '/fill/schemeoperation/list',
    method: 'get',
    params: query
  })
}

// 查询填报操作设计态详细
export function getSchemeoperation(detailOperateId) {
  return request({
    url: '/fill/schemeoperation/' + detailOperateId,
    method: 'get'
  })
}

// 新增填报操作设计态
export function addSchemeoperation(data) {
  return request({
    url: '/fill/schemeoperation',
    method: 'post',
    data: data
  })
}

// 修改填报操作设计态
export function updateSchemeoperation(data) {
  return request({
    url: '/fill/schemeoperation',
    method: 'put',
    data: data
  })
}

// 删除填报操作设计态
export function delSchemeoperation(detailOperateId) {
  return request({
    url: '/fill/schemeoperation/' + detailOperateId,
    method: 'delete'
  })
}
