import type { WSGOHeartbeat } from './heartbeat/types'

export type WSGOEventName = string

export type WSGOSubscriptions = Record<string, (message: any) => any>

export interface WSGOConfig {
  onConnected?: (ws: WebSocket, event: Event) => void
  onDisconnected?: (ws: WebSocket, event: CloseEvent) => void
  onError?: (ws: WebSocket, event: Event) => void

  debugging: boolean
  immediate: boolean
  heartbeat: WSGOHeartbeat
}

export interface WSGOMessage<T> {
  /** Event name */
  event: WSGOEventName
  /** Event data */
  data: T
  /** Time when the server sent the event */
  timeSended: number
}