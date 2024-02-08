import { type WSGOConfig, type WSGOSubscriptions } from './types'
import { type RemoveFirstFromTuple } from './types/utils'

import { send } from './send'
import { subscribe } from './subscribe'
import { heartbeat } from './utils'

/** Method allows you create new WebSocket connection */
export default function create(
  url: string,
  config?: WSGOConfig,
): {
  ws: WebSocket | undefined
  // status: 'OPEN' | 'CLOSED' | 'CONNECTING'

  open: () => void
  close: () => void
  send: (eventName: Parameters<typeof send>[0], data?: Parameters<typeof send>[1]) => ReturnType<typeof send>
  subscribe: <T>(...args: RemoveFirstFromTuple<Parameters<typeof subscribe<T>>>) => ReturnType<typeof subscribe<T>>
} {
  let ws: WebSocket | undefined
  const subscriptions: WSGOSubscriptions = {}

  if (config?.immediate ?? true) {
    ws = open(url)

    if (ws !== undefined) {
      _listen(ws, subscriptions)
    }
  }

  return {
    get ws() {
      return ws
    },
    open: () => {
      ws = open(url)

      if (ws !== undefined) {
        _listen(ws, subscriptions)
      }
    },
    close: () => {
      close(ws)
    },
    send: (...args) => {
      send(...args, ws, config)
    },
    subscribe: (...args) => {
      subscribe(subscriptions, ...args)
    },
  }
}

function open(url?: string): WebSocket | undefined {
  if (url === undefined) return

  // close()

  const ws = new WebSocket(url)
  // initialize heartbeat interval
  heartbeat(ws)

  return ws
}

function _listen(ws: WebSocket, subscriptions: WSGOSubscriptions, config?: WSGOConfig): void {
  // TODO: если добавится логика, то можно оставить
  ws.onopen = (ev) => {
    config?.onConnected?.(ws, ev)
  }

  ws.onclose = (ev) => {
    config?.onDisconnected?.(ws, ev)
  }

  ws.onerror = (ev) => {
    config?.onError?.(ws, ev)
  }

  ws.onmessage = (e: MessageEvent<any>): any => {
    if (e.data === 'pong') return

    let message

    try {
      message = JSON.parse(e.data)
    } catch (e) {
      if (config?.debugging ?? false) {
        console.error(e)
      }

      return
    }

    if (config?.debugging ?? false) {
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

  // close websocket connection
  ws.close(code, reason)
}
