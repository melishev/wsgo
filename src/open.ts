import type { WSGOConfig } from './types'

export function open(url: string, _config: WSGOConfig): WebSocket {
  // close()

  const ws = new WebSocket(url)

  // if (config.heartbeat) {
  //   heartbeatStart(ws)
  // }

  return ws
}
