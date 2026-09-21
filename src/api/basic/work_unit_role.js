import request from '@/utils/request'

/**
 * 查询指定工作单元已关联的角色ID列表
 * 
 * @param {Number} workUnitId 工作单元ID
 * @returns {Promise} 返回角色ID数组，如 [1, 2, 3]
 */
export function getWorkUnitRoleIds(workUnitId) {
  return request({
    url: '/basic/work_unit_role/roles/' + workUnitId,
    method: 'get'
  })
}

/**
 * 保存工作单元的角色关联
 * 
 * 全量替换策略：先删除旧关联，再批量插入新关联。
 * 传空数组或 null 表示清空该工作单元的所有角色关联。
 * 
 * @param {Number} workUnitId 工作单元ID
 * @param {Array} roleIds 角色ID数组
 * @returns {Promise}
 */
export function saveWorkUnitRoles(workUnitId, roleIds) {
  return request({
    url: '/basic/work_unit_role/roles/' + workUnitId,
    method: 'put',
    data: { roleIds }
  })
}