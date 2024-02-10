import { send } from './send'
import type { WSGOConfig } from './types'

const heartbeatMessage = 'ping'
const heartbeatInterval = 1000

let heartbeatTimeout: ReturnType<typeof setTimeout> | undefined

export function heartbeatStart(ws: WebSocket, _config: WSGOConfig): void {
  heartbeatStop()

  heartbeatTimeout = setTimeout(() => {
    send(ws, _config, heartbeatMessage, heartbeatMessage)
  }, heartbeatInterval)
}

export function heartbeatStop(): void {
  clearTimeout(heartbeatTimeout)
  heartbeatTimeout = undefined
}

export function listenHeartbeat(ws: WebSocket, _config: WSGOConfig, e: MessageEvent<any>): void {
  if (e.data === heartbeatMessage) {
    heartbeatStart(ws, _config)
    // eslint-disable-next-line no-useless-return
    return
  }
}
