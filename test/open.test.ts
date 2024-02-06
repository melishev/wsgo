import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import WSGO from '../src/index'
import ws from 'ws'

describe('open', () => {
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

  it('should open WebSocket when immediate = false, but the open method is called', () => {
    // Arrange
    const wsgo = WSGO(`ws://localhost:${port}`, {
      immediate: false,
    })

    // Act
    wsgo.open()

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CONNECTING)
    // check source data
    expect(wsgo.ws?.url).toBe(`ws://localhost:${port}/`)
  })
})
