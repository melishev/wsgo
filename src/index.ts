import { type WSGOEventName, type WSGOConfig, type WSGOSubscriptions } from './types'

import { type WSGOSubscribeCallback } from './subscribe'

import { send } from './send'
import { subscribe } from './subscribe'
import { heartbeatStart, heartbeatStop, listenHeartbeat } from './heartbeat'

/** Method allows you create new WebSocket connection */
export default function create(
  url: string,
  config: Partial<WSGOConfig> = {},
): {
  ws: WebSocket | undefined
  // status: 'OPEN' | 'CLOSED' | 'CONNECTING'

  open: () => void
  close: () => void
  send: (eventName: WSGOEventName, data?: Parameters<typeof send>[1]) => void
  subscribe: <T>(eventName: WSGOEventName, callback: WSGOSubscribeCallback<T>) => void
} {
  let ws: WebSocket | undefined
  const subscriptions: WSGOSubscriptions = {}

  const _config = config as WSGOConfig
  for (const option of ['debugging', 'immediate', 'heartbeat'] as Array<keyof typeof config>) {
    if (_config[option] !== undefined) continue

    if (option === 'debugging') {
      _config[option] = false
      continue
    }

    if (option === 'immediate' || option === 'heartbeat') {
      _config[option] = true
      continue
    }
  }

  if (_config.immediate) {
    ws = open(url, _config)

    if (ws !== undefined) {
      _listen(ws, subscriptions, _config)
    }
  }

  return {
    get ws() {
      return ws
    },
    open: () => {
      ws = open(url, _config)

      if (ws !== undefined) {
        _listen(ws, subscriptions, _config)
      }
    },
    close: () => {
      close(ws)
    },
    send: (...args) => {
      send(...args, ws, _config)
    },
    subscribe: (...args) => {
      subscribe(subscriptions, ...args)
    },
  }
}

function open(url: string, _config: WSGOConfig): WebSocket {
  // close()

  const ws = new WebSocket(url)

  // if (config.heartbeat) {
  //   heartbeatStart(ws)
  // }

  return ws
}

function _listen(ws: WebSocket, subscriptions: WSGOSubscriptions, _config: WSGOConfig): void {
  ws.onopen = (ev) => {
    _config.onConnected?.(ws, ev)

    heartbeatStart(ws)
  }

  ws.onclose = (ev) => {
    _config.onDisconnected?.(ws, ev)

    heartbeatStop()
  }

  ws.onerror = (ev) => {
    _config.onError?.(ws, ev)
  }

  ws.onmessage = (e: MessageEvent<any>): any => {
    listenHeartbeat(ws, e)

    let message

    try {
      message = JSON.parse(e.data)
    } catch (e) {
      if (_config.debugging) {
        console.error(e)
      }

      return
    }

    if (_config.debugging) {
      if (message.event === 'exception') {
        console.error(message.data)
      } else {
        const { event, data, time } = message
        console.log(`%c${new Date(time).toLocaleTimeString()}%c`, 'color: gray', '', event, data)
      }
    }

    if (message.event in subscriptions) {
      subscriptions[message.event](message)
    }
  }
}

function close(ws?: WebSocket, ...[code = 1000, reason]: Parameters<WebSocket['close']>): void {
  if (ws === undefined) return

  // stop heartbeat interval
  heartbeatStop()

  // close websocket connection
  ws.close(code, reason)
}
