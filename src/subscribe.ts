import { type WSGOSubscriptions } from './types'

type WSGOSubscribeCallback<T> = (message: WSGOSubscribeResponse<T>) => any

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

/** Method allows you to subscribe to listen to a specific event */
export function subscribe<T>(
  subscriptions: WSGOSubscriptions,
  eventName: string,
  callback: WSGOSubscribeCallback<T>,
): void {
  if (eventName in subscriptions) return

  Object.assign(subscriptions, { [eventName]: callback })
}
