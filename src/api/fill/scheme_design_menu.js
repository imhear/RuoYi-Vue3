import request from '@/utils/request'

// 查询菜单权限设计态列表
export function listScheme_design_menu(query) {
  return request({
    url: '/fill/scheme_design_menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单权限设计态详细
export function getScheme_design_menu(menuId) {
  return request({
    url: '/fill/scheme_design_menu/' + menuId,
    method: 'get'
  })
}

// 新增菜单权限设计态
export function addScheme_design_menu(data) {
  return request({
    url: '/fill/scheme_design_menu',
    method: 'post',
    data: data
  })
}

// 修改菜单权限设计态
export function updateScheme_design_menu(data) {
  return request({
    url: '/fill/scheme_design_menu',
    method: 'put',
    data: data
  })
}

// 删除菜单权限设计态
export function delScheme_design_menu(menuId) {
  return request({
    url: '/fill/scheme_design_menu/' + menuId,
    method: 'delete'
  })
}
