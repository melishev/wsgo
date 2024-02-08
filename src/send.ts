import { type WSGOConfig } from './types'

/** Method allows you to send an event to the server */
export function send(eventName: string, data?: any, ws?: WebSocket, config?: WSGOConfig): void {
  if (ws === undefined) return

  if (config?.debugging ?? false) {
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
