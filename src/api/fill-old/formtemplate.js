import request from '@/utils/request'

// 查询单模板列表
export function listFormtemplate(query) {
  return request({
    url: '/fill/formtemplate/list',
    method: 'get',
    params: query
  })
}

// 查询单模板详细
export function getFormtemplate(formId) {
  return request({
    url: '/fill/formtemplate/' + formId,
    method: 'get'
  })
}

// 新增单模板
export function addFormtemplate(data) {
  return request({
    url: '/fill/formtemplate',
    method: 'post',
    data: data
  })
}

// 修改单模板
export function updateFormtemplate(data) {
  return request({
    url: '/fill/formtemplate',
    method: 'put',
    data: data
  })
}

// 删除单模板
export function delFormtemplate(formId) {
  return request({
    url: '/fill/formtemplate/' + formId,
    method: 'delete'
  })
}

// 手工新增
// 同步业务表到表单模板表
export function syncFormtemplate() {
  return request({
    url: '/fill/formtemplate/sync',
    method: 'post'
  })
}