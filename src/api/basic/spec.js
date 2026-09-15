import request from '@/utils/request'

// 查询基础数据-规格列表
export function listSpec(query) {
  return request({
    url: '/basic/spec/list',
    method: 'get',
    params: query
  })
}

// 按物料大类查询叶子节点（扁平列表）
export function listUnitByCategory(categoryCode) {
  return request({
    url: '/basic/spec/listByCategory',
    method: 'get',
    params: { categoryCode }
  })
}

// 查询基础数据-规格详细
export function getSpec(id) {
  return request({
    url: '/basic/spec/' + id,
    method: 'get'
  })
}

// 新增基础数据-规格
export function addSpec(data) {
  return request({
    url: '/basic/spec',
    method: 'post',
    data: data
  })
}

// 修改基础数据-规格
export function updateSpec(data) {
  return request({
    url: '/basic/spec',
    method: 'put',
    data: data
  })
}

// 删除基础数据-规格
export function delSpec(id) {
  return request({
    url: '/basic/spec/' + id,
    method: 'delete'
  })
}
