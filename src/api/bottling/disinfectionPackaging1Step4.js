import request from '@/utils/request'

// 查询灌装包材处理记录1子步骤4业务字段列表
export function listDisinfectionPackaging1Step4(query) {
  return request({
    url: '/bottling/disinfectionPackaging1Step4/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录1子步骤4业务字段详细
export function getDisinfectionPackaging1Step4(stepId) {
  return request({
    url: '/bottling/disinfectionPackaging1Step4/' + stepId,
    method: 'get'
  })
}

// 新增灌装包材处理记录1子步骤4业务字段
export function addDisinfectionPackaging1Step4(data) {
  return request({
    url: '/bottling/disinfectionPackaging1Step4',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录1子步骤4业务字段
export function updateDisinfectionPackaging1Step4(data) {
  return request({
    url: '/bottling/disinfectionPackaging1Step4',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录1子步骤4业务字段
export function delDisinfectionPackaging1Step4(stepId) {
  return request({
    url: '/bottling/disinfectionPackaging1Step4/' + stepId,
    method: 'delete'
  })
}
