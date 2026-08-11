import request from '@/utils/request'

// 查询业务表注册列表
export function listForm(query) {
  return request({
    url: '/fill/form/list',
    method: 'get',
    params: query
  })
}

// 查询业务表注册详细
export function getForm(formId) {
  return request({
    url: '/fill/form/' + formId,
    method: 'get'
  })
}

// 新增业务表注册
export function addForm(data) {
  return request({
    url: '/fill/form',
    method: 'post',
    data: data
  })
}

// 修改业务表注册
export function updateForm(data) {
  return request({
    url: '/fill/form',
    method: 'put',
    data: data
  })
}

// 删除业务表注册
export function delForm(formId) {
  return request({
    url: '/fill/form/' + formId,
    method: 'delete'
  })
}
