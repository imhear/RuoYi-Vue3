import request from '@/utils/request'

// 查询批记录结构列表
export function listBatch_record_menu(query) {
  return request({
    url: '/batch/batch_record_menu/list',
    method: 'get',
    params: query
  })
}

// 查询批记录结构详细
export function getBatch_record_menu(menuId) {
  return request({
    url: '/batch/batch_record_menu/' + menuId,
    method: 'get'
  })
}

// 新增批记录结构
export function addBatch_record_menu(data) {
  return request({
    url: '/batch/batch_record_menu',
    method: 'post',
    data: data
  })
}

// 修改批记录结构
export function updateBatch_record_menu(data) {
  return request({
    url: '/batch/batch_record_menu',
    method: 'put',
    data: data
  })
}

// 删除批记录结构
export function delBatch_record_menu(menuId) {
  return request({
    url: '/batch/batch_record_menu/' + menuId,
    method: 'delete'
  })
}

// 根据批记录ID查询完整菜单树（不分页，用于聚合入口）
export function listBatchRecordMenuTree(recordId) {
  return request({
    url: '/batch/batch_record_menu/tree/' + recordId,
    method: 'get'
  })
}

/**
 * 查询指定菜单节点（C节点）下的所有按钮节点（F节点）
 * 
 * 用于三态合一组件回显签名行信息。
 *
 * @param {Number} cMenuId C节点ID
 * @returns {Promise} 请求 Promise
 */
export function listBatchRecordMenuButtonsByCMenuId(cMenuId) {
  return request({
    url: '/batch/batch_record_menu/buttons/' + cMenuId,
    method: 'get'
  })
}

/**
 * 通用审批操作
 * @param {Number} menuId 菜单节点ID
 * @param {String} remark 备注
 */
export function approveBatchRecordMenu(menuId, remark) {
  return request({
    url: '/batch/batch_record_menu/approve/' + menuId,
    method: 'post',
    data: { remark }
  })
}