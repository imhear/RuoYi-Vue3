import request from '@/utils/request'

// 查询灌装包材处理记录1列表
export function listBizDisinfectionPackaging1(query) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录1详细
export function getBizDisinfectionPackaging1(recordId) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1/' + recordId,
    method: 'get'
  })
}

// 新增灌装包材处理记录1
export function addBizDisinfectionPackaging1(data) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录1
export function updateBizDisinfectionPackaging1(data) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录1
export function delBizDisinfectionPackaging1(recordId) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1/' + recordId,
    method: 'delete'
  })
}

/**
 * 查询灌装包材处理记录1详情（含 step4List）
 * @param {Number} recordId 业务主表主键
 */
export function getBizDisinfectionPackaging1Detail(recordId) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1/detail/' + recordId,
    method: 'get'
  })
}

/**
 * 保存灌装包材处理记录1编辑（更新主表 + step4 子表逐条 update/insert）
 * @param {Number} recordId 业务主表主键
 * @param {Number} menuId 按钮节点ID（用于日志写入）
 * @param {Object} data 记录数据（含 step4List）
 */
export function editBizDisinfectionPackaging1(recordId, menuId, data) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1/edit/' + recordId,
    method: 'post',
    params: { menuId: menuId },
    data: data
  })
}
