import request from '@/utils/request'

// 查询灌装量记录列表
export function listFillingMain(query) {
  return request({
    url: '/bottling/fillingMain/list',
    method: 'get',
    params: query
  })
}

// 查询灌装量记录详细
export function getFillingMain(mainId) {
  return request({
    url: '/bottling/fillingMain/' + mainId,
    method: 'get'
  })
}

// 新增灌装量记录
export function addFillingMain(data) {
  return request({
    url: '/bottling/fillingMain',
    method: 'post',
    data: data
  })
}

// 修改灌装量记录
export function updateFillingMain(data) {
  return request({
    url: '/bottling/fillingMain',
    method: 'put',
    data: data
  })
}

// 删除灌装量记录
export function delFillingMain(mainId) {
  return request({
    url: '/bottling/fillingMain/' + mainId,
    method: 'delete'
  })
}
