import request from '@/utils/request'

// 查询灌装包材处理记录2明细列表
export function listDisPack2Item(query) {
  return request({
    url: '/bottling/disPack2Item/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录2明细详细
export function getDisPack2Item(itemId) {
  return request({
    url: '/bottling/disPack2Item/' + itemId,
    method: 'get'
  })
}

// 新增灌装包材处理记录2明细
export function addDisPack2Item(data) {
  return request({
    url: '/bottling/disPack2Item',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录2明细
export function updateDisPack2Item(data) {
  return request({
    url: '/bottling/disPack2Item',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录2明细
export function delDisPack2Item(itemId) {
  return request({
    url: '/bottling/disPack2Item/' + itemId,
    method: 'delete'
  })
}
