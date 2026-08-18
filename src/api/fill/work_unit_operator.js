import request from '@/utils/request'

// 查询单元作业人员列表
export function listWork_unit_operator(query) {
  return request({
    url: '/fill/work_unit_operator/list',
    method: 'get',
    params: query
  })
}

// 查询单元作业人员详细
export function getWork_unit_operator(workUnitOperatorId) {
  return request({
    url: '/fill/work_unit_operator/' + workUnitOperatorId,
    method: 'get'
  })
}

// 新增单元作业人员
export function addWork_unit_operator(data) {
  return request({
    url: '/fill/work_unit_operator',
    method: 'post',
    data: data
  })
}

// 修改单元作业人员
export function updateWork_unit_operator(data) {
  return request({
    url: '/fill/work_unit_operator',
    method: 'put',
    data: data
  })
}

// 删除单元作业人员
export function delWork_unit_operator(workUnitOperatorId) {
  return request({
    url: '/fill/work_unit_operator/' + workUnitOperatorId,
    method: 'delete'
  })
}
