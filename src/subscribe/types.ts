export interface WSGOSubscribeResponse<T = any> {
  /** Event name */
  event: string
  /** Event data */
  data: T
  /** Time when the server sent the event */
  timeSended: number
  /** Time when the client received the event */
  timeReceived: number
}

export type WSGOSubscribeCallback<T> = (message: WSGOSubscribeResponse<T>) => any
