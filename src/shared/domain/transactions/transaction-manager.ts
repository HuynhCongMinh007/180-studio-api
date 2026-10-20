export abstract class TransactionManager {
  abstract run<R>(callback: () => Promise<R>): Promise<R>
}
