export type WSGOSubscriptions = Record<string, (message: any) => any>

export interface WSGOConfig {
  onConnected?: (ws: WebSocket, event: Event) => void
  onDisconnected?: (ws: WebSocket, event: CloseEvent) => void
  onError?: (ws: WebSocket, event: Event) => void

  debugging?: boolean
  immediate?: boolean
}

export interface WSGOSubscribeRespone<T extends { serverToClientName: string; ServerToClientData: any }> {
  /** Event Name */
  event: T['serverToClientName']
  /** Event data */
  data: T['ServerToClientData']
  /** Time when the server sent the event */
  timeSended: number
  /** Time when the client received the event */
  timeReceived: number
}

export type WSGOHeartbeat =
  | boolean
  | {
      /**
       * Message for the heartbeat
       *
       * @default 'ping'
       */
      message?: string | ArrayBuffer | Blob

      /**
       * Interval, in milliseconds
       *
       * @default 1000
       */
      interval?: number

      /**
       * Heartbeat response timeout, in milliseconds
       *
       * @default 1000
       */
      pongTimeout?: number
    }
