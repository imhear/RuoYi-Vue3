/**
 * 业务字典 Pinia Store
 * 
 * 完全参照若依官方 store/modules/dict.js，仅 store 名称改为 bizDict。
 * 与官方字典 store 物理隔离，独立维护。
 */
const useBizDictStore = defineStore(
  'bizDict',
  {
    state: () => ({
      dict: new Array()
    }),
    actions: {
      // 获取业务字典
      getDict(_key) {
        if (_key == null && _key == "") {
          return null
        }
        try {
          for (let i = 0; i < this.dict.length; i++) {
            if (this.dict[i].key == _key) {
              return this.dict[i].value
            }
          }
        } catch (e) {
          return null
        }
      },
      // 设置业务字典
      setDict(_key, value) {
        if (_key !== null && _key !== "") {
          this.dict.push({
            key: _key,
            value: value
          })
        }
      },
      // 删除业务字典
      removeDict(_key) {
        var bln = false
        try {
          for (let i = 0; i < this.dict.length; i++) {
            if (this.dict[i].key == _key) {
              this.dict.splice(i, 1)
              return true
            }
          }
        } catch (e) {
          bln = false
        }
        return bln
      },
      // 清空业务字典
      cleanDict() {
        this.dict = new Array()
      },
      // 初始业务字典
      initDict() {
      }
    }
  })

export default useBizDictStore