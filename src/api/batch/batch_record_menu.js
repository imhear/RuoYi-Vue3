import request from '@/utils/request'

// 查询批记录结构列表
export function listBatch_record_menu(query) {
  return request({
    url: '/batch/batch_record_menu/list',
    method: 'get',
    params: query
  })
}

// 查询批记录结构详细
export function getBatch_record_menu(menuId) {
  return request({
    url: '/batch/batch_record_menu/' + menuId,
    method: 'get'
  })
}

// 新增批记录结构
export function addBatch_record_menu(data) {
  return request({
    url: '/batch/batch_record_menu',
    method: 'post',
    data: data
  })
}

// 修改批记录结构
export function updateBatch_record_menu(data) {
  return request({
    url: '/batch/batch_record_menu',
    method: 'put',
    data: data
  })
}

// 删除批记录结构
export function delBatch_record_menu(menuId) {
  return request({
    url: '/batch/batch_record_menu/' + menuId,
    method: 'delete'
  })
}
