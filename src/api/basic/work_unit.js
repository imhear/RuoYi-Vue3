import request from '@/utils/request'

// 查询工作单元列表
export function listWork_unit(query) {
  return request({
    url: '/basic/work_unit/list',
    method: 'get',
    params: query
  })
}

// 查询工作单元详细
export function getWork_unit(id) {
  return request({
    url: '/basic/work_unit/' + id,
    method: 'get'
  })
}

// 新增工作单元
export function addWork_unit(data) {
  return request({
    url: '/basic/work_unit',
    method: 'post',
    data: data
  })
}

// 修改工作单元
export function updateWork_unit(data) {
  return request({
    url: '/basic/work_unit',
    method: 'put',
    data: data
  })
}

// 删除工作单元
export function delWork_unit(id) {
  return request({
    url: '/basic/work_unit/' + id,
    method: 'delete'
  })
}

/**
 * 查询当前登录用户可操作的工作单元编码列表
 * 
 * 用于聚合入口的"工作单元级"权限过滤。
 * 
 * @returns {Promise} 返回工作单元编码列表，如 ["WORKSHOP_D", "WORKSHOP_F"]
 */
export function getMyWorkUnits() {
  return request({
    url: '/basic/work_unit/getMyWorkUnits',
    method: 'get'
  })
}