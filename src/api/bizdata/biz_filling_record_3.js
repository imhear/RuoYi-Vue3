import request from '@/utils/request'

/** 查询灌装生产记录3列表 */
export function listBizFillingRecord3(query) {
  return request({
    url: '/bizdata/biz_filling_record_3/list',
    method: 'get',
    params: query
  })
}

/** 查询灌装生产记录3详细（仅主表） */
export function getBizFillingRecord3(recordId) {
  return request({
    url: '/bizdata/biz_filling_record_3/' + recordId,
    method: 'get'
  })
}

/** 新增灌装生产记录3 */
export function addBizFillingRecord3(data) {
  return request({
    url: '/bizdata/biz_filling_record_3',
    method: 'post',
    data: data
  })
}

/** 修改灌装生产记录3 */
export function updateBizFillingRecord3(data) {
  return request({
    url: '/bizdata/biz_filling_record_3',
    method: 'put',
    data: data
  })
}

/** 删除灌装生产记录3 */
export function delBizFillingRecord3(recordId) {
  return request({
    url: '/bizdata/biz_filling_record_3/' + recordId,
    method: 'delete'
  })
}

/**
 * 查询灌装生产记录3详情（含主表、包材统计4行、不合格统计6行）
 * @param {Number} recordId 业务主表主键
 */
export function getBizFillingRecord3Detail(recordId) {
  return request({
    url: '/bizdata/biz_filling_record_3/detail/' + recordId,
    method: 'get'
  })
}

/**
 * 保存灌装生产记录3编辑（主表 + 子表，严格校验纯 update）
 * @param {Number} recordId 业务主表主键
 * @param {Number} menuId 按钮节点ID（用于日志写入）
 * @param {Object} data 完整记录数据（含 step5List, step6List）
 */
export function editBizFillingRecord3(recordId, menuId, data) {
  return request({
    url: '/bizdata/biz_filling_record_3/edit/' + recordId,
    method: 'post',
    params: { menuId: menuId },
    data: data
  })
}

/**
 * 从领料单同步包材数据到 Step5 和 Step6 的包材行
 * @param {Number} recordId 业务主表主键
 * @param {String} workshop 领料单所属车间（固定传 'D'）
 */
export function syncMaterialFromReceiving(recordId, workshop) {
  return request({
    url: '/bizdata/biz_filling_record_3/syncMaterialFromReceiving/' + recordId,
    method: 'post',
    params: { workshop: workshop }
  })
}