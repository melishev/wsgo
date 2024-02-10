import { send } from './send'

const heartbeatMessage = 'ping'
const heartbeatInterval = 1000

let heartbeatTimeout: ReturnType<typeof setTimeout> | undefined

export function heartbeatStart(ws: WebSocket): void {
  heartbeatStop()

  heartbeatTimeout = setTimeout(() => {
    send(heartbeatMessage, heartbeatMessage, ws)
  }, heartbeatInterval)
}

export function heartbeatStop(): void {
  clearTimeout(heartbeatTimeout)
  heartbeatTimeout = undefined
}

export function listenHeartbeat(ws: WebSocket, e: MessageEvent<any>): void {
  if (e.data === heartbeatMessage) {
    heartbeatStart(ws)
    // eslint-disable-next-line no-useless-return
    return
  }
}
