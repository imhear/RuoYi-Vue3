import request from '@/utils/request'

// 查询工作单元列表
export function listWork_unit(query) {
  return request({
    url: '/fill/work_unit/list',
    method: 'get',
    params: query
  })
}

// 查询工作单元详细
export function getWork_unit(workUnitId) {
  return request({
    url: '/fill/work_unit/' + workUnitId,
    method: 'get'
  })
}

// 新增工作单元
export function addWork_unit(data) {
  return request({
    url: '/fill/work_unit',
    method: 'post',
    data: data
  })
}

// 修改工作单元
export function updateWork_unit(data) {
  return request({
    url: '/fill/work_unit',
    method: 'put',
    data: data
  })
}

// 删除工作单元
export function delWork_unit(workUnitId) {
  return request({
    url: '/fill/work_unit/' + workUnitId,
    method: 'delete'
  })
}
