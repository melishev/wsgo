import type { WSGOMessage } from '../types'

export interface WSGOSubscribeResponse<T = any> extends WSGOMessage<T> {
  /** Time when the client received the event */
  timeReceived: number
}

export type WSGOSubscribeCallback<T> = (message: WSGOSubscribeResponse<T>) => any
