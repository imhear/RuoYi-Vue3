import request from '@/utils/request'

/**
 * 查询操作码列表
 * 
 * 从 fill 模块迁移至 basic 模块，主要改动：
 * - URL 前缀：/fill/operation → /basic/operation
 * - 路径变量名：operationId → id（与后端 BasicOperation.id 保持一致）
 * - 字段名契约：operationCode → code、operationName → name
 * - 删除 perms 相关字段（权限权威来源改为 sys_menu）
 */
export function listOperation(query) {
  return request({
    url: '/basic/operation/list',
    method: 'get',
    params: query
  })
}

// 查询操作码详细
export function getOperation(id) {
  return request({
    url: '/basic/operation/' + id,
    method: 'get'
  })
}

// 新增操作码
export function addOperation(data) {
  return request({
    url: '/basic/operation',
    method: 'post',
    data: data
  })
}

// 修改操作码
export function updateOperation(data) {
  return request({
    url: '/basic/operation',
    method: 'put',
    data: data
  })
}

// 删除操作码
export function delOperation(id) {
  return request({
    url: '/basic/operation/' + id,
    method: 'delete'
  })
}

// 保存操作码排序
export function updateOperationSort(data) {
  return request({
    url: '/basic/operation/updateSort',
    method: 'put',
    data: data
  })
}