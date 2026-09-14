import request from '@/utils/request'

// 查询业务字典类型列表
export function listType(query) {
  return request({
    url: '/system/bizDict/type/list',
    method: 'get',
    params: query
  })
}

// 查询业务字典类型详细
export function getType(dictId) {
  return request({
    url: '/system/bizDict/type/' + dictId,
    method: 'get'
  })
}

// 新增业务字典类型
export function addType(data) {
  return request({
    url: '/system/bizDict/type',
    method: 'post',
    data: data
  })
}

// 修改业务字典类型
export function updateType(data) {
  return request({
    url: '/system/bizDict/type',
    method: 'put',
    data: data
  })
}

// 删除业务字典类型
export function delType(dictId) {
  return request({
    url: '/system/bizDict/type/' + dictId,
    method: 'delete'
  })
}

// 刷新业务字典缓存
export function refreshCache() {
  return request({
    url: '/system/bizDict/type/refreshCache',
    method: 'delete'
  })
}

// 获取业务字典选择框列表
export function optionselect() {
  return request({
    url: '/system/bizDict/type/optionselect',
    method: 'get'
  })
}