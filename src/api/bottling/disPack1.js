import request from '@/utils/request'

// 查询灌装包材处理记录1列表
export function listDisPack1(query) {
  return request({
    url: '/bottling/disPack1/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录1详细
export function getDisPack1(recordId) {
  return request({
    url: '/bottling/disPack1/' + recordId,
    method: 'get'
  })
}

// 新增灌装包材处理记录1
export function addDisPack1(data) {
  return request({
    url: '/bottling/disPack1',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录1
export function updateDisPack1(data) {
  return request({
    url: '/bottling/disPack1',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录1
export function delDisPack1(recordId) {
  return request({
    url: '/bottling/disPack1/' + recordId,
    method: 'delete'
  })
}
