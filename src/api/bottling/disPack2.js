import request from '@/utils/request'

// 查询灌装包材处理记录2列表
export function listDisPack2(query) {
  return request({
    url: '/bottling/disPack2/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录2详细
export function getDisPack2(recordId) {
  return request({
    url: '/bottling/disPack2/' + recordId,
    method: 'get'
  })
}

// 新增灌装包材处理记录2
export function addDisPack2(data) {
  return request({
    url: '/bottling/disPack2',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录2
export function updateDisPack2(data) {
  return request({
    url: '/bottling/disPack2',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录2
export function delDisPack2(recordId) {
  return request({
    url: '/bottling/disPack2/' + recordId,
    method: 'delete'
  })
}
