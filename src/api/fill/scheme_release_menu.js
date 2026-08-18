import request from '@/utils/request'

// 查询菜单权限发布态列表
export function listScheme_release_menu(query) {
  return request({
    url: '/fill/scheme_release_menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单权限发布态详细
export function getScheme_release_menu(menuId) {
  return request({
    url: '/fill/scheme_release_menu/' + menuId,
    method: 'get'
  })
}

// 新增菜单权限发布态
export function addScheme_release_menu(data) {
  return request({
    url: '/fill/scheme_release_menu',
    method: 'post',
    data: data
  })
}

// 修改菜单权限发布态
export function updateScheme_release_menu(data) {
  return request({
    url: '/fill/scheme_release_menu',
    method: 'put',
    data: data
  })
}

// 删除菜单权限发布态
export function delScheme_release_menu(menuId) {
  return request({
    url: '/fill/scheme_release_menu/' + menuId,
    method: 'delete'
  })
}
