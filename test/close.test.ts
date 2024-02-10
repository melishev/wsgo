import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import WSGO from '../src/index'
import ws from 'ws'
import { createMockWSServer } from './utils'

describe('close', () => {
  let port: number = 0
  let server: ws.Server

  beforeAll(() => {
    const mockWSServer = createMockWSServer(port)

    server = mockWSServer.server
    port = mockWSServer.port
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
