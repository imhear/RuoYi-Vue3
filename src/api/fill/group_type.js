import request from '@/utils/request'

// 查询分组类型列表
export function listGroup_type(query) {
  return request({
    url: '/fill/group_type/list',
    method: 'get',
    params: query
  })
}

// 查询分组类型详细
export function getGroup_type(groupTypeId) {
  return request({
    url: '/fill/group_type/' + groupTypeId,
    method: 'get'
  })
}

// 新增分组类型
export function addGroup_type(data) {
  return request({
    url: '/fill/group_type',
    method: 'post',
    data: data
  })
}

// 修改分组类型
export function updateGroup_type(data) {
  return request({
    url: '/fill/group_type',
    method: 'put',
    data: data
  })
}

// 删除分组类型
export function delGroup_type(groupTypeId) {
  return request({
    url: '/fill/group_type/' + groupTypeId,
    method: 'delete'
  })
}
