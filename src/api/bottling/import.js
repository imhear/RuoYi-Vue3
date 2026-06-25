import request from '@/utils/request'

// 查询外部导入生产指令单列表
export function listImport(query) {
  return request({
    url: '/bottling/import/list',
    method: 'get',
    params: query
  })
}

// 查询外部导入生产指令单详细
export function getImport(importId) {
  return request({
    url: '/bottling/import/' + importId,
    method: 'get'
  })
}

// 新增外部导入生产指令单
export function addImport(data) {
  return request({
    url: '/bottling/import',
    method: 'post',
    data: data
  })
}

// 修改外部导入生产指令单
export function updateImport(data) {
  return request({
    url: '/bottling/import',
    method: 'put',
    data: data
  })
}

// 删除外部导入生产指令单
export function delImport(importId) {
  return request({
    url: '/bottling/import/' + importId,
    method: 'delete'
  })
}
