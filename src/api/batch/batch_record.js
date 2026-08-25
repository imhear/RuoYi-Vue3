import request from '@/utils/request'

// 查询批记录列表
export function listBatch_record(query) {
  return request({
    url: '/batch/batch_record/list',
    method: 'get',
    params: query
  })
}

// 查询批记录详细
export function getBatch_record(recordId) {
  return request({
    url: '/batch/batch_record/' + recordId,
    method: 'get'
  })
}

// 新增批记录
export function addBatch_record(data) {
  return request({
    url: '/batch/batch_record',
    method: 'post',
    data: data
  })
}

// 修改批记录
export function updateBatch_record(data) {
  return request({
    url: '/batch/batch_record',
    method: 'put',
    data: data
  })
}

// 删除批记录
export function delBatch_record(recordId) {
  return request({
    url: '/batch/batch_record/' + recordId,
    method: 'delete'
  })
}

// 快速新建批记录（不弹窗）
export function createBatchRecord() {
  return request({
    url: '/batch/batch_record/create',
    method: 'post'
  })
}

// 导入外部生产指令单（回填批记录）
export function importBatchOrder(recordId, file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/batch/batch_order/import/' + recordId,
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 生成批记录
export function generateBatchRecord(data) {
  return request({
    url: '/batch/batch_record/generate',
    method: 'post',
    data: data
  })
}
