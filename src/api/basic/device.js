import request from '@/utils/request'

// 查询设备列表
export function listDevice(query) {
  return request({
    url: '/basic/device/list',
    method: 'get',
    params: query
  })
}

// 查询设备详细
export function getDevice(id) {
  return request({
    url: '/basic/device/' + id,
    method: 'get'
  })
}

// 新增设备
export function addDevice(data) {
  return request({
    url: '/basic/device',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updateDevice(data) {
  return request({
    url: '/basic/device',
    method: 'put',
    data: data
  })
}

// 删除设备
export function delDevice(id) {
  return request({
    url: '/basic/device/' + id,
    method: 'delete'
  })
}

/**
 * 按工作单元查询设备下拉选项
 *
 * 业务表单调用，优先传 workUnitId，其次 workUnitCode。
 *
 * @param {Object} params { workUnitId?, workUnitCode? }
 */
export function listDeviceOptions(params) {
  return request({
    url: '/basic/device/options',
    method: 'get',
    params
  })
}