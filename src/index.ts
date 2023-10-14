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
}
