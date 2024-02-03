export type Subscriptions = Record<string, (message: any) => any>

export interface WSRespone<T extends { serverToClientName: string, ServerToClientData: any }> {
  event: T['serverToClientName']
  data: T['ServerToClientData']
  time: number

  /** Время когда сервер отправил событие */
  timefromServer: number
}
