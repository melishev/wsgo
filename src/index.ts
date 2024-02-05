import { type WSGOConfig, type WSGOSubscribeRespone, type WSGOSubscriptions } from './types'
import { type RemoveFirstFromTuple } from './types/utils'

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
  send: (...args: RemoveFirstFromTuple<Parameters<typeof send>>) => void
  subscribe: (...args: RemoveFirstFromTuple<Parameters<typeof subscribe>>) => void
} {
  let ws: WebSocket | undefined
  const subscriptions: WSGOSubscriptions = {}

  if (config?.immediate ?? true) {
    ws = open(url, config)

    if (ws !== undefined) {
      _listen(ws, subscriptions)
    }
  }

  return {
    ws,
    open: () => {
      ws = open(url, config)

      if (ws !== undefined) {
        _listen(ws, subscriptions)
      }
    },
    close: () => {
      close(ws)
    },
    send: (...args: RemoveFirstFromTuple<Parameters<typeof send>>): ReturnType<typeof send> => {
      send(ws, ...args)
    },
    subscribe: (...args: RemoveFirstFromTuple<Parameters<typeof subscribe>>): ReturnType<typeof subscribe> => {
      subscribe(subscriptions, ...args)
    },
  }
}

function open(url?: string, config?: WSGOConfig): WebSocket | undefined {
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

    const message = JSON.parse(e.data)

    if (message.event === 'exception') {
      console.error(message.data)
    } else {
      const { event, data, time } = message
      console.log(`%c${new Date(time).toLocaleTimeString()}%c`, 'color: gray', '', event, data)
    }

    if (message.event in subscriptions) {
      subscriptions[message.event](message)
    }
  }
}

function close(ws?: WebSocket, ...[code = 1000, reason]: Parameters<typeof ws.close>): void {
  if (ws === undefined) return

  // stop heartbeat interval

  // close websocket connection
  ws.close(code, reason)
}

/** Method allows you to send an event to the server */
function send(ws?: WebSocket, eventName: string, data?: any): void {
  if (ws === undefined) return

  // start debug logging
  const timeout = 100
  console.group(eventName, data)

  ws.send(JSON.stringify({ event: eventName, data }))

  // stop debug logging
  setTimeout(() => {
    console.groupEnd()
  }, timeout)
}

/** Method allows you to subscribe to listen to a specific event */
function subscribe(
  subscriptions: WSGOSubscriptions,
  eventName: string,
  callback: (message: WSGOSubscribeRespone<any>) => any,
): void {
  if (eventName in subscriptions) return

  Object.assign(subscriptions, { [eventName]: callback })
}
