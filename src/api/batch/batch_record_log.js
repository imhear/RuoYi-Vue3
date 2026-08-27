import request from '@/utils/request'

// 查询批记录操作日志列表
export function listBatch_record_log(query) {
  return request({
    url: '/batch/batch_record_log/list',
    method: 'get',
    params: query
  })
}

// 查询批记录操作日志详细
export function getBatch_record_log(logId) {
  return request({
    url: '/batch/batch_record_log/' + logId,
    method: 'get'
  })
}

// 新增批记录操作日志
export function addBatch_record_log(data) {
  return request({
    url: '/batch/batch_record_log',
    method: 'post',
    data: data
  })
}

// 修改批记录操作日志
export function updateBatch_record_log(data) {
  return request({
    url: '/batch/batch_record_log',
    method: 'put',
    data: data
  })
}

// 删除批记录操作日志
export function delBatch_record_log(logId) {
  return request({
    url: '/batch/batch_record_log/' + logId,
    method: 'delete'
  })
}
