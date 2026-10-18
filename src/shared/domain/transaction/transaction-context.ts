import { AsyncLocalStorage } from 'node:async_hooks'

const storage = new AsyncLocalStorage<unknown>()

export function runInTransaction<R>(
  tx: unknown,
  callback: () => Promise<R>,
): Promise<R> {
  return storage.run(tx, callback)
}

export function getTx<T = unknown>(): T | undefined {
  return storage.getStore() as T | undefined
}
