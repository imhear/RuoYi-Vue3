import useBizDictStore from '@/store/modules/bizDict'
import { getDicts } from '@/api/system/bizDict/data'

/**
 * 获取业务字典数据
 * 
 * 完全参照若依官方 utils/dict.js，仅：
 * - 函数名 useDict → useBizDict
 * - store 引用 useDictStore → useBizDictStore
 * - 接口 getDicts 来自 api/system/bizDict/data
 * 
 * 使用示例：
 * const { batch_log_action_type } = useBizDict('batch_log_action_type')
 */
export function useBizDict(...args) {
  const res = ref({})
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = []
      const dicts = useBizDictStore().getDict(dictType)
      if (dicts) {
        res.value[dictType] = dicts
      } else {
        getDicts(dictType).then(resp => {
          res.value[dictType] = resp.data.map(p => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass }))
          useBizDictStore().setDict(dictType, res.value[dictType])
        })
      }
    })
    return toRefs(res.value)
  })()
}