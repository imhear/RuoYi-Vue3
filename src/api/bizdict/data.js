import request from '@/utils/request'

// 查询业务字典数据列表
export function listData(query) {
  return request({
    url: '/bizdict/data/list',
    method: 'get',
    params: query
  })
}

// 查询业务字典数据详细
export function getData(dictCode) {
  return request({
    url: '/bizdict/data/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询业务字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/bizdict/data/type/' + dictType,
    method: 'get'
  })
}

// 新增业务字典数据
export function addData(data) {
  return request({
    url: '/bizdict/data',
    method: 'post',
    data: data
  })
}

// 修改业务字典数据
export function updateData(data) {
  return request({
    url: '/bizdict/data',
    method: 'put',
    data: data
  })
}

// 删除业务字典数据
export function delData(dictCode) {
  return request({
    url: '/bizdict/data/' + dictCode,
    method: 'delete'
  })
}