export type PromiseRejectionEventInit = {
  promise: Promise<any>
  reason: any
}

export class PromiseRejectionEvent extends Event {
  public readonly reason: any
  public readonly promise: Promise<any>
  constructor(type: string, eventInitDict: PromiseRejectionEventInit) {
    super(type)
    this.promise = eventInitDict.promise
    this.reason = eventInitDict.reason
  }
}
