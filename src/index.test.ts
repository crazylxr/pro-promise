import { describe, expect, test } from '@jest/globals';
import ProPromise from './index'; // 请将路径替换为你的实际文件路径

describe('ProPromise', () => {
    test('should promisify a function correctly', async () => {
        function sampleAsyncFunction(callback: Function) {
            setTimeout(() => {
                callback(null, 'Success');
            }, 100);
        }

        const promisifiedFunction = ProPromise.promisify(sampleAsyncFunction);
        const result = await promisifiedFunction();

        expect(result).toBe('Success');
    });

    test('should handle a promise timeout correctly', async () => {
        const promise = new ProPromise<string>((resolve) => {
            setTimeout(() => {
                resolve('Resolved');
            }, 200);
        });

        try {
            await promise.timeout(100);
        } catch (e: unknown) {
            const error = e as { message: string};
            expect(error.message).toBe('Promise timed out');
        }
    });


  describe('chain', () => {
    test('should execute and collect results from an array of Promises', async () => {
      const promises = [
        () => Promise.resolve(1),
        () => Promise.resolve(2),
        () => Promise.resolve(3),
      ];

      const results = await ProPromise.chain<number>(promises);

      expect(results).toEqual([1, 2, 3]);
    });

    test('should handle errors in the Promise chain', async () => {
      const promises = [
        () => Promise.resolve(1),
        () => Promise.reject('Error occurred'),
        () => Promise.resolve(3),
      ];

      try {
        await ProPromise.chain<number>(promises);
      } catch (error) {
        expect(error).toBe('Error occurred');
      }
    });
  });

  describe('concurrency', () => {
    test('should execute Promises with specified concurrency', async () => {
      const promises = [
        () => Promise.resolve(1),
        () => Promise.resolve(2),
        () => Promise.resolve(3),
        () => Promise.resolve(4),
      ];

      const results = await ProPromise.concurrency<number>(promises, 2);

      expect(results).toEqual([1, 2, 3, 4]);
    });
  });
});
