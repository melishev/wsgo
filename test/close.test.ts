import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import WSGO from '../src/index'
import ws from 'ws'

describe('close', () => {
  let port = 0
  let server: ws.Server

  beforeAll(() => {
    server = new ws.WebSocketServer({ port })

    server.on('connection', (ws) => {
      ws.on('message', (data, isBinary) => {
        const message = isBinary ? data : data.toString()
        ws.send(message)
      })
    })

    port = (server.address() as ws.AddressInfo).port
  })

  afterAll(() => {
    server.close()
  })

  it('should close the WebSocket when it is not already open', () => {
    // Arrange
    const wsgo = WSGO(`ws://localhost:${port}`)

    // Act
    wsgo.close()

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CLOSING)
  })
})
