import request from '@/utils/request'

/** 查询详情 */
export function getBizFillingRecord1Detail(recordId) {
  return request({
    url: '/bizdata/biz_filling_record_1/detail/' + recordId,
    method: 'get'
  })
}