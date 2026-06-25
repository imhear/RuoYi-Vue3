import request from '@/utils/request'

// 查询灌装批记录列表
export function listGzpjl(query) {
  return request({
    url: '/system/gzpjl/list',
    method: 'get',
    params: query
  })
}

// 查询灌装批记录详细
export function getGzpjl(deptId) {
  return request({
    url: '/system/gzpjl/' + deptId,
    method: 'get'
  })
}

// 新增灌装批记录
export function addGzpjl(data) {
  return request({
    url: '/system/gzpjl',
    method: 'post',
    data: data
  })
}

// 修改灌装批记录
export function updateGzpjl(data) {
  return request({
    url: '/system/gzpjl',
    method: 'put',
    data: data
  })
}

// 删除灌装批记录
export function delGzpjl(deptId) {
  return request({
    url: '/system/gzpjl/' + deptId,
    method: 'delete'
  })
}
