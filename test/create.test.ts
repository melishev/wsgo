import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import WSGO from '../src/index'
import ws from 'ws'
import { createMockWSServer } from './utils'

describe('create', () => {
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

  it('should create a WebSocket, and connect to the server when immediate = default value of', () => {
    // Act
    const wsgo = WSGO(`ws://localhost:${port}`)

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CONNECTING)
  })

  it('should create a WebSocket, and connect to the server when immediate = true', () => {
    // Act
    const wsgo = WSGO(`ws://localhost:${port}`, {
      immediate: true,
    })

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CONNECTING)
  })

  it('should not create WebSocket when immediate = false', () => {
    // Act
    const wsgo = WSGO(`ws://localhost:${port}`, {
      immediate: false,
    })

    // Assert
    expect(wsgo.ws).toBeUndefined()
  })

  // TODO: write tests for options
})
