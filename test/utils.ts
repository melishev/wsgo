import ws from 'ws'

export function createMockWSServer(port: number = 0): { server: ws.WebSocketServer; port: number } {
  let server = new ws.WebSocketServer({ port })

  server.on('connection', (ws) => {
    ws.on('message', (data, isBinary) => {
      const parsedData = isBinary ? data : (JSON.parse(data.toString()) as any)

      if (parsedData.event === 'ping') {
        const message = { event: 'pong', timeSended: Date.now() }
        ws.send(JSON.stringify(message))
      }

      const message = { ...data, timeSended: Date.now() }

      // setTimeout(() => {
      //   ws.send(JSON.stringify(message))
      // }, 1000)
      ws.send(JSON.stringify(message))
    })
  })

  return {
    server,
    port: (server.address() as ws.AddressInfo).port,
  }
}
