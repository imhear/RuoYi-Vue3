import request from '@/utils/request'

// 查询灌装包材处理记录1列表
export function listDisinfectionPackaging1(query) {
  return request({
    url: '/bottling/disinfectionPackaging1/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录1详细
export function getDisinfectionPackaging1(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging1/' + recordId,
    method: 'get'
  })
}

// 新增灌装包材处理记录1
export function addDisinfectionPackaging1(data) {
  return request({
    url: '/bottling/disinfectionPackaging1',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录1
export function updateDisinfectionPackaging1(data) {
  return request({
    url: '/bottling/disinfectionPackaging1',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录1
export function delDisinfectionPackaging1(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging1/' + recordId,
    method: 'delete'
  })
}
