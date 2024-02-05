const heartbeatMessage = 'ping'
const heartbeatInterval = 1000
// const heartbeatPongTimeout = 1000

export function heartbeat(ws: WebSocket): void {
  setInterval(() => {
    ws.send(heartbeatMessage)
  }, heartbeatInterval)
}

// export function subscribeHeartbeat(ws: WebSocket): void {
//   // ws.onmessage = (e: MessageEvent<any>): any => {
//   //   if (e.data === 'pong') return
//   //   const message = JSON.parse(e.data)
//   //   if (message.event === 'exception') {
//   //     console.error(message.data)
//   //   } else {
//   //     const { event, data, time } = message
//   //     console.log(`%c${new Date(time).toLocaleTimeString()}%c`, 'color: gray', '', event, data)
//   //   }
//   // }
// }
