import { type WSGOEventName, type WSGOConfig, type WSGOSubscriptions } from './types'

import { open } from './open'
import { close } from './close'
import { send } from './send'
import type { WSGOSendData } from './send/types'
import { subscribe } from './subscribe'
import type { WSGOSubscribeCallback } from './subscribe/types'
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
  send: (eventName: WSGOEventName, data?: WSGOSendData) => void
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
      if (ws === undefined) return

      close(ws)
    },
    send: (...args) => {
      if (ws === undefined) return

      send(ws, _config, ...args)
    },
    subscribe: (...args) => {
      subscribe(...args, subscriptions, _config)
    },
  }
}

function _listen(ws: WebSocket, subscriptions: WSGOSubscriptions, _config: WSGOConfig): void {
  ws.onopen = (ev) => {
    _config.onConnected?.(ws, ev)

    heartbeatStart(ws, _config)
  }

  ws.onclose = (ev) => {
    _config.onDisconnected?.(ws, ev)

    heartbeatStop()
  }

  ws.onerror = (ev) => {
    _config.onError?.(ws, ev)
  }

  ws.onmessage = (e: MessageEvent<any>): any => {
    listenHeartbeat(ws, _config, e)

    let message

    try {
      message = JSON.parse(e.data)
    } catch (e) {
      if (_config.debugging) {
        console.error(e)
      }

      return
    }

    if (message.event in subscriptions) {
      subscriptions[message.event](message)
    }
  }
}
