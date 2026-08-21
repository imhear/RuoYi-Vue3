import request from '@/utils/request'

// 查询填报单实例运行态列表
export function listInstance_form(query) {
  return request({
    url: '/fill/instance_form/list',
    method: 'get',
    params: query
  })
}

// 查询填报单实例运行态详细
export function getInstance_form(formId) {
  return request({
    url: '/fill/instance_form/' + formId,
    method: 'get'
  })
}

// 新增填报单实例运行态
export function addInstance_form(data) {
  return request({
    url: '/fill/instance_form',
    method: 'post',
    data: data
  })
}

// 修改填报单实例运行态
export function updateInstance_form(data) {
  return request({
    url: '/fill/instance_form',
    method: 'put',
    data: data
  })
}

// 删除填报单实例运行态
export function delInstance_form(formId) {
  return request({
    url: '/fill/instance_form/' + formId,
    method: 'delete'
  })
}
