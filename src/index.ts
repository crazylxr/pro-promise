/**
 * @description 一个 promise 扩展库
 */
export default class ProPromise<T> extends Promise<T> {
  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void
    ) => void
  ) {
    super(executor)
  }

  /**
   * @description: promise 化，将回调函数转换为 promise
   * @param {Function} fn 回调函数
   */
  static promisify<T>(
    fn: (...args: any[]) => void
  ): (...args: any[]) => ProPromise<T> {
    return (...args: any[]) => {
      return new ProPromise<T>((resolve, reject) => {
        fn(...args, (err: any, data: T) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      })
    }
  }

  /**
   * @description: 超时
   * @param {number} ms 超时时间
   */
  timeout(ms: number) {
    return Promise.race([
      this, // 原始 Promise
      new ProPromise<T>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Promise timed out'))
        }, ms)
      }),
    ])
  }

  /**
   * 依次执行一组返回 Promise 的函数，并收集它们的结果。
   *
   * @param {(() => Promise<T>)[]} promises - 一组返回 Promise 的函数数组。
   * @returns {Promise<T[]>} - 返回一个 Promise，解析为执行 Promise 后得到的结果数组。
   */
  static async chain<T>(promises: (() => Promise<T>)[]): Promise<T[]> {
    const results: T[] = []

    for (const promiseFunc of promises) {
      try {
        const result = await promiseFunc()
        results.push(result)
      } catch (error) {
        // 处理可能出现的异常
        console.error('Error occurred:', error)
        // 中断串联操作，根据需要决定是否继续执行后续操作
        return Promise.reject(error) // 如果想立即中止并抛出异常
      }
    }

    return results
  }

  /**
   * @description 并发执行 promise
   * @param promises 并发的 promise 列表
   * @param concurrency 并发数
   * @returns 执行结果数组
   */
  static async concurrency<T>(
    promises: (() => Promise<T>)[],
    concurrency: number
  ): Promise<T[]> {
    const results: T[] = []
    const executing: Promise<T>[] = []

    for (const promiseFunc of promises) {
      const promise = promiseFunc()
      executing.push(promise)

      promise.then((result) => {
        results.push(result)
        executing.splice(executing.indexOf(promise), 1)
      })

      if (executing.length >= concurrency) {
        await Promise.race(executing)
      }
    }

    return Promise.all(results)
  }
}
