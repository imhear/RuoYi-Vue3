import { defineStore } from 'pinia'

/**
 * 基础数据分类缓存 Store
 * 
 * 设计目标：
 * 1. 与若依官方 useDictStore 架构对齐，缓存放在 Pinia Store 中跨组件共享
 * 2. 显式支持并发去重：多个组件同时请求同一个 key 时，只发一个 HTTP 请求
 * 
 * 缓存结构：
 * - cache：已加载完成的数据，数组结构 { key, data }，与官方 useDictStore 一致
 * - pending：进行中的请求，对象结构 { key: Promise }，用于并发去重
 * 
 * key 约定：`${apiUrl}::${categoryCode}`
 * 之所以是二维 key，因为基础数据的过滤维度是 (接口, 物料大类)，缺一不可。
 */
const useBaseCategoryStore = defineStore(
  'baseCategory',
  {
    state: () => ({
      /** 已加载完成的缓存数据：[{ key, data }] */
      cache: [],
      /** 进行中的请求：{ key: Promise }，请求完成后清除 */
      pending: {}
    }),

    actions: {
      /**
       * 获取缓存数据
       * @param {String} key 缓存键
       * @returns {Array|null} 缓存数据，未命中返回 null
       */
      get(key) {
        if (key == null || key === '') return null
        for (let i = 0; i < this.cache.length; i++) {
          if (this.cache[i].key === key) {
            return this.cache[i].data
          }
        }
        return null
      },

      /**
       * 设置缓存数据
       * @param {String} key 缓存键
       * @param {Array} data 数据
       */
      set(key, data) {
        if (key !== null && key !== '') {
          this.cache.push({ key, data })
        }
      },

      /**
       * 删除指定缓存
       * @param {String} key 缓存键
       * @returns {Boolean} 是否删除成功
       */
      remove(key) {
        for (let i = 0; i < this.cache.length; i++) {
          if (this.cache[i].key === key) {
            this.cache.splice(i, 1)
            return true
          }
        }
        return false
      },

      /**
       * 清空所有缓存
       */
      clear() {
        this.cache = []
        this.pending = {}
      },

      /**
       * 带并发去重的加载方法
       * 
       * 执行流程：
       * 1. 已缓存 → 直接返回缓存数据
       * 2. 进行中 → await 同一个 Promise，避免重复请求
       * 3. 均无 → 发起新请求，写入 pending，请求完成后写入 cache 并清除 pending
       * 
       * @param {String} key 缓存键
       * @param {Function} requestFn 请求函数，返回 Promise<Array>
       * @returns {Promise<Array>} 数据数组
       */
      async load(key, requestFn) {
        // 1. 缓存命中
        const cached = this.get(key)
        if (cached) return cached

        // 2. 请求进行中，共享同一个 Promise
        if (this.pending[key]) {
          return await this.pending[key]
        }

        // 3. 发起新请求
        const promise = requestFn()
          .then(data => {
            this.set(key, data)
            delete this.pending[key]
            return data
          })
          .catch(err => {
            // 请求失败：清除 pending，避免后续误用失败的 Promise
            delete this.pending[key]
            throw err
          })

        this.pending[key] = promise
        return await promise
      }
    }
  })

export default useBaseCategoryStore