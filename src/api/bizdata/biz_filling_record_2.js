import request from '@/utils/request'

/** 查询灌装生产记录2列表 */
export function listBizFillingRecord2(query) {
  return request({
    url: '/bizdata/biz_filling_record_2/list',
    method: 'get',
    params: query
  })
}

/** 查询灌装生产记录2详细（仅主表） */
export function getBizFillingRecord2(recordId) {
  return request({
    url: '/bizdata/biz_filling_record_2/' + recordId,
    method: 'get'
  })
}

/** 新增灌装生产记录2 */
export function addBizFillingRecord2(data) {
  return request({
    url: '/bizdata/biz_filling_record_2',
    method: 'post',
    data
  })
}

/** 修改灌装生产记录2 */
export function updateBizFillingRecord2(data) {
  return request({
    url: '/bizdata/biz_filling_record_2',
    method: 'put',
    data
  })
}

/** 删除灌装生产记录2 */
export function delBizFillingRecord2(recordId) {
  return request({
    url: '/bizdata/biz_filling_record_2/' + recordId,
    method: 'delete'
  })
}

/**
 * 查询灌装生产记录2详情（含 mainList 4 行 + 每行 subList 12 行）
 * @param {Number} recordId 业务主表主键
 */
export function getBizFillingRecord2Detail(recordId) {
  return request({
    url: '/bizdata/biz_filling_record_2/detail/' + recordId,
    method: 'get'
  })
}

/**
 * 保存灌装生产记录2编辑（主表 + 4行子表 + 48行孙表逐条 update）
 * @param {Number} recordId 业务主表主键
 * @param {Number} menuId 按钮节点ID（用于日志写入）
 * @param {Object} data 完整记录数据（含 mainList 及其 subList）
 */
export function editBizFillingRecord2(recordId, menuId, data) {
  return request({
    url: '/bizdata/biz_filling_record_2/edit/' + recordId,
    method: 'post',
    params: { menuId },
    data
  })
}