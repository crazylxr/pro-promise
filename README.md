# pro-promise

ProPromise 是一个 JavaScript/TypeScript 库，它通过添加超时功能并提供将回调风格的函数转换为 Promise 的实用程序，扩展了原生 Promise 的功能。

[![NPM version](https://img.shields.io/npm/v/pro-promise.svg?style=flat)](https://npmjs.org/package/pro-promise)
[![NPM downloads](http://img.shields.io/npm/dm/pro-promise.svg?style=flat)](https://npmjs.org/package/pro-promise)

## 安装

你可以通过 npm 安装 ProPromise：

```bash
npm install pro-promise
```

## 使用

### 超时功能

ProPromise 允许你为 Promise 设置超时，确保它不会无限期等待。你可以像这样使用它：

```typescript
import Promise from 'pro-promise'

const myPromise = new Promise((resolve, reject) => {
  // 模拟异步操作
  setTimeout(() => {
    resolve('Promise 成功解决')
  }, 2000)
})

// 设置 1500 毫秒的超时
myPromise
  .timeout(1500)
  .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.error(error)
  })
```

### 将回调风格函数转换为 Promise

ProPromise 提供了一个静态方法 promisify，用于将回调风格的函数转换为 Promise。以下是一个示例：

```typescript
import Promise from 'pro-promise'

function exampleCallbackFunction(callback) {
  setTimeout(() => {
    callback(null, '回调返回的数据')
  }, 1000)
}

const promisifiedFunction = Promise.promisify(exampleCallbackFunction)

promisifiedFunction()
  .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.error(error)
  })
```

### 串联执行 Promise（chain）

```typescript
import ProPromise from 'pro-promise'

const promises = [
  () => Promise.resolve(1),
  () => Promise.resolve(2),
  () => Promise.resolve(3),
]

ProPromise.chain(promises)
  .then((results) => {
    console.log(results) // 输出: [1, 2, 3]
  })
  .catch((error) => {
    console.error('Error occurred:', error)
  })
```

### 并发执行 Promise（concurrency）

```typescript
import ProPromise from 'pro-promise'

const promises = [
  () => Promise.resolve(1),
  () => Promise.resolve(2),
  () => Promise.resolve(3),
  // 可以添加更多的异步操作函数
]

ProPromise.concurrency(promises, 2)
  .then((results) => {
    console.log(results) // 输出并发执行后的结果数组
  })
  .catch((error) => {
    console.error('Error occurred:', error)
  })
```

## API

### ProPromise<T>

`ProPromise` 类扩展了原生的 `Promise` 类。它接受一个执行函数并提供了额外的方法：

- `timeout(ms: number): ProPromise<T>`：为 `Promise` 添加超时。如果 `Promise` 在指定时间内不解决或拒绝，它将使用超时错误拒绝。

- `static promisify<T>(fn: (...args: any[]) => void): (...args: any[]) => ProPromise<T>`：用于将回调风格函数转换为 `Promise` 的静态方法。
- `chain<T>(promises: (() => Promise<T>)[]): Promise<T[]>`：依次执行一组返回 Promise 的函数，并收集它们的结果。
- `concurrency<T>(promises: (() => Promise<T>)[], concurrency: number): Promise<T[]>`：并发执行一组 Promise，限制并发数为指定数量。

## 许可证

该项目基于 MIT 许可证进行许可。有关详细信息，请参阅 LICENSE 文件。

## 贡献

如果您想为 ProPromise 做出贡献，请打开一个问题或提交一个拉取请求。我们欢迎您的意见和贡献。
