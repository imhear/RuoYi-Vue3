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

/**
 * 从领料单同步物料到 Step4 子表
 *
 * 关联链路：主表.instance_id = biz_receiving.instance_id
 *          AND biz_receiving.workshop = {workshop}
 * 多个 biz_receiving 取 create_time 升序第 1 条。
 * 领料单明细按 seq_no 升序取前 4 条；step4 按 seq_no 匹配更新。
 *
 * @param {Number} recordId 主表主键
 * @param {String} workshop 车间过滤条件（D=消毒 F=灌装 P=包装）
 */
export function syncMaterialFromReceiving(recordId, workshop) {
  return request({
    url: '/bizdata/bizDisinfectionPackaging1/syncMaterialFromReceiving/' + recordId,
    method: 'post',
    params: { workshop: workshop }
  })
}
