import request from '@/utils/request'

// 查询前端组件版本列表
export function listComponentsversion(query) {
  return request({
    url: '/fill/componentsversion/list',
    method: 'get',
    params: query
  })
}

// 查询前端组件版本详细
export function getComponentsversion(versionId) {
  return request({
    url: '/fill/componentsversion/' + versionId,
    method: 'get'
  })
}

// 新增前端组件版本
export function addComponentsversion(data) {
  return request({
    url: '/fill/componentsversion',
    method: 'post',
    data: data
  })
}

// 修改前端组件版本
export function updateComponentsversion(data) {
  return request({
    url: '/fill/componentsversion',
    method: 'put',
    data: data
  })
}

// 删除前端组件版本
export function delComponentsversion(versionId) {
  return request({
    url: '/fill/componentsversion/' + versionId,
    method: 'delete'
  })
}
