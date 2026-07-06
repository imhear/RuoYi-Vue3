import request from '@/utils/request'

// 查询灌装包材处理记录2列表
export function listDisinfectionPackaging2(query) {
  return request({
    url: '/bottling/disinfectionPackaging2/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录2详细
export function getDisinfectionPackaging2(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging2/' + recordId,
    method: 'get'
  })
}

// 新增灌装包材处理记录2
export function addDisinfectionPackaging2(data) {
  return request({
    url: '/bottling/disinfectionPackaging2',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录2
export function updateDisinfectionPackaging2(data) {
  return request({
    url: '/bottling/disinfectionPackaging2',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录2
export function delDisinfectionPackaging2(recordId) {
  return request({
    url: '/bottling/disinfectionPackaging2/' + recordId,
    method: 'delete'
  })
}
