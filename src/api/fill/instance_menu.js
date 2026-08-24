import request from '@/utils/request'

// 查询填报菜单运行态列表
export function listInstance_menu(query) {
  return request({
    url: '/fill/instance_menu/list',
    method: 'get',
    params: query
  })
}

// 查询填报菜单运行态详细
export function getInstance_menu(menuId) {
  return request({
    url: '/fill/instance_menu/' + menuId,
    method: 'get'
  })
}

// 新增填报菜单运行态
export function addInstance_menu(data) {
  return request({
    url: '/fill/instance_menu',
    method: 'post',
    data: data
  })
}

// 修改填报菜单运行态
export function updateInstance_menu(data) {
  return request({
    url: '/fill/instance_menu',
    method: 'put',
    data: data
  })
}

// 删除填报菜单运行态
export function delInstance_menu(menuId) {
  return request({
    url: '/fill/instance_menu/' + menuId,
    method: 'delete'
  })
}
