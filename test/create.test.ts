import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import WSGO from '../src/index'
import { createMockWSServer } from './utils'

describe('create', () => {
  let mockWSServer: ReturnType<typeof createMockWSServer>

  beforeEach(() => {
    mockWSServer = createMockWSServer()
  })

  afterEach(() => {
    mockWSServer.server.close()
  })

  it('should create a WebSocket, and connect to the server when immediate = default value of', () => {
    // Act
    const wsgo = WSGO(`ws://localhost:${mockWSServer.port}`)

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CONNECTING)
  })

  it('should create a WebSocket, and connect to the server when immediate = true', () => {
    // Act
    const wsgo = WSGO(`ws://localhost:${mockWSServer.port}`, {
      immediate: true,
    })

    // Assert
    expect(wsgo.ws).toBeInstanceOf(window.WebSocket)
    expect(wsgo.ws?.readyState).toBe(window.WebSocket.CONNECTING)
  })

  it('should not create WebSocket when immediate = false', () => {
    // Act
    const wsgo = WSGO(`ws://localhost:${mockWSServer.port}`, {
      immediate: false,
    })

    // Assert
    expect(wsgo.ws).toBeUndefined()
  })

  // TODO: write tests for options
})
