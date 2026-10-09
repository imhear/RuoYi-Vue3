import request from '@/utils/request'

// 查询灌装包材处理记录1子步骤4业务字段列表
export function listBizDisinfectionPackaging1Step4(query) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1Step4/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录1子步骤4业务字段详细
export function getBizDisinfectionPackaging1Step4(stepId) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1Step4/' + stepId,
    method: 'get'
  })
}

// 新增灌装包材处理记录1子步骤4业务字段
export function addBizDisinfectionPackaging1Step4(data) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1Step4',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录1子步骤4业务字段
export function updateBizDisinfectionPackaging1Step4(data) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1Step4',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录1子步骤4业务字段
export function delBizDisinfectionPackaging1Step4(stepId) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1Step4/' + stepId,
    method: 'delete'
  })
}
