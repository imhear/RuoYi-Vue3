import request from '@/utils/request'

// 查询填报单元注册列表
export function listUnit(query) {
  return request({
    url: '/fill/unit/list',
    method: 'get',
    params: query
  })
}

// 查询填报单元注册详细
export function getUnit(unitId) {
  return request({
    url: '/fill/unit/' + unitId,
    method: 'get'
  })
}

// 新增填报单元注册
export function addUnit(data) {
  return request({
    url: '/fill/unit',
    method: 'post',
    data: data
  })
}

// 修改填报单元注册
export function updateUnit(data) {
  return request({
    url: '/fill/unit',
    method: 'put',
    data: data
  })
}

// 删除填报单元注册
export function delUnit(unitId) {
  return request({
    url: '/fill/unit/' + unitId,
    method: 'delete'
  })
}
