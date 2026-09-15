import request from '@/utils/request'

// 查询基础数据-物料列表
export function listMaterial(query) {
  return request({
    url: '/basic/material/list',
    method: 'get',
    params: query
  })
}

// 按物料大类查询叶子节点（扁平列表）
export function listUnitByCategory(categoryCode) {
  return request({
    url: '/basic/material/listByCategory',
    method: 'get',
    params: { categoryCode }
  })
}

// 查询基础数据-物料详细
export function getMaterial(id) {
  return request({
    url: '/basic/material/' + id,
    method: 'get'
  })
}

// 新增基础数据-物料
export function addMaterial(data) {
  return request({
    url: '/basic/material',
    method: 'post',
    data: data
  })
}

// 修改基础数据-物料
export function updateMaterial(data) {
  return request({
    url: '/basic/material',
    method: 'put',
    data: data
  })
}

// 删除基础数据-物料
export function delMaterial(id) {
  return request({
    url: '/basic/material/' + id,
    method: 'delete'
  })
}
