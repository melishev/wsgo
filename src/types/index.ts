export type WSGOSubscriptions = Record<string, (message: any) => any>

export type WSGOEventName = string

export interface WSGOConfig {
  onConnected?: (ws: WebSocket, event: Event) => void
  onDisconnected?: (ws: WebSocket, event: CloseEvent) => void
  onError?: (ws: WebSocket, event: Event) => void

  debugging: boolean
  immediate: boolean
  heartbeat: boolean
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
