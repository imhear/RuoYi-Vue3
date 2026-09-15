import request from '@/utils/request'

// 查询基础数据-单位列表
export function listUnit(query) {
  return request({
    url: '/basic/unit/list',
    method: 'get',
    params: query
  })
}

// 按物料大类查询叶子节点（扁平列表）
export function listUnitByCategory(categoryCode) {
  return request({
    url: '/basic/unit/listByCategory',
    method: 'get',
    params: { categoryCode }
  })
}

// 查询基础数据-单位详细
export function getUnit(id) {
  return request({
    url: '/basic/unit/' + id,
    method: 'get'
  })
}

// 新增基础数据-单位
export function addUnit(data) {
  return request({
    url: '/basic/unit',
    method: 'post',
    data: data
  })
}

// 修改基础数据-单位
export function updateUnit(data) {
  return request({
    url: '/basic/unit',
    method: 'put',
    data: data
  })
}

// 删除基础数据-单位
export function delUnit(id) {
  return request({
    url: '/basic/unit/' + id,
    method: 'delete'
  })
}
