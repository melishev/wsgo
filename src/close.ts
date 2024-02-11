import { heartbeatStop } from './heartbeat'
import type { WSGOConfig } from './types'

export function close(ws: WebSocket, _config: WSGOConfig, ...[code = 1000, reason]: Parameters<WebSocket['close']>): void {
  if (_config.heartbeat) {
    // stop heartbeat interval
    heartbeatStop()
  }

  // close websocket connection
  ws.close(code, reason)
}
