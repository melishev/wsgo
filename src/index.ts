import { type Subscriptions } from './types'
import { type RemoveFirstFromTuple } from './types/utils'

/** Method allows you create new WebSocket connection */
const create = (
  url: string,
): {
  send: (...args: RemoveFirstFromTuple<Parameters<typeof send>>) => void
  subscribe: (...args: RemoveFirstFromTuple<Parameters<typeof subscribe>>) => void
} => {
  const ws = new WebSocket(url)
  const subscriptions: Subscriptions = {}

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

  return {
    send: (...args: RemoveFirstFromTuple<Parameters<typeof send>>): ReturnType<typeof send> => {
      send(ws, ...args)
    },
    subscribe: (...args: RemoveFirstFromTuple<Parameters<typeof subscribe>>): ReturnType<typeof subscribe> => {
      subscribe(subscriptions, ...args)
    },
  }
}

/** Method allows you to send an event to the server */
function send(ws: WebSocket, eventName: string, data?: any): void {
  const timeout = 100

  console.group(eventName, data)
  ws.send(JSON.stringify({ event: eventName, data }))
  setTimeout(() => {
    console.groupEnd()
  }, timeout)
}

/** Method allows you to subscribe to listen to a specific event */
function subscribe(subscriptions: Subscriptions, eventName: string, callback: (message: any) => any): void {
  if (eventName in subscriptions) return

  Object.assign(subscriptions, { [eventName]: callback })
}

export default create
