import request from '@/utils/request'

// 查询灌装包材处理记录1明细列表
export function listDisPack1Item(query) {
  return request({
    url: '/bottling/disPack1Item/list',
    method: 'get',
    params: query
  })
}

// 查询灌装包材处理记录1明细详细
export function getDisPack1Item(itemId) {
  return request({
    url: '/bottling/disPack1Item/' + itemId,
    method: 'get'
  })
}

// 新增灌装包材处理记录1明细
export function addDisPack1Item(data) {
  return request({
    url: '/bottling/disPack1Item',
    method: 'post',
    data: data
  })
}

// 修改灌装包材处理记录1明细
export function updateDisPack1Item(data) {
  return request({
    url: '/bottling/disPack1Item',
    method: 'put',
    data: data
  })
}

// 删除灌装包材处理记录1明细
export function delDisPack1Item(itemId) {
  return request({
    url: '/bottling/disPack1Item/' + itemId,
    method: 'delete'
  })
}
