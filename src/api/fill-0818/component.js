import request from '@/utils/request'

// 查询前端组件注册列表
export function listComponent(query) {
  return request({
    url: '/fill/component/list',
    method: 'get',
    params: query
  })
}

// 查询前端组件注册详细
export function getComponent(componentId) {
  return request({
    url: '/fill/component/' + componentId,
    method: 'get'
  })
}

// 新增前端组件注册
export function addComponent(data) {
  return request({
    url: '/fill/component',
    method: 'post',
    data: data
  })
}

// 修改前端组件注册
export function updateComponent(data) {
  return request({
    url: '/fill/component',
    method: 'put',
    data: data
  })
}

// 删除前端组件注册
export function delComponent(componentId) {
  return request({
    url: '/fill/component/' + componentId,
    method: 'delete'
  })
}
