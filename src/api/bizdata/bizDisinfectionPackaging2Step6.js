import request from '@/utils/request'

// 查询灌装包材处理记录2子步骤6业务字段列表
export function listBizDisinfectionPackaging2Step6(query) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2Step6/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录2子步骤6业务字段详细
export function getBizDisinfectionPackaging2Step6(stepId) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2Step6/' + stepId,
    method: 'get'
  })
}

// 新增灌装包材处理记录2子步骤6业务字段
export function addBizDisinfectionPackaging2Step6(data) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2Step6',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录2子步骤6业务字段
export function updateBizDisinfectionPackaging2Step6(data) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2Step6',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录2子步骤6业务字段
export function delBizDisinfectionPackaging2Step6(stepId) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2Step6/' + stepId,
    method: 'delete'
  })
}
