import request from '@/utils/request'

// 查询test部门1列表
export function listTest_dept_1(query) {
  return request({
    url: '/system/test_dept_1/list',
    method: 'get',
    params: query
  })
}

// 查询test部门1详细
export function getTest_dept_1(deptId) {
  return request({
    url: '/system/test_dept_1/' + deptId,
    method: 'get'
  })
}

// 新增test部门1
export function addTest_dept_1(data) {
  return request({
    url: '/system/test_dept_1',
    method: 'post',
    data: data
  })
}

// 修改test部门1
export function updateTest_dept_1(data) {
  return request({
    url: '/system/test_dept_1',
    method: 'put',
    data: data
  })
}

// 删除test部门1
export function delTest_dept_1(deptId) {
  return request({
    url: '/system/test_dept_1/' + deptId,
    method: 'delete'
  })
}
