import { heartbeatStop } from './heartbeat'

export function close(ws: WebSocket, ...[code = 1000, reason]: Parameters<WebSocket['close']>): void {
  if (ws === undefined) return

  // stop heartbeat interval
  heartbeatStop()

  // close websocket connection
  ws.close(code, reason)
}
