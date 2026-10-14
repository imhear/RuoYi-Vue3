import request from '@/utils/request'

// 查询灌装包材处理记录2列表
export function listBizDisinfectionPackaging2(query) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录2详细
export function getBizDisinfectionPackaging2(recordId) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2/' + recordId,
    method: 'get'
  })
}

// 新增灌装包材处理记录2
export function addBizDisinfectionPackaging2(data) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录2
export function updateBizDisinfectionPackaging2(data) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录2
export function delBizDisinfectionPackaging2(recordId) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2/' + recordId,
    method: 'delete'
  })
}

/**
 * 查询灌装包材处理记录2详情（含 step5List + step6List）
 * @param {Number} recordId 业务主表主键
 */
export function getBizDisinfectionPackaging2Detail(recordId) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2/detail/' + recordId,
    method: 'get'
  })
}

/**
 * 保存灌装包材处理记录2编辑（更新主表 + step5/step6 逐条 update/insert）
 * @param {Number} recordId 业务主表主键
 * @param {Number} menuId 按钮节点ID（用于日志写入）
 * @param {Object} data 记录数据（含 step5List + step6List）
 */
export function editBizDisinfectionPackaging2(recordId, menuId, data) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2/edit/' + recordId,
    method: 'post',
    params: { menuId: menuId },
    data: data
  })
}

/**
 * 从领料单同步物料到 step5 / step6 子表
 *
 * 关联链路：主表.instance_id = biz_receiving.instance_id
 *          AND biz_receiving.workshop = {workshop}
 * 多个 biz_receiving 取 create_time 升序第 1 条。
 * 领料单明细按 seq_no 升序取前 4 条；step5/step6 按 seq_no 匹配更新。
 *
 * 注：后端同步后同时更新了 step5 与 step6，仅返回 step5List；
 *     step6List 需前端二次调用 detail 接口获取。
 *
 * @param {Number} recordId 主表主键
 * @param {String} workshop 车间过滤条件（D=消毒 F=灌装 P=包装）
 */
export function syncMaterialFromReceiving(recordId, workshop) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging2/syncMaterialFromReceiving/' + recordId,
    method: 'post',
    params: { workshop: workshop }
  })
}
