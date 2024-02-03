export type Subscriptions = { [x: string]: (message: any) => any }

export interface WSRespone<T extends { serverToClientName: string; ServerToClientData: {} }> {
  event: T['serverToClientName']
  data: T['ServerToClientData']
  time: number

  /** Время когда сервер отправил событие */
  timefromServer: number
}