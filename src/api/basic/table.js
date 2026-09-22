import request from '@/utils/request'

// 查询业务表注册列表
export function listTable(query) {
  return request({
    url: '/basic/table/list',
    method: 'get',
    params: query
  })
}

// 查询业务表注册详细
export function getTable(tableId) {
  return request({
    url: '/basic/table/' + tableId,
    method: 'get'
  })
}

// 新增业务表注册
export function addTable(data) {
  return request({
    url: '/basic/table',
    method: 'post',
    data: data
  })
}

// 修改业务表注册
export function updateTable(data) {
  return request({
    url: '/basic/table',
    method: 'put',
    data: data
  })
}

// 删除业务表注册
export function delTable(tableId) {
  return request({
    url: '/basic/table/' + tableId,
    method: 'delete'
  })
}

// 同步业务表到业务表注册表
export function syncTable() {
  return request({
    url: '/basic/table/sync',
    method: 'post'
  })
}