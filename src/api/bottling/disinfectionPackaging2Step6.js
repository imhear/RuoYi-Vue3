import request from '@/utils/request'

// 查询灌装包材处理记录2子步骤6业务字段列表
export function listProDisinfectionPackaging2Step6(query) {
  return request({
    url: '/bottling/ProDisinfectionPackaging2Step6/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录2子步骤6业务字段详细
export function getProDisinfectionPackaging2Step6(stepId) {
  return request({
    url: '/bottling/ProDisinfectionPackaging2Step6/' + stepId,
    method: 'get'
  })
}

// 新增灌装包材处理记录2子步骤6业务字段
export function addProDisinfectionPackaging2Step6(data) {
  return request({
    url: '/bottling/ProDisinfectionPackaging2Step6',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录2子步骤6业务字段
export function updateProDisinfectionPackaging2Step6(data) {
  return request({
    url: '/bottling/ProDisinfectionPackaging2Step6',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录2子步骤6业务字段
export function delProDisinfectionPackaging2Step6(stepId) {
  return request({
    url: '/bottling/ProDisinfectionPackaging2Step6/' + stepId,
    method: 'delete'
  })
}
