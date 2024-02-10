import type { WSGOSendData } from './types'
import type { WSGOEventName, WSGOConfig } from '../types'

/** Method allows you to send an event to the server */
export function send(ws: WebSocket, _config: WSGOConfig, eventName: WSGOEventName, data?: WSGOSendData): void {
  if (_config.debugging) {
    // start debug logging
    const timeout = 100
    console.group(eventName, data)
    // stop debug logging
    setTimeout(() => {
      console.groupEnd()
    }, timeout)
  }

  ws.send(JSON.stringify({ event: eventName, data }))
}
