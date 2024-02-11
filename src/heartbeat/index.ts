import { send } from '../send'
import type { WSGOConfig, WSGOMessage } from '../types'

const heartbeatMessage = 'ping'
const heartbeatInterval = 1000
const heartbeatTimeout = 1000

let heartbeatTimeoutWait: ReturnType<typeof setTimeout> | undefined

export function heartbeatStart(ws: WebSocket, _config: WSGOConfig): void {
  setTimeout(() => {
    send(ws, _config, heartbeatMessage, heartbeatMessage)
    heartbeatTimeoutWait = setTimeout(() => {
      // open()
      ws.close()
    }, heartbeatInterval + heartbeatTimeout)
  }, heartbeatInterval)
}

export function heartbeatListen(ws: WebSocket, _config: WSGOConfig, e: WSGOMessage<any>): void {
  if (e.event === 'pong') {
    heartbeatStop()
    heartbeatStart(ws, _config)
    // eslint-disable-next-line no-useless-return
    return
  }
}

export function heartbeatStop(): void {
  clearTimeout(heartbeatTimeoutWait)
  heartbeatTimeoutWait = undefined
}
