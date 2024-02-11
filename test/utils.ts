import ws from 'ws'

export function createMockWSServer(): { server: ws.WebSocketServer; port: number; turnHeartbeat: () => void } {
  let server = new ws.WebSocketServer({ port: 0 })
  let heartbeatDisabled = false

  server.on('connection', (ws) => {
    ws.on('message', (data, isBinary) => {
      const parsedData = isBinary ? data : (JSON.parse(data.toString()) as any)

      if (parsedData.event === 'ping' && !heartbeatDisabled) {
        const message = { event: 'pong', timeSended: Date.now() }
        ws.send(JSON.stringify(message))
      }

      const message = { ...parsedData, timeSended: Date.now() }

      // setTimeout(() => {
      //   ws.send(JSON.stringify(message))
      // }, 1000)
      ws.send(JSON.stringify(message))
    })
  })

  return {
    server,
    port: (server.address() as ws.AddressInfo).port,

    turnHeartbeat: () => (heartbeatDisabled = !heartbeatDisabled),
  }
}
